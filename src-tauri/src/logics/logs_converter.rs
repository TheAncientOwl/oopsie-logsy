//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logs_converter.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Convert input log file from txt format to internal OopsieLogsy format.
//!

use std::{
    fs::{File, OpenOptions},
    io::{BufRead, Write},
};

use regex::Regex;

use crate::{
    common::scope_log::ScopeLog,
    log_error, log_info, log_warn,
    store::{regex_tags::RegexTag, store::Store},
};

fn convert(in_file: &File, out_file: &File, tags: &Vec<RegexTag>, line_regex: &Regex) {
    let _log = ScopeLog::new(&convert);

    let mut common_length: usize = 3; // {} and \n
    let mut idx_to_tag: Vec<&str> = Vec::new();
    idx_to_tag.push("");
    tags.iter().for_each(|tag| {
        if tag.displayed {
            idx_to_tag.push(&tag.name);
            common_length = common_length + 5 + tag.name.len(); // 4 x '"' + ','
        }
    });

    let reader = std::io::BufReader::new(in_file);
    let mut writer = std::io::BufWriter::new(out_file);
    let mut json_buffer = String::with_capacity(512);

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        // log_debug!(&execute, "Converting: {}", line);

        if let Some(caps) = line_regex.captures(&line) {
            let mut content_length: usize = 0;

            for idx in 1..caps.len() {
                if let Some(m) = caps.get(idx) {
                    content_length += m.as_str().len();
                }
            }

            json_buffer.clear();
            json_buffer.reserve(common_length + content_length);

            json_buffer.push('{');
            for idx in 1..caps.len() {
                if let Some(m) = caps.get(idx) {
                    json_buffer.push('"');
                    json_buffer.push_str(&idx_to_tag[idx]);
                    json_buffer.push_str("\":");
                    json_buffer.push_str(&json::stringify(m.as_str()));
                    json_buffer.push(',');

                    // log_debug!(&execute, "Capture group {}: {}", idx, m.as_str());
                }
            }
            json_buffer.pop();
            json_buffer.push_str("}\n");
            // log_debug!(&execute, "JSON: {}", json_buffer);

            let _ = writer
                .write_all(json_buffer.as_bytes())
                .map_err(|err| log_error!(&execute, "Error writing json line: {}", err));
        } else {
            log_warn!(&execute, "No match for line: {}", line);
        }
    }

    let _ = writer
        .flush()
        .map_err(|err| log_error!(&execute, "Error flushing writer: {}", err));
}

pub fn execute(input_path: &std::path::PathBuf, output_path: &std::path::PathBuf) {
    let _log = ScopeLog::new(&execute);

    log_info!(
        &execute,
        "Converting log file \"{}\" into \"{}\"",
        input_path.to_str().unwrap_or("Unknown"),
        output_path.to_str().unwrap_or("Unknown")
    );

    let in_file = File::open(input_path).expect("Failed to open logs input file for conversion");
    let out_file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(output_path)
        .map_err(|err| {
            log_error!(
                &execute,
                "Error opening output file {}: {}",
                output_path.to_str().unwrap_or("Unknown"),
                err
            );
        })
        .unwrap();

    let store = Store::get_instance();
    let tags = store.regex_tags.get_tags();
    let line_regex = store.regex_tags.get_line_regex();

    convert(&in_file, &out_file, &tags, &line_regex);
}
