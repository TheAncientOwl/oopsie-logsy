//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `import_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.13
//! **Description**: Set CurrentLogPaths command.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller::OopsieLogsyController,
    log_trace,
    state::{AppState, AppStateMutex},
};

#[tauri::command]
pub async fn import_logs(
    state: AppStateMutex<'_>,
    paths: Vec<std::path::PathBuf>,
) -> Result<String, String> {
    let _log = ScopeLog::new_command(&import_logs);

    log_trace!(
        &import_logs,
        "Received {} paths: {}",
        paths.len(),
        serde_json::to_string(&paths).unwrap_or_else(|_| "Failed to serialize paths".to_string())
    );

    assert!(paths.len() > 0, "Received 0 log paths, logic error");
    assert!(
        std::fs::metadata(&paths[0]).is_ok(),
        "Invalid logs input file for conversion"
    );

    let mut state = state.lock().unwrap();
    let AppState { data, controller } = &mut *state;

    data.logs.set_raw_logs_path(paths);
    controller.convert_logs(data)
}
