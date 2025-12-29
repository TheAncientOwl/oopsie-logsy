//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Filter logs.
//!

use chrono::Utc;
use csv::StringRecord;

use crate::{
    common::scope_log::ScopeLog,
    controller::strategies::v2::OopsieV2Controller,
    log_debug, log_error, log_info,
    state::data::{filters::ActiveFilter, AppData},
};

fn find_matching_filter<'a>(
    target: &StringRecord,
    active_filters: &'a Vec<ActiveFilter>,
) -> Option<&'a ActiveFilter> {
    active_filters.iter().find(|filter| {
        filter.components.iter().all(|component| {
            if component.metadata.is_regex {
                component.metadata.is_equals == component.is_match(&target[component.field_index])
            } else if component.metadata.is_equals {
                component.metadata.data == target[component.field_index]
            } else {
                component.metadata.data != target[component.field_index]
            }
        })
    })
}

pub fn execute(data: &mut AppData) -> Result<String, String> {
    let _log = ScopeLog::new(&execute);

    let active_tags = data.regex_tags.compute_active_tags();
    log_debug!(&execute, "Active tags: {:?}", active_tags);

    let mut active_filters = data.filters.compute_active_filters(&active_tags);
    if active_filters.len() == 0 {
        return Ok(String::from("No active filters found"));
    }
    log_info!(&execute, "Active filters: {:?}", active_filters);
    active_filters.sort_by(|a, b| b.priority.cmp(&a.priority));
    log_info!(&execute, "Sorted active filters: {:?}", active_filters);

    let mut csv_reader =
        match csv::Reader::from_path(OopsieV2Controller::get_database_path(&data.logs)) {
            Ok(reader) => reader,
            Err(err) => {
                log_error!(&execute, "CSV Reader error: {}", err);
                return Err(format!("CSV Reader error: {}", err));
            }
        };

    let mut csv_writer =
        match csv::Writer::from_path(OopsieV2Controller::get_filtered_database_path(&data.logs)) {
            Ok(writer) => writer,
            Err(err) => {
                log_error!(&execute, "CSV Writer error: {}", err);
                return Err(format!("CSV Writer error: {}", err));
            }
        };

    for record in csv_reader.records() {
        let data = match record {
            Ok(data) => data,
            Err(err) => {
                log_error!(&execute, "CSV record error: {}", err);
                return Err(format!("CSV record error: {}", err));
            }
        };

        if let Some(active_filter) = find_matching_filter(&data, &active_filters) {
            let _res = csv_writer.write_field(&active_filter.filter_id);
            let _res = csv_writer.write_record(&data);
        }
    }

    let _res = csv_writer.flush();

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
