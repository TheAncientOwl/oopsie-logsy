//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_logs_chunk.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: GetLogsChunk command.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller::{self, common::index_range::IndexRange},
    log_trace,
    store::logs::ColumnLogsChunk,
};

#[tauri::command]
pub async fn get_logs_chunk(desired_range: IndexRange) -> Result<ColumnLogsChunk, String> {
    let _log = ScopeLog::new(&get_logs_chunk);

    log_trace!(
        &get_logs_chunk,
        "Range: [{}, {}]",
        desired_range.begin(),
        desired_range.end()
    );

    controller::read_logs_chunk::execute(desired_range)
}
