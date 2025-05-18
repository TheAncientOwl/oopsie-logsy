//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `set_current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Set CurrentLogPaths command.
//!

use crate::{
    common::{command_status, scope_log::ScopeLog},
    log_trace, logics,
    store::{logs::LogPaths, store::Store},
};

#[tauri::command]
pub async fn set_current_log_paths(paths: LogPaths) -> Result<u16, String> {
    let _log = ScopeLog::new(&set_current_log_paths);

    log_trace!(
        &set_current_log_paths,
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
    let out_file_name = in_file_path
        .file_name()
        .and_then(|name| name.to_str().map(|s| format!("{}.oopsie", s)))
        .expect("Failed to extract valid UTF-8 file name from input");

    store.logs.set_current_processed_logs_name(&out_file_name);
    let out_file_path_opt = store.logs.get_current_processed_logs_path().clone();
    std::mem::drop(store);

    assert!(
        out_file_path_opt.is_some(),
        "Failed to set output log path value"
    );

    logics::logs_converter::execute(in_file_path, out_file_path_opt.as_ref().unwrap());
    // logic::logs_reader_test::execute();

    Ok(command_status::ok())
}
