//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: CurrentLogPaths commands.
//!

use crate::commands::command_status;
use crate::log_trace;
use crate::store::store::Store;

#[tauri::command]
pub fn set_current_log_paths(paths: Vec<std::path::PathBuf>) -> Result<u16, String> {
    let mut instance = Store::get_instance()?;

    log_trace!(
        &set_current_log_paths,
        "Received {} paths: {}",
        paths.len(),
        serde_json::to_string(&paths).unwrap_or_else(|_| "Failed to serialize paths".to_string())
    );

    instance.current_log_paths.set(&paths);

    Ok(command_status::ok())
}
