//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Set RegexTags command.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_trace, logics,
    store::{logs::ColumnLogs, regex_tags::RegexTag, store::Store},
};

#[tauri::command]
pub async fn apply_regex_tags(tags: Vec<RegexTag>) -> Result<ColumnLogs, String> {
    let _log = ScopeLog::new(&apply_regex_tags);

    log_trace!(
        &apply_regex_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    let mut store = Store::get_instance_mut();

    store.regex_tags.set(&tags);

    if store.logs.get_current_raw_logs_path().len() == 0 {
        let mut empty_data: ColumnLogs = Vec::new();
        tags.iter().for_each(|_| empty_data.push(Vec::new()));

        return Ok(empty_data);
    }

    let in_file_path = store.logs.get_current_raw_logs_path()[0].clone();
    let out_file_dir = store.logs.get_current_processed_logs_dir().clone();

    std::mem::drop(store);
    Ok(logics::logs_converter::execute(
        &in_file_path,
        &out_file_dir,
    ))
}
