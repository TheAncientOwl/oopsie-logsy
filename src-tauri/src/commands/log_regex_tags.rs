//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logRegexTags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: LogRegexTags commands.
//!

use super::super::store::log_regex_tags::RegexTag;
use super::super::store::store::Store;
use crate::commands::command_status;
use crate::log_trace;

#[tauri::command]
pub fn set_tags(tags: Vec<RegexTag>) -> Result<u16, String> {
    let mut instance = Store::get_instance()?;

    log_trace!(
        &set_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    instance.regex_tags.set(&tags);

    Ok(command_status::ok())
}

#[tauri::command]
pub fn get_tags() -> Result<Vec<RegexTag>, String> {
    let instance = Store::get_instance()?;

    log_trace!(
        &get_tags,
        "Sending {} tags: {}",
        instance.regex_tags.get().len(),
        serde_json::to_string(&instance.regex_tags.get())
            .unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Ok(instance.regex_tags.get().clone())
}
