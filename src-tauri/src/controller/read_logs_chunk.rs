//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `read_logs_chunk.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Read logs chunk logics.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_info,
    store::{logs::ColumnLogsChunk, store::Store},
};

use super::common::{disk_io::config_file::ConfigFile, index_range::IndexRange, logs_config_keys};

// TODO: consider using separate threads for each field. Current impl works for protoyping
pub fn execute(desired_range: IndexRange) -> Result<ColumnLogsChunk, String> {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance();

    let active_tags = store.regex_tags.compute_active_tags();
    let mut out = ColumnLogsChunk::new_with_field_capacity(active_tags.len(), desired_range.size());

    if !store.logs.is_working_dir_set() {
        log_info!(
            &execute,
            "Working dir was not set, returning empty log chunk"
        );
        return Ok(out);
    }

    let mut field_readers = store.logs.open_field_readers(&active_tags);
    let mut active_logs_reader = store.logs.open_active_logs_reader();

    let config = ConfigFile::load(store.logs.get_logs_config_path());
    out.total_logs = config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as usize;
    let active_logs_count = config.get_number(logs_config_keys::ACTIVE_LOGS_COUNT, 0) as usize;

    let end = if desired_range.end() > active_logs_count {
        active_logs_count
    } else {
        desired_range.end()
    };

    for active_log_index in desired_range.begin()..end {
        if let Some(log_metadata) = active_logs_reader.read_at(active_log_index as u64) {
            let mut field_idx = 0;
            out.filter_ids.push(log_metadata.filter_id);

            field_readers.iter_mut().for_each(|field_reader| {
                out.logs[field_idx].push(field_reader.read_at(log_metadata.index));
                field_idx += 1;
            });
        }
    }

    Ok(out)
}
