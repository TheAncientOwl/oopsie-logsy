//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_regex_tags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: Set RegexTags command.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller, log_trace,
    store::{regex_tags::RegexTag, store::Store},
};

#[tauri::command]
pub async fn apply_regex_tags(tags: Vec<RegexTag>) -> Result<String, String> {
    let _log = ScopeLog::new(&apply_regex_tags);

    log_trace!(
        &apply_regex_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    {
        let mut store = Store::get_instance_mut();
        store.regex_tags.set(&tags);

        if store.logs.get_raw_logs_path().len() == 0 {
            return Ok(String::from("No logs were imported"));
        }
    }

    controller::convert_logs::execute()
}
