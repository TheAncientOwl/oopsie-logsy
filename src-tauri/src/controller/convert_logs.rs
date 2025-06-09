//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `convert_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Convert raw logs to OopsieLogsy format.
//!

use std::{fs::File, io::BufRead};

use chrono::Utc;

use crate::{
    common::scope_log::ScopeLog,
    controller::common::{
        disk_io::{active_logs_writer::DEFAULT_FILTER_ID, config_file::ConfigFile},
        logs_config_keys,
    },
    log_error, log_trace,
    store::store::Store,
};

pub fn execute() -> Result<String, String> {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance();

    let input_path = &store.logs.get_raw_logs_path()[0];
    let output_dir_path = store.logs.get_working_dir();
    log_trace!(
        &execute,
        "Converting log file \"{}\" into \"{}\"",
        input_path.to_str().unwrap_or("Unknown"),
        output_dir_path.to_str().unwrap_or("Unknown")
    );

    let active_tags = store.regex_tags.compute_active_tags();
    let line_regex = store.regex_tags.get_line_regex();

    let mut total_logs_count: u64 = 0;
    let mut field_writers = store.logs.open_field_writers(&active_tags);

    let in_file = File::open(input_path).expect("Failed to open logs input file for conversion");
    let mut reader = std::io::BufReader::new(in_file);

    let mut active_logs_writer = store.logs.open_active_logs_writer();

    let mut line = String::new();
    reader
        .read_line(&mut line)
        .expect("Failed to read first line");
    // log_debug!(&execute, "Converting: {}", line);
    if let Some(caps) = line_regex.captures(&line) {
        // log_debug!(&execute, "Regex matched");
        active_logs_writer.write(total_logs_count, DEFAULT_FILTER_ID);
        total_logs_count += 1;

        for idx in 1..caps.len() {
            if let Some(m) = caps.get(idx) {
                // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());

                let _write_result = field_writers[idx - 1].write(m.as_str());
                // log_debug!(
                //     &execute,
                //     "write result ~ offset: {} | size: {}",
                //     _write_result.offset,
                //     _write_result.size
                // );
            }
        }
    } else {
        // TODO: handle error and report to frontend
        log_error!(&execute, "Regex did not match");
    }

    for line in reader.lines() {
        active_logs_writer.write(total_logs_count, DEFAULT_FILTER_ID);

        total_logs_count += 1;
        let line = line.expect("Failed to read line");
        // log_debug!(&execute, "Converting: {}", line);

        if let Some(caps) = line_regex.captures(&line) {
            for idx in 1..caps.len() {
                if let Some(m) = caps.get(idx) {
                    // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());

                    let _write_result = field_writers[idx - 1].write(m.as_str());
                    // log_debug!(
                    //     &execute,
                    //     "write result ~ {} | offset: {} | size: {}",
                    //     active_tags[idx - 1].name,
                    //     _write_result.offset,
                    //     _write_result.size
                    // );
                }
            }
        } else {
            // TODO: handle error and report to frontend
            log_error!(&execute, "No match for line: {}", line);
        }
    }

    field_writers.iter_mut().for_each(|writer| writer.flush());

    let mut config = ConfigFile::overwrite(store.logs.get_logs_config_path());
    config.set_number(logs_config_keys::TOTAL_LOGS_COUNT, total_logs_count as u128);
    config.set_number(
        logs_config_keys::ACTIVE_LOGS_COUNT,
        total_logs_count as u128,
    );
    config.save();

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
