//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_tabs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.8
//! **Description**: FilterTabs data and ipc transfer commands.
//!

use once_cell::sync::Lazy;
use std::sync::Mutex;

use crate::{commands::command_status, common::scope_log::ScopeLog, store::store::Store};

use super::api::event_handler::EventHandler;

// <data>
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FilterComponent {
    pub id: String,
    #[serde(rename = "overAlternativeId")]
    pub over_alternative_id: String,
    pub data: String,
    #[serde(rename = "isRegex")]
    pub is_regex: bool,
    #[serde(rename = "isEquals")]
    pub is_equals: bool,
    #[serde(rename = "ignoreCase")]
    pub ignore_case: bool,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FilterColors {
    pub fg: String,
    pub bg: String,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Filter {
    pub id: String,
    pub name: String,
    #[serde(rename = "isActive")]
    pub is_active: bool,
    #[serde(rename = "isHighlightOnly")]
    pub is_highlight_only: bool,
    #[serde(rename = "componentIDs")]
    pub component_ids: Vec<String>,
    pub colors: FilterColors,
    pub priority: u64,
    pub collapsed: bool,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FilterTab {
    pub id: String,
    pub name: String,
    #[serde(rename = "filterIDs")]
    pub filter_ids: Vec<String>,
}

pub struct FilterTabsManager {
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
}
// </data>

// <manager>
impl FilterTabsManager {
    pub fn new() -> Self {
        Self {
            tabs: Vec::new(),
            filters: Vec::new(),
            components: Vec::new(),
        }
    }

    pub fn set(
        &mut self,
        new_tabs: &Vec<FilterTab>,
        new_filters: &Vec<Filter>,
        new_components: &Vec<FilterComponent>,
    ) {
        self.tabs.clear();
        self.tabs.extend(new_tabs.iter().cloned());

        self.filters.clear();
        self.filters.extend(new_filters.iter().cloned());

        self.components.clear();
        self.components.extend(new_components.iter().cloned());
    }

    pub fn get_tabs(&self) -> &Vec<FilterTab> {
        &self.tabs
    }

    pub fn get_filters(&self) -> &Vec<Filter> {
        &self.filters
    }

    pub fn get_components(&self) -> &Vec<FilterComponent> {
        &self.components
    }
}
// </manager>

// <events>
pub static ON_STORE_SET_TABS: Lazy<
    Mutex<EventHandler<dyn Fn(&Vec<FilterTab>, &Vec<Filter>, &Vec<FilterComponent>) + Send + Sync>>,
> = Lazy::new(|| Mutex::new(EventHandler::new()));
pub static ON_STORE_GET_TABS: Lazy<
    Mutex<EventHandler<dyn Fn(&Vec<FilterTab>, &Vec<Filter>, &Vec<FilterComponent>) + Send + Sync>>,
> = Lazy::new(|| Mutex::new(EventHandler::new()));
// </events>

// <commands>
#[tauri::command]
pub fn set_filter_tabs(
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
) -> Result<u16, String> {
    let _log = ScopeLog::new(&set_filter_tabs);

    ON_STORE_SET_TABS
        .lock()
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&tabs, &filters, &components));

    let mut instance = Store::get_instance()?;
    instance.filter_tabs.set(&tabs, &filters, &components);

    Ok(command_status::ok())
}

#[tauri::command]
pub fn get_filter_tabs() -> Result<(Vec<FilterTab>, Vec<Filter>, Vec<FilterComponent>), String> {
    let _log = ScopeLog::new(&get_filter_tabs);

    let instance = Store::get_instance()?;
    let tabs = instance.filter_tabs.get_tabs();
    let filters = instance.filter_tabs.get_filters();
    let components = instance.filter_tabs.get_components();

    ON_STORE_GET_TABS
        .lock()
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&tabs, &filters, &components));

    Ok((tabs.clone(), filters.clone(), components.clone()))
}
// </commands>
