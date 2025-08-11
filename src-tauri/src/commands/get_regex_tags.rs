//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.6
//! **Description**: Get RegexTags command.
//!

use std::sync::{Arc, Mutex};

use tauri::State;

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    store::{oopsie_logsy_store::OopsieLogsyStore, regex_tags::RegexTag},
};

#[tauri::command]
pub async fn get_regex_tags(
    state: State<'_, Mutex<OopsieLogsyStore>>,
) -> Result<Arc<Vec<RegexTag>>, String> {
    let _log = ScopeLog::new(&get_regex_tags);

    let state = state.lock().unwrap();
    let tags = state.regex_tags.get_tags();

    log_trace!(
        &get_regex_tags,
        "Sending {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Ok(tags)
}
