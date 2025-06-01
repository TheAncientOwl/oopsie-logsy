//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logs_converter.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.10
//! **Description**: Convert input log file from txt format to internal OopsieLogsy format.
//!

use std::{fs::File, io::BufRead};

use crate::{
    common::{config_file::ConfigFile, scope_log::ScopeLog},
    log_error, log_trace,
    store::{logs::ColumnLogsView, store::Store},
};

use super::common::index_range::IndexRange;

pub fn execute(
    input_path: &std::path::PathBuf,
    output_path: &std::path::PathBuf,
    desired_range: IndexRange,
) -> ColumnLogsView {
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

    let mut out = ColumnLogsView::new(active_tags.len());
    let mut field_writers = store.logs.open_current_field_writers(&active_tags);

    let mut reader = std::io::BufReader::new(in_file);

    let mut line = String::new();
    reader
        .read_line(&mut line)
        .expect("Failed to read first line");
    // log_debug!(&execute, "Converting: {}", line);
    if let Some(caps) = line_regex.captures(&line) {
        // log_debug!(&execute, "Regex matched");
        out.total_logs += 1;
        for idx in 1..caps.len() {
            if let Some(m) = caps.get(idx) {
                // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());
                if desired_range.contains(0) {
                    out.logs[idx - 1].push(m.as_str().to_owned());
                }

                field_writers[idx - 1].write(m.as_str());
            }
        }
    } else {
        // TODO: handle error and report to frontend
        log_error!(&execute, "Regex did not match");
    }

    for line in reader.lines() {
        out.total_logs += 1;
        let line = line.expect("Failed to read line");
        // log_debug!(&execute, "Converting: {}", line);

        if let Some(caps) = line_regex.captures(&line) {
            for idx in 1..caps.len() {
                if let Some(m) = caps.get(idx) {
                    // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());
                    if desired_range.contains(idx) {
                        let logs = &mut out.logs[idx - 1];
                        logs.push(m.as_str().to_owned());
                    }

                    field_writers[idx - 1].write(m.as_str());
                }
            }
        } else {
            // TODO: handle error and report to frontend
            log_error!(&execute, "No match for line: {}", line);
        }
    }

    field_writers.iter_mut().for_each(|writer| writer.flush());

    let mut config = ConfigFile::new(store.logs.get_current_processed_logs_config_path());
    config.create_and_load();
    config.set_number("logs_count", out.total_logs as u128);
    config.save();

    out
}
