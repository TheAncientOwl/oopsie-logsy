//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_logs_chunk.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.4
//! **Description**: GetLogsChunk command.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    state::{
        controller::{common::index_range::IndexRange, OopsieLogsyController},
        data::logs::ColumnLogsChunk,
        AppState, AppStateMutex,
    },
};

#[tauri::command]
pub async fn get_logs_chunk(
    state: AppStateMutex<'_>,
    desired_range: IndexRange,
) -> Result<ColumnLogsChunk, String> {
    let _log = ScopeLog::new_command(&get_logs_chunk);

    log_trace!(
        &get_logs_chunk,
        "Range: [{}, {}]",
        desired_range.begin(),
        desired_range.end()
    );

    let mut state = state.lock().unwrap();
    let AppState { data, controller } = &mut *state;

    controller.get_filtered_logs_chunk(data, desired_range)
}
