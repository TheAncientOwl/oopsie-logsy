//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.6
//! **Description**: Filter logs logics.
//!

use std::sync::Arc;

use chrono::Utc;

use crate::{
    common::scope_log::ScopeLog,
    controller::oopsie::v1::{
        common::{
            disk_io::{
                active_logs_writer::{DEFAULT_FILTER_ID, DEFAULT_FILTER_INDEX},
                config_file::ConfigFile,
                filter_id_idx_map::FiltersIndexIdMap,
            },
            filtering_orchestrator::{self, FilteringOrchestrator},
            logs_config_keys,
        },
        OopsieV1Controller,
    },
    log_trace,
    state::data::{filters::ActiveFilter, paths::filters::get_filter_ids_map_path, AppData},
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

pub fn execute(data: &mut AppData) -> Result<String, String> {
    let _log = ScopeLog::new(&execute);

    let mut config = ConfigFile::load(OopsieV1Controller::get_logs_config_path(&data.logs));
    let active_tags = data.regex_tags.compute_active_tags();

    let mut active_filters = data.filters.compute_active_filters(&active_tags);
    if active_filters.len() == 0 {
        return Ok(String::from("No active filters found"));
    }
    log_trace!(&execute, "Active filters: {:?}", active_filters);
    active_filters.sort_by(|a, b| b.priority.cmp(&a.priority));
    log_trace!(&execute, "Sorted active filters: {:?}", active_filters);

    let field_readers = OopsieV1Controller::open_field_readers(&active_tags, &data.logs);
    let filters_disk_map = get_filters_disk_map(&active_filters);

    let filtering_orchestrator = Arc::new(FilteringOrchestrator::new(
        config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as usize,
        400, // read_chunk_size
        15,  // reading_threads_count
        30,  // filtering_threads_count
        active_filters,
        filters_disk_map,
        field_readers,
        active_tags.len(),
    ));
    let (new_active_logs_count, filtered_logs) =
        filtering_orchestrator::run(filtering_orchestrator);

    // log_debug!(&execute, "Filtered logs: {:?}", filtered_logs);

    config.set_number(
        logs_config_keys::ACTIVE_LOGS_COUNT,
        new_active_logs_count as u128,
    );
    config.save();

    let mut active_logs_writer = OopsieV1Controller::open_active_logs_writer(&data.logs);
    filtered_logs.iter().for_each(|log| {
        // log_debug!(&execute, "Writing log index {}", log.index);
        active_logs_writer.write(log.index, log.filter_id_index);
    });
    active_logs_writer.flush();

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
