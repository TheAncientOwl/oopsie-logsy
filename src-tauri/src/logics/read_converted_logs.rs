//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `read_converted_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Read all converted logs and return Column data out of it.
//!

use std::io::{BufRead, Read};

use crate::{
    log_error,
    store::{regex_tags::RegexTag, store::Store},
};

// TODO: consider using a separate threads for each field. Current impl works for prorotyping
pub fn execute() -> Vec<Vec<String>> {
    let store = Store::get_instance();

    let active_tags: Vec<&RegexTag> = store
        .regex_tags
        .get_tags()
        .iter()
        .filter(|tag| tag.displayed)
        .collect();

    let mut field_readers: Vec<std::io::BufReader<std::fs::File>> = active_tags
        .iter()
        .map(|tag| {
            let file = store
                .logs
                .open_field_file_in(&tag.name)
                .map_err(|err| {
                    log_error!(
                        &execute,
                        "Error opening output field file {}: {}",
                        tag.name,
                        err
                    );
                })
                .unwrap();
            std::io::BufReader::new(file)
        })
        .collect();

    let config_file = store
        .logs
        .open_current_processed_logs_config_file_in()
        .map_err(|err| log_error!(&execute, "Error while opening config file: {}", err))
        .unwrap();
    let mut config_reader = std::io::BufReader::new(config_file);
    let mut buf = [0u8; 8];
    config_reader
        .read_exact(&mut buf)
        .expect("Failed to read from config file");
    let logs_count = u64::from_le_bytes(buf);

    let mut out_logs: Vec<Vec<String>> = Vec::with_capacity(active_tags.len());
    active_tags.iter().for_each(|_| {
        out_logs.push(Vec::with_capacity(logs_count as usize));
    });

    let mut buf = String::with_capacity(512);
    for _ in 0..logs_count {
        let mut field_idx = 0;
        field_readers.iter_mut().for_each(|field_reader| {
            buf.clear();
            field_reader
                .read_line(&mut buf)
                .expect("Failed to read field");
            buf.pop();

            out_logs[field_idx].push(buf.to_owned());
            field_idx += 1;
        });
    }

    out_logs
}
