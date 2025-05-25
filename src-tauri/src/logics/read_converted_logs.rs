//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `read_converted_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Read all converted logs and return Column data out of it.
//!

use std::io::BufRead;

use crate::{
    common::{config_file::ConfigFile, scope_log::ScopeLog},
    store::{logs::ColumnLogs, store::Store},
};

// TODO: consider using a separate threads for each field. Current impl works for prorotyping
pub fn execute() -> ColumnLogs {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance();

    let active_tags = store.regex_tags.compute_active_tags();
    let mut field_readers = store.logs.open_current_field_readers(&active_tags);

    let mut config = ConfigFile::new(store.logs.get_current_processed_logs_config_path());
    config.load();
    let logs_count = config.get_number("logs_count", 0) as usize;

    let mut out_logs: ColumnLogs = store
        .logs
        .make_empty_column_logs_with_capacity(active_tags.len(), logs_count as usize);

    let mut buf = String::with_capacity(512);
    for _ in 0..logs_count {
        let mut field_idx = 0;
        field_readers.iter_mut().for_each(|field_reader| {
            buf.clear();
            field_reader
                .read_line(&mut buf)
                .expect("Failed to read field");
            buf.pop();

            out_logs[field_idx].push(buf.as_str().to_owned());
            field_idx += 1;
        });
    }

    out_logs
}
