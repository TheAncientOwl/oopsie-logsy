//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.11
//! **Description**: Set FilterTabs command.
//!

use std::sync::Mutex;

use tauri::State;

use crate::{
    common::scope_log::ScopeLog,
    controller::{self},
    log_trace,
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        oopsie_logsy_store::OopsieLogsyStore,
    },
};

#[tauri::command]
pub async fn apply_filters(
    state: State<'_, Mutex<OopsieLogsyStore>>,
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
) -> Result<String, String> {
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

    let mut state = state.lock().unwrap();
    state.filters.set(tabs, filters, components);

    controller::filter_logs::execute(state)
}
