//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Set FilterTabs command.
//!

use std::io::{BufRead, Read};

use crate::{
    common::scope_log::ScopeLog,
    log_error, log_trace, logics,
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        logs::ColumnLogs,
        store::Store,
    },
};

fn log_data(tabs: &Vec<FilterTab>, filters: &Vec<Filter>, components: &Vec<FilterComponent>) {
    log_trace!(
        &apply_filters,
        "Received {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &apply_filters,
        "Received {} filters: {}",
        filters.len(),
        serde_json::to_string(&filters)
            .unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &apply_filters,
        "Received {} components: {}",
        components.len(),
        serde_json::to_string(&components)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );
}

// TODO: refactor and cleanup this mess
#[tauri::command]
pub fn apply_filters(
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
) -> Result<(ColumnLogs, Vec<String>, bool), String> {
    let _log = ScopeLog::new(&apply_filters);

    log_data(&tabs, &filters, &components);

    let mut store = Store::get_instance_mut();

    store.filters.set(&tabs, &filters, &components);

    let active_tags = store.regex_tags.compute_active_tags();
    let log_fields_count = active_tags.len();
    let mut active_filters = store.filters.compute_active_filters(&active_tags);

    if active_filters.len() == 0 {
        std::mem::drop(store);
        return Ok((logics::read_converted_logs::execute(), Vec::new(), false));
    }

    log_trace!(&apply_filters, "Active filters: {:?}", active_filters);
    active_filters.sort_by(|a, b| b.filter.priority.cmp(&a.filter.priority));
    log_trace!(
        &apply_filters,
        "Sorted active filters: {:?}",
        active_filters
    );

    let mut field_readers = store.logs.open_current_field_readers(&active_tags);

    let mut out_filtered_logs: ColumnLogs = store.logs.make_empty_column_logs(log_fields_count);
    let mut out_filters: Vec<String> = Vec::new();

    // TODO: Change config storage approach
    let config_file = store
        .logs
        .open_current_processed_logs_config_file_in()
        .map_err(|err| log_error!(&apply_filters, "Error while opening config file: {}", err))
        .unwrap();
    let mut config_reader = std::io::BufReader::new(config_file);
    let mut buf = [0u8; 8];
    config_reader
        .read_exact(&mut buf)
        .expect("Failed to read from config file");
    let logs_count = u64::from_le_bytes(buf);
    // TODO: end

    let mut field_value_buf = String::with_capacity(512);
    let mut log_entry_buf: Vec<String> = Vec::with_capacity(log_fields_count);
    for _ in 0..logs_count {
        log_entry_buf.clear();

        field_readers.iter_mut().for_each(|field_reader| {
            field_value_buf.clear();
            field_reader
                .read_line(&mut field_value_buf)
                .expect("Failed to read field");
            field_value_buf.pop();

            log_entry_buf.push(field_value_buf.as_str().to_owned());
        });

        if let Some(active_filter) = active_filters.iter().find(|filter| {
            filter.components.iter().all(|component| {
                component.is_equals == component.is_match(&log_entry_buf[component.field_index])
            })
        }) {
            for (field_idx, field_value) in log_entry_buf.drain(..).enumerate() {
                out_filtered_logs[field_idx].push(field_value);
            }
            out_filters.push(active_filter.filter.id.clone());
        }
    }

    Ok((out_filtered_logs, out_filters, true))
}
