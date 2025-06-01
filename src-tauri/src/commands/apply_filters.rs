//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: Set FilterTabs command.
//!

use std::io::BufRead;

use crate::{
    common::{config_file::ConfigFile, scope_log::ScopeLog},
    log_trace,
    logics::{self, common::index_range::IndexRange},
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        logs::ColumnLogsView,
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
    desired_range: IndexRange,
) -> Result<(ColumnLogsView, Vec<String>, bool), String> {
    let _log = ScopeLog::new(&apply_filters);

    log_data(&tabs, &filters, &components);

    let mut store = Store::get_instance_mut();

    store.filters.set(&tabs, &filters, &components);

    let active_tags = store.regex_tags.compute_active_tags();

    let mut active_filters = store.filters.compute_active_filters(&active_tags);
    if active_filters.len() == 0 {
        std::mem::drop(store);
        return Ok((
            logics::read_converted_logs::execute(desired_range),
            Vec::new(),
            false,
        ));
    }
    log_trace!(&apply_filters, "Active filters: {:?}", active_filters);
    active_filters.sort_by(|a, b| b.filter.priority.cmp(&a.filter.priority));
    log_trace!(
        &apply_filters,
        "Sorted active filters: {:?}",
        active_filters
    );

    let mut field_readers = store.logs.open_current_field_readers(&active_tags);

    let mut out_logs =
        ColumnLogsView::new_with_field_capacity(active_tags.len(), desired_range.size());
    let mut out_filters: Vec<String> = Vec::new();

    let mut config = ConfigFile::new(store.logs.get_current_processed_logs_config_path());
    config.load();
    let logs_count = config.get_number("logs_count", 0) as usize;

    let mut field_value_buf = String::with_capacity(512);
    let mut log_entry_buf: Vec<String> = Vec::with_capacity(active_tags.len());
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
            out_logs.total_logs += 1;
            for (field_idx, field_value) in log_entry_buf.drain(..).enumerate() {
                out_logs.logs[field_idx].push(field_value);
            }
            out_filters.push(active_filter.filter.id.clone());
        }
    }

    Ok((out_logs, out_filters, true))
}
