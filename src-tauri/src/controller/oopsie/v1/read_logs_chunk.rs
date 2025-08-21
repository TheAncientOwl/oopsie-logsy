//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `read_logs_chunk.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Read logs chunk logics.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller::oopsie::v1::{
        common::{
            disk_io::{
                active_logs_writer::DEFAULT_FILTER_ID, config_file::ConfigFile,
                filter_id_idx_map::FiltersIndexIdMap,
            },
            logs_config_keys,
        },
        OopsieV1Controller,
    },
    log_info,
    state::{
        controller::common::index_range::IndexRange,
        data::{logs::ColumnLogsChunk, paths::filters::get_filter_ids_map_path, AppData},
    },
};

// TODO: consider using separate threads for each field. Current impl works for protoyping
pub fn execute(data: &mut AppData, desired_range: IndexRange) -> Result<ColumnLogsChunk, String> {
    let _log = ScopeLog::new(&execute);

    let active_tags = data.regex_tags.compute_active_tags();
    let mut out = ColumnLogsChunk::new_with_field_capacity(active_tags.len(), desired_range.size());

    if data.logs.get_raw_logs_path().is_empty() {
        log_info!(
            &execute,
            "Raw logs path was not set, returning empty log chunk"
        );
        return Ok(out);
    }

    let mut field_readers = OopsieV1Controller::open_field_readers(&active_tags, &data.logs);
    let mut active_logs_reader = OopsieV1Controller::open_active_logs_reader(&data.logs);

    let config = ConfigFile::load(OopsieV1Controller::get_logs_config_path(&data.logs));
    out.total_logs = config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as u64;
    let active_logs_count = config.get_number(logs_config_keys::ACTIVE_LOGS_COUNT, 0) as u64;

    let end = if desired_range.end() > active_logs_count {
        active_logs_count
    } else {
        desired_range.end()
    };

    let filters_disk_map = FiltersIndexIdMap::load(get_filter_ids_map_path());

    active_logs_reader.seek_to(desired_range.begin());
    for _ in desired_range.begin()..end {
        if let Some(log_metadata) = active_logs_reader.read_next() {
            let filter_id =
                if let Some(id) = filters_disk_map.get_id_of(log_metadata.filter_id_index) {
                    id
                } else {
                    DEFAULT_FILTER_ID
                };

            out.filter_ids.push(filter_id.to_owned());

            let mut field_idx = 0;
            field_readers.iter_mut().for_each(|field_reader| {
                out.logs[field_idx].push(field_reader.read_at(log_metadata.index));
                field_idx += 1;
            });
        }
    }

    Ok(out)
}
