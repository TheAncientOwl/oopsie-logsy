//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: Get FilterTabs command.
//!

use std::sync::{Arc, Mutex};

use tauri::State;

use crate::{
    common::scope_log::ScopeLog,
    log_trace,
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        oopsie_logsy_store::OopsieLogsyStore,
    },
};

#[tauri::command]
pub async fn get_filters(
    state: State<'_, Mutex<OopsieLogsyStore>>,
) -> Result<
    (
        Arc<Vec<FilterTab>>,
        Arc<Vec<Filter>>,
        Arc<Vec<FilterComponent>>,
    ),
    String,
> {
    let _log = ScopeLog::new(&get_filters);

    let state = state.lock().unwrap();

    let tabs = state.filters.get_tabs();
    let filters = state.filters.get_filters();
    let components = state.filters.get_components();

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
