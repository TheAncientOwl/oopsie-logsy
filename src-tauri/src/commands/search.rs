//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2026 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `search.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Search related commands.
//!

use crate::{
    common::scope_log::ScopeLog,
    controller::OopsieLogsyController,
    log_trace,
    state::{
        data::global_search::{ActiveData, SearchResult},
        AppState, AppStateMutex,
    },
};

#[tauri::command]
pub fn search_apply(
    state: AppStateMutex<'_>,
    alternative: String,
    pattern: String,
) -> Result<SearchResult, String> {
    let _log = ScopeLog::new_command(&search_apply);
    log_trace!(
        &search_apply,
        "alternative ID: {} | pattern: {}",
        alternative,
        pattern
    );

    let mut state = state.lock().unwrap();
    state
        .data
        .global_search
        .set_alternative_id(alternative.clone());
    state.data.global_search.set_pattern(pattern.clone());

    let AppState { data, controller } = &mut *state;

    let result = controller.search_apply(data, alternative, pattern);

    if result.is_ok() {
        state.data.global_search.set_search_result(result.clone()?);
    } else {
        state.data.global_search.set_search_result(SearchResult {
            has_prev: false,
            has_next: false,
            row_index: -1,
            search_index: -1,
            search_total: -1,
        });
    }

    result
}

#[tauri::command]
pub fn search_next(state: AppStateMutex<'_>) -> Result<SearchResult, String> {
    let _log = ScopeLog::new_command(&search_next);

    let mut state = state.lock().unwrap();
    let AppState { data, controller } = &mut *state;

    let result = controller.search_next(data);

    if result.is_ok() {
        state.data.global_search.set_search_result(result.clone()?);
    } else {
        state.data.global_search.set_search_result(SearchResult {
            has_prev: false,
            has_next: false,
            row_index: -1,
            search_index: -1,
            search_total: -1,
        });
    }

    result
}

#[tauri::command]
pub fn search_prev(state: AppStateMutex<'_>) -> Result<SearchResult, String> {
    let _log = ScopeLog::new_command(&search_prev);

    let mut state = state.lock().unwrap();
    let AppState { data, controller } = &mut *state;

    let result = controller.search_prev(data);

    if result.is_ok() {
        state.data.global_search.set_search_result(result.clone()?);
    } else {
        state.data.global_search.set_search_result(SearchResult {
            has_prev: false,
            has_next: false,
            row_index: -1,
            search_index: -1,
            search_total: -1,
        });
    }

    result
}

#[tauri::command]
pub fn search_get_active_data(state: AppStateMutex<'_>) -> Result<ActiveData, String> {
    let _log = ScopeLog::new_command(&search_get_active_data);

    let state = state.lock().unwrap();
    let active_data = state.data.global_search.get_active_data();

    log_trace!(
        &search_get_active_data,
        "Sending active_data: {}",
        serde_json::to_string(&active_data)
            .unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Ok(active_data.clone())
}
