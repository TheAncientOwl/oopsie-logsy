//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `convert_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Convert raw logs to OopsieLogsyV2 format.
//!

use std::{fs::File, io::BufRead};

use chrono::Utc;
use polars::prelude::LazyFrame;

use crate::{
    common::scope_log::ScopeLog,
    controller::strategies::v2::{
        common::config_file::{ConfigFile, TOTAL_FILTERED_LOGS_KEY},
        OopsieV2Controller,
    },
    log_trace, log_warn,
    state::data::AppData,
};

pub const DEFAULT_FILTER_ID: &str = "default";

pub fn execute(data: &mut AppData, logs_frame: &mut Option<LazyFrame>) -> Result<String, String> {
    let _log = ScopeLog::new(&execute);

    *logs_frame = None;

    // TODO: cleanup
    let input_path = &data.logs.get_raw_logs_path()[0];
    let database_path = OopsieV2Controller::get_database_path(&data.logs);
    let filtered_database_path = OopsieV2Controller::get_filtered_database_path(&data.logs);
    log_trace!(
        &execute,
        "Converting log file \"{}\" into \"{}\" + \"{}\"",
        input_path.to_str().unwrap_or("Unknown"),
        database_path.to_str().unwrap_or("Unknown"),
        filtered_database_path.to_str().unwrap_or("Unknown")
    );

    let line_regex = data.regex_tags.get_line_regex();

    let mut main_csv_writer = csv::Writer::from_path(database_path)
        .expect("[OopsieV2Controller] Failed to open output file during conversion");
    let mut filtered_csv_writer = csv::Writer::from_path(filtered_database_path)
        .expect("[OopsieV2Controller] Failed to open output file during conversion");

    let in_file = File::open(input_path)
        .expect("[OopsieV2Controller] Failed to open logs input file for conversion");
    let reader = std::io::BufReader::new(in_file);

    let mut total_logs: u128 = 0;
    for line in reader.lines() {
        let line = line.expect("Failed to read line");

        if let Some(caps) = line_regex.captures(&line) {
            total_logs += 1;

            let _res = filtered_csv_writer.write_field(DEFAULT_FILTER_ID);

            for idx in 1..caps.len() {
                if let Some(col_entry) = caps.get(idx) {
                    let _res = main_csv_writer.write_field(col_entry.as_str());
                    let _res = filtered_csv_writer.write_field(col_entry.as_str());
                }
            }

            let _res = main_csv_writer.write_record(None::<&[u8]>);
            let _res = filtered_csv_writer.write_record(None::<&[u8]>);
        } else {
            // TODO: handle warning and report to frontend
            log_warn!(
                &execute,
                "Regex {} did not match entry '{}'",
                line_regex,
                line
            );
        }
    }

    let _res = main_csv_writer.flush();
    let _res = filtered_csv_writer.flush();

    let mut config = ConfigFile::overwrite(OopsieV2Controller::get_config_path(&data.logs));
    config.set_number(TOTAL_FILTERED_LOGS_KEY, total_logs);
    config.save();

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
