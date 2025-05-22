//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Set FilterTabs command.
//!

use crate::{
    common::{command_status, scope_log::ScopeLog},
    log_trace,
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        store::Store,
    },
};

#[tauri::command]
pub fn apply_filters(
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
) -> Result<u16, String> {
    let _log = ScopeLog::new(&apply_filters);

    log_trace!(
        &apply_filters,
        "Received {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &apply_filters,
        "Received {} filters: {}",
        filters.len(),
        serde_json::to_string(&filters)
            .unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &apply_filters,
        "Received {} components: {}",
        components.len(),
        serde_json::to_string(&components)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );

    Store::get_instance_mut()
        .filters
        .set(&tabs, &filters, &components);

    Ok(command_status::ok())
}
