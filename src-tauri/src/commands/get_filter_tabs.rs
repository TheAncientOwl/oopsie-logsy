//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_filter_tabs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Get FilterTabs command.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    store::{
        filter_tabs::{Filter, FilterComponent, FilterTab},
        store::Store,
    },
};

#[tauri::command]
pub fn get_filter_tabs() -> Result<(Vec<FilterTab>, Vec<Filter>, Vec<FilterComponent>), String> {
    let _log = ScopeLog::new(&get_filter_tabs);

    let instance = Store::get_instance();
    let tabs = instance.filter_tabs.get_tabs().clone();
    let filters = instance.filter_tabs.get_filters().clone();
    let components = instance.filter_tabs.get_components().clone();

    log_trace!(
        &get_filter_tabs,
        "Sending {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &get_filter_tabs,
        "Sending {} filters: {}",
        filters.len(),
        serde_json::to_string(&filters)
            .unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &get_filter_tabs,
        "Sending {} components: {}",
        components.len(),
        serde_json::to_string(&components)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );

    Ok((tabs, filters, components))
}
