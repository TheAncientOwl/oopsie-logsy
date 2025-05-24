//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `import_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Set CurrentLogPaths command.
//!

use crate::{common::scope_log::ScopeLog, log_trace, logics, store::store::Store};

#[tauri::command]
pub async fn import_logs(paths: Vec<std::path::PathBuf>) -> Result<Vec<Vec<String>>, String> {
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

    let mut store = Store::get_instance_mut();
    store.logs.set_current_raw_logs_path(&paths);

    let in_file_path = &paths[0];
    let out_file_dir = store.logs.get_current_processed_logs_dir().clone();
    std::mem::drop(store);

    let logs = logics::logs_converter::execute(in_file_path, &out_file_dir);
    // logic::logs_reader_test::execute();

    Ok(logs)
}
