//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `import_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.9
//! **Description**: Set CurrentLogPaths command.
//!

use crate::{common::scope_log::ScopeLog, controller, log_trace, store::store::Store};

#[tauri::command]
pub async fn import_logs(paths: Vec<std::path::PathBuf>) -> Result<String, String> {
    let _log = ScopeLog::new(&import_logs);

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

    {
        let mut store = Store::get_instance_mut();
        store.logs.set_raw_logs_path(&paths);
    }

    controller::convert_logs::execute()
}
