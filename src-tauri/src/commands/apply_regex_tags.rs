//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.10
//! **Description**: Set RegexTags command.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    state::{
        controller::OopsieLogsyController, data::regex_tags::RegexTag, AppState, AppStateMutex,
    },
};

#[tauri::command]
pub async fn apply_regex_tags(
    state: AppStateMutex<'_>,
    tags: Vec<RegexTag>,
) -> Result<String, String> {
    let _log = ScopeLog::new_command(&apply_regex_tags);

    log_trace!(
        &apply_regex_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    let mut state = state.lock().unwrap();
    let AppState { data, controller } = &mut *state;

    data.regex_tags.set(tags);

    if data.logs.get_raw_logs_path().len() == 0 {
        return Ok(String::from("No logs were imported"));
    }

    controller.convert_logs(data)
}
