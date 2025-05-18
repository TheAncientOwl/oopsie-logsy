//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Get RegexTags command.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    store::{data::regex_tags::RegexTag, store::Store},
};

#[tauri::command]
pub async fn get_regex_tags() -> Result<Vec<RegexTag>, String> {
    let _log = ScopeLog::new(&get_regex_tags);

    let store = Store::get_instance_mut();
    let tags = store.regex_tags.get().clone();

    log_trace!(
        &get_regex_tags,
        "Sending {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Ok(tags)
}
