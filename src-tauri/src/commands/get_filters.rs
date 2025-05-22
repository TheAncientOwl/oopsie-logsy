//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Get FilterTabs command.
//!

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        store::Store,
    },
};

#[tauri::command]
pub fn get_filters() -> Result<(Vec<FilterTab>, Vec<Filter>, Vec<FilterComponent>), String> {
    let _log = ScopeLog::new(&get_filters);

    let instance = Store::get_instance();
    let tabs = instance.filters.get_tabs().clone();
    let filters = instance.filters.get_filters().clone();
    let components = instance.filters.get_components().clone();

    log_trace!(
        &get_filters,
        "Sending {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &get_filters,
        "Sending {} filters: {}",
        filters.len(),
        serde_json::to_string(&filters)
            .unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &get_filters,
        "Sending {} components: {}",
        components.len(),
        serde_json::to_string(&components)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );

    Ok((tabs, filters, components))
}
