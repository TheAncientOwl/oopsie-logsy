//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Filter logs logics.
//!

use chrono::Utc;

use crate::{
    common::scope_log::ScopeLog,
    controller::common::{
        disk_io::{
            active_logs_writer::{DEFAULT_FILTER_ID, DEFAULT_FILTER_INDEX},
            config_file::ConfigFile,
            filter_id_idx_map::FiltersIndexIdMap,
        },
        logs_config_keys,
    },
    log_trace,
    store::{filters::ActiveFilter, paths::filters::get_filter_ids_map_path, store::Store},
};

fn get_filters_disk_map(active_filters: &Vec<ActiveFilter>) -> FiltersIndexIdMap {
    let _log = ScopeLog::new(&get_filters_disk_map);

    let mut filters_disk_map = FiltersIndexIdMap::load(get_filter_ids_map_path());
    if filters_disk_map.is_empty() {
        filters_disk_map.set(DEFAULT_FILTER_ID.to_owned(), DEFAULT_FILTER_INDEX);
    }
    filters_disk_map.update_with(&active_filters);
    filters_disk_map.save();

    filters_disk_map
}

fn find_matching_filter<'a>(
    target: &Vec<String>,
    active_filters: &'a Vec<ActiveFilter>,
) -> Option<&'a ActiveFilter<'a>> {
    let _log = ScopeLog::new(&find_matching_filter);

    active_filters.iter().find(|filter| {
        filter.components.iter().all(|component| {
            component.is_equals == component.is_match(&target[component.field_index])
        })
    })
}

pub fn execute() -> Result<String, String> {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance_mut();

    let mut config = ConfigFile::load(store.logs.get_logs_config_path());
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

    let filters_disk_map = get_filters_disk_map(&active_filters);

    let mut new_active_logs_count: usize = 0;

    let mut log_entry_buf: Vec<String> = Vec::with_capacity(active_tags.len());
    for log_index in 0..(config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as u64) {
        log_entry_buf.clear();

        field_readers.iter_mut().for_each(|field_reader| {
            log_entry_buf.push(field_reader.read_at(log_index));
        });

        if let Some(active_filter) = find_matching_filter(&log_entry_buf, &active_filters) {
            // log_debug!(
            //     &execute,
            //     "log {} matches filter {}",
            //     log_idx,
            //     active_filter.filter.id
            // );
            new_active_logs_count += 1;

            if let Some(filter_index) = filters_disk_map.get_index_of(&active_filter.filter.id) {
                active_logs_writer.write(log_index as u64, *filter_index);
            } else {
                active_logs_writer.write(log_index as u64, DEFAULT_FILTER_INDEX);
            }
        }
    }

    config.set_number(
        logs_config_keys::ACTIVE_LOGS_COUNT,
        new_active_logs_count as u128,
    );
    config.save();

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
