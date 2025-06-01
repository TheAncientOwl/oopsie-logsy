//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `read_converted_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Read all converted logs and return Column data out of it.
//!

use crate::{
    common::{config_file::ConfigFile, scope_log::ScopeLog},
    store::{logs::ColumnLogsView, store::Store},
};

use super::common::index_range::IndexRange;

// TODO: consider using a separate threads for each field. Current impl works for prorotyping
pub fn execute(desired_range: IndexRange) -> ColumnLogsView {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance();

    let active_tags = store.regex_tags.compute_active_tags();
    let mut field_readers = store.logs.open_current_field_readers(&active_tags);

    let mut out = ColumnLogsView::new_with_field_capacity(active_tags.len(), desired_range.size());

    let mut config = ConfigFile::new(store.logs.get_current_processed_logs_config_path());
    config.load();
    out.total_logs = config.get_number("logs count", 0) as usize;

    for _ in 0..out.total_logs {
        let mut field_idx = 0;
        field_readers.iter_mut().for_each(|field_reader| {
            out.logs[field_idx].push(field_reader.read_at(field_idx));
            field_idx += 1;
        });
    }

    out
}
