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
//! **Description**: Filter logs logics.
//!

use chrono::Utc;

use crate::{
    controller::common::{disk_io::config_file::ConfigFile, logs_config_keys},
    log_trace,
    store::store::Store,
};

pub fn execute() -> Result<String, String> {
    let store = Store::get_instance_mut();

    let active_tags = store.regex_tags.compute_active_tags();

    let mut active_filters = store.filters.compute_active_filters(&active_tags);
    if active_filters.len() == 0 {
        return Ok(String::from("No active filters found"));
    }

    log_trace!(&execute, "Active filters: {:?}", active_filters);
    active_filters.sort_by(|a, b| b.filter.priority.cmp(&a.filter.priority));
    log_trace!(&execute, "Sorted active filters: {:?}", active_filters);

    let mut field_readers = store.logs.open_field_readers(&active_tags);
    let mut active_logs_writer = store.logs.open_active_logs_writer();

    let mut config = ConfigFile::load(store.logs.get_logs_config_path());

    let total_logs_count = config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as u64;
    let mut new_active_logs_count: usize = 0;
    let mut log_entry_buf: Vec<String> = Vec::with_capacity(active_tags.len());
    for log_index in 0..total_logs_count {
        log_entry_buf.clear();

        field_readers.iter_mut().for_each(|field_reader| {
            log_entry_buf.push(field_reader.read_at(log_index));
        });

        if let Some(active_filter) = active_filters.iter().find(|filter| {
            filter.components.iter().all(|component| {
                component.is_equals == component.is_match(&log_entry_buf[component.field_index])
            })
        }) {
            active_logs_writer.write(log_index as u64, &active_filter.filter.id);
            new_active_logs_count += 1;
            // log_debug!(
            //     &execute,
            //     "log {} matches filter {}",
            //     log_idx,
            //     active_filter.filter.id
            // );
        }
    }

    config.set_number(
        logs_config_keys::ACTIVE_LOGS_COUNT,
        new_active_logs_count as u128,
    );
    config.save();

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
