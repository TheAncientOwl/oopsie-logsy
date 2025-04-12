//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_tabs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: FilterTabs commands.
//!

use crate::commands::command_status;
use crate::log_trace;
use crate::store::filter_tabs::FilterTab;
use crate::store::store::Store;

#[tauri::command]
pub fn set_filter_tabs(tabs: Vec<FilterTab>) -> Result<u16, String> {
    let mut instance = Store::get_instance()?;

    log_trace!(
        &set_filter_tabs,
        "Received {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    instance.filter_tabs.set(&tabs);

    Ok(command_status::ok())
}

#[tauri::command]
pub fn get_filter_tabs() -> Result<Vec<FilterTab>, String> {
    let instance = Store::get_instance()?;
    let tabs = instance.filter_tabs.get();

    log_trace!(
        &set_filter_tabs,
        "Sending {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    Ok(tabs.clone())
}
