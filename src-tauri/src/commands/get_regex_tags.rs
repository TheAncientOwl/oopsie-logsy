//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: Get RegexTags command.
//!

use std::sync::Arc;

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    state::{data::regex_tags::RegexTag, AppStateMutex},
};

#[tauri::command]
pub async fn get_regex_tags(state: AppStateMutex<'_>) -> Result<Arc<Vec<RegexTag>>, String> {
    let _log = ScopeLog::new_command(&get_regex_tags);

    let state = state.lock().unwrap();
    let tags = state.data.regex_tags.get_tags();

    log_trace!(
        &get_regex_tags,
        "Sending {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Ok(tags)
}
