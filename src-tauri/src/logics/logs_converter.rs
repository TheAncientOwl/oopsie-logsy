//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logs_converter.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: Convert input log file from txt format to internal OopsieLogsy format.
//!

use std::{
    fs::File,
    io::{BufRead, Write},
};

use crate::{
    common::scope_log::ScopeLog,
    log_error, log_trace,
    store::{logs::ColumnLogs, store::Store},
};

fn write_entry(writer: &mut std::io::BufWriter<File>, value: &str, tag: &str) {
    writer
        .write(value.as_bytes())
        .map_err(|err| {
            log_error!(
                &execute,
                "Error while writing value \"{}\" to field file \"{}\": {}",
                value,
                tag,
                err
            );
        })
        .unwrap();
    writer
        .write(b"\n")
        .map_err(|err| {
            log_error!(
                &execute,
                "Error while writing '\\n' to field file \"{}\": {}",
                tag,
                err
            );
        })
        .unwrap();
}

pub fn execute(input_path: &std::path::PathBuf, output_path: &std::path::PathBuf) -> ColumnLogs {
    let _log = ScopeLog::new(&execute);

    log_trace!(
        &execute,
        "Converting log file \"{}\" into \"{}\"",
        input_path.to_str().unwrap_or("Unknown"),
        output_path.to_str().unwrap_or("Unknown")
    );

    let in_file = File::open(input_path).expect("Failed to open logs input file for conversion");

    let store = Store::get_instance();
    let active_tags = store.regex_tags.compute_active_tags();
    let line_regex = store.regex_tags.get_line_regex();

    let mut field_logs: ColumnLogs = Vec::new();
    let mut field_writers: Vec<std::io::BufWriter<File>> = Vec::new();

    let mut reader = std::io::BufReader::new(in_file);

    let mut line = String::new();
    reader
        .read_line(&mut line)
        .expect("Failed to read first line");
    // log_debug!(&execute, "Converting: {}", line);
    if let Some(caps) = line_regex.captures(&line) {
        // log_debug!(&execute, "Regex matched");
        for idx in 1..caps.len() {
            if let Some(m) = caps.get(idx) {
                // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());
                let mut logs: Vec<String> = Vec::new();
                logs.push(m.as_str().to_owned());
                field_logs.push(logs);

                let field_file = store
                    .logs
                    .open_field_file_out(&active_tags[idx - 1].name)
                    .map_err(|err| {
                        log_error!(
                            &execute,
                            "Error opening output field file {}: {}",
                            active_tags[idx - 1].name,
                            err
                        );
                    })
                    .unwrap();
                let mut writer = std::io::BufWriter::new(field_file);
                write_entry(&mut writer, m.as_str(), &active_tags[idx - 1].name);
                field_writers.push(writer);
            }
        }
    } else {
        // TODO: handle error and report to frontend
        log_error!(&execute, "Regex did not match");
    }

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        // log_debug!(&execute, "Converting: {}", line);

        if let Some(caps) = line_regex.captures(&line) {
            for idx in 1..caps.len() {
                if let Some(m) = caps.get(idx) {
                    // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());
                    let logs = &mut field_logs[idx - 1];
                    logs.push(m.as_str().to_owned());

                    write_entry(
                        &mut field_writers[idx - 1],
                        m.as_str(),
                        &active_tags[idx - 1].name,
                    );
                }
            }
        } else {
            // TODO: handle error and report to frontend
            log_error!(&execute, "No match for line: {}", line);
        }
    }

    field_writers.iter_mut().for_each(|writer| {
        let _ = writer
            .flush()
            .map_err(|err| log_error!(&execute, "Error flushing writer: {}", err));
    });

    let config_file = store
        .logs
        .open_current_processed_logs_config_file_out()
        .map_err(|err| log_error!(&execute, "Failed to open config file: {}", err))
        .unwrap();
    let mut writer = std::io::BufWriter::new(config_file);
    writer
        .write_all(&(field_logs[0].len() as u64).to_le_bytes())
        .map_err(|err| log_error!(&execute, "Failed to write length to config file: {}", err))
        .unwrap();
    let _ = writer
        .flush()
        .map_err(|err| log_error!(&execute, "Error flushing writer: {}", err));

    field_logs
}
