//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: logging mod file.
//!

use crate::log_trace;

use super::{
    current_log_paths::{LogPaths, ON_STORE_SET_CURRENT_LOG_PATHS},
    filter_tabs::{Filter, FilterComponent, FilterTab, ON_STORE_GET_TABS, ON_STORE_SET_TABS},
    regex_tags::{RegexTag, ON_STORE_GET_REGEX_TAGS, ON_STORE_SET_REGEX_TAGS},
};

pub fn on_set_regex_tags(tags: &Vec<RegexTag>) {
    log_trace!(
        &on_set_regex_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );
}

pub fn on_get_regex_tags(tags: &Vec<RegexTag>) {
    log_trace!(
        &on_get_regex_tags,
        "Sending {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );
}

pub fn on_set_current_log_paths(paths: &LogPaths) {
    log_trace!(
        &on_set_current_log_paths,
        "Received {} paths: {}",
        paths.len(),
        serde_json::to_string(&paths).unwrap_or_else(|_| "Failed to serialize paths".to_string())
    );
}

pub fn on_set_filter_tabs(
    tabs: &Vec<FilterTab>,
    filters: &Vec<Filter>,
    components: &Vec<FilterComponent>,
) {
    log_trace!(
        &on_set_filter_tabs,
        "Received {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &on_set_filter_tabs,
        "Received {} filters: {}",
        filters.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &on_set_filter_tabs,
        "Received {} components: {}",
        components.len(),
        serde_json::to_string(&tabs)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );
}

pub fn on_get_filter_tabs(
    tabs: &Vec<FilterTab>,
    filters: &Vec<Filter>,
    components: &Vec<FilterComponent>,
) {
    log_trace!(
        &on_get_filter_tabs,
        "Sending {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &on_get_filter_tabs,
        "Sending {} filters: {}",
        filters.len(),
        serde_json::to_string(&filters)
            .unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &on_get_filter_tabs,
        "Sending {} components: {}",
        components.len(),
        serde_json::to_string(&components)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );
}

pub fn setup() {
    ON_STORE_SET_REGEX_TAGS
        .lock()
        .unwrap()
        .add_event_listener(Box::new(on_set_regex_tags));

    ON_STORE_GET_REGEX_TAGS
        .lock()
        .unwrap()
        .add_event_listener(Box::new(on_get_regex_tags));

    ON_STORE_SET_CURRENT_LOG_PATHS
        .lock()
        .unwrap()
        .add_event_listener(Box::new(on_set_current_log_paths));

    ON_STORE_SET_TABS
        .lock()
        .unwrap()
        .add_event_listener(Box::new(on_set_filter_tabs));

    ON_STORE_GET_TABS
        .lock()
        .unwrap()
        .add_event_listener(Box::new(on_get_filter_tabs));
}
