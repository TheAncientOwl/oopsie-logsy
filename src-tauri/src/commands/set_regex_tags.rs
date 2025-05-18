//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `set_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Set RegexTags command.
//!

use crate::{
    common::{command_status, scope_log::ScopeLog},
    log_trace,
    store::{regex_tags::RegexTag, store::Store},
};

#[tauri::command]
pub async fn set_regex_tags(tags: Vec<RegexTag>) -> Result<u16, String> {
    let _log = ScopeLog::new(&set_regex_tags);

    log_trace!(
        &set_regex_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Store::get_instance_mut().regex_tags.set(&tags);

    Ok(command_status::ok())
}
