//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2026 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `search_apply.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Apply search querry.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller::strategies::v2::OopsieV2Controller,
    log_error, log_info, log_warn,
    state::data::{global_search::SearchResult, AppData},
};

use std::{
    fs::File,
    io::{BufWriter, Write},
};
use std::{fs::OpenOptions, io::BufReader};

pub fn execute(
    data: &mut AppData,
    alternative: String,
    pattern: String,
    matches_reader: &mut Option<BufReader<File>>,
) -> Result<SearchResult, String> {
    let _log = ScopeLog::new(&execute);

    *matches_reader = None;

    let mut column_index_opt: Option<usize> = None;
    {
        let mut index: usize = 0;
        for tag in data.regex_tags.compute_active_tags() {
            if tag.id.eq(&alternative) {
                column_index_opt = Some(index + 1);
                break;
            }
            index += 1;
        }
    }
    if column_index_opt.is_none() {
        return Err(String::from(format!(
            "Could not find tag with ID {}",
            alternative
        )));
    }

    let mut out = SearchResult::default();

    if data.logs.get_raw_logs_path().is_empty() {
        log_info!(
            &execute,
            "Raw logs path was not set, returning empty log chunk"
        );
        return Ok(out);
    }

    let mut matches_writer = BufWriter::new(
        OpenOptions::new()
            .create(true)
            .write(true)
            .truncate(true)
            .open(OopsieV2Controller::get_search_matches_path(&data.logs))
            .map_err(|e| format!("Failed to open matches.bin: {}", e))?,
    );

    let mut csv_reader = match csv::ReaderBuilder::new()
        .has_headers(false)
        .from_path(OopsieV2Controller::get_filtered_database_path(&data.logs))
    {
        Ok(reader) => reader,
        Err(err) => {
            log_error!(&execute, "CSV Reader error: {}", err);
            return Err(format!("CSV Reader error: {}", err));
        }
    };

    let regex_pattern = regex::Regex::new(&pattern).unwrap();
    let column_index =
        column_index_opt.expect("Should not reach here if the column index option is None");

    out.search_total = 0;
    let mut record_index: i64 = -1;
    for record in csv_reader.records() {
        record_index += 1;

        let data = match record {
            Ok(data) => data,
            Err(err) => {
                log_error!(&execute, "CSV record error: {}", err);
                return Err(format!("CSV record error: {}", err));
            }
        };

        if let Some(field) = data.get(column_index) {
            if regex_pattern.is_match(field) {
                matches_writer
                    .write_all(&record_index.to_le_bytes())
                    .map_err(|e| format!("Failed to write record index: {}", e))?;

                if out.row_index == -1 {
                    out.row_index = record_index;
                    out.search_index = 0;
                }

                out.search_total += 1;
                out.has_prev = false;
            }
        } else {
            log_warn!(
                &execute,
                "Missing field at col index {} in {:?}",
                column_index,
                data
            );
        }
    }

    matches_writer
        .flush()
        .map_err(|e| format!("Failed to flush matches.bin: {}", e))?;

    out.has_next = out.search_total > 1;

    matches_reader.replace(OopsieV2Controller::open_search_matches_reader(&data.logs));

    Ok(out)
}
