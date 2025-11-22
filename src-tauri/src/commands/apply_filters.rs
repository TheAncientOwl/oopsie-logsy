//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.13
//! **Description**: Set FilterTabs command.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller::OopsieLogsyController,
    log_trace,
    state::{
        data::filters::{Filter, FilterComponent, FilterTab},
        AppState, AppStateMutex,
    },
};

#[tauri::command]
pub async fn apply_filters(
    state: AppStateMutex<'_>,
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
) -> Result<String, String> {
    let _log = ScopeLog::new_command(&apply_filters);

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
    let AppState { data, controller } = &mut *state;

    data.filters.set(tabs, filters, components);
    controller.filter_logs(data)
}
