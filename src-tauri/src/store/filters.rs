//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.19
//! **Description**: FilterTabs data and ipc transfer commands.
//!

use std::{collections::HashMap, sync::Arc};

use crate::{
    common::{json::stringify, scope_log::ScopeLog},
    controller::common::disk_io::common::overwrite_file,
    log_error, log_warn,
};

use super::{
    paths::filters::{get_components_path, get_filters_path, get_tabs_path},
    regex_tags::RegexTag,
};

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
    pub enabled: bool,
}

pub struct FiltersManager {
    tabs: Arc<Vec<FilterTab>>,
    filters: Arc<Vec<Filter>>,
    components: Arc<Vec<FilterComponent>>,
}

#[derive(Debug, Clone)]
pub struct ComputedFilterComponent {
    pub field_index: usize,
    pub regex: regex::Regex,
    pub metadata: FilterComponent,
}

#[derive(Debug, Clone)]
pub struct ActiveFilter {
    pub filter_id: String,
    pub priority: u64,
    pub components: Vec<ComputedFilterComponent>,
}
// </data>

// <manager>
impl FiltersManager {
    pub fn default() -> Self {
        Self {
            tabs: Arc::new(Vec::new()),
            filters: Arc::new(Vec::new()),
            components: Arc::new(Vec::new()),
        }
    }

    pub fn set(
        &mut self,
        new_tabs: Vec<FilterTab>,
        new_filters: Vec<Filter>,
        new_components: Vec<FilterComponent>,
    ) {
        let _log = ScopeLog::new(&FiltersManager::set);

        self.tabs = Arc::new(new_tabs);
        let tabs_str = stringify(&self.tabs);
        overwrite_file(&get_tabs_path(), &tabs_str);

        self.filters = Arc::new(new_filters);
        let filters_str = stringify(&self.filters);
        overwrite_file(&get_filters_path(), &filters_str);

        self.components = Arc::new(new_components);
        let components_str = stringify(&self.components);
        overwrite_file(&get_components_path(), &components_str);
    }

    pub fn get_tabs(&self) -> Arc<Vec<FilterTab>> {
        Arc::clone(&self.tabs)
    }

    pub fn get_filters(&self) -> Arc<Vec<Filter>> {
        Arc::clone(&self.filters)
    }

    pub fn get_components(&self) -> Arc<Vec<FilterComponent>> {
        Arc::clone(&self.components)
    }

    pub fn compute_active_filters(&self, active_tags: &Vec<&RegexTag>) -> Vec<ActiveFilter> {
        let _log = ScopeLog::new(&FiltersManager::compute_active_filters);

        let mut active_filters: Vec<ActiveFilter> = Vec::new();

        let id_to_filter: HashMap<_, _> = self
            .filters
            .iter()
            .map(|filter| (&filter.id, filter))
            .collect();
        let id_to_component: HashMap<_, _> = self
            .components
            .iter()
            .map(|component| (&component.id, component))
            .collect();
        let tag_id_to_idx: HashMap<_, _> = active_tags
            .iter()
            .enumerate()
            .map(|(idx, tag)| (&tag.id, idx))
            .collect();

        self.tabs.iter().for_each(|tab| {
            if tab.enabled {
                tab.filter_ids.iter().for_each(|filter_id| {
                    if let Some(filter) = id_to_filter.get(filter_id) {
                        if filter.is_active {
                            let mut filter_components: Vec<ComputedFilterComponent> =
                                Vec::with_capacity(filter.component_ids.len());

                            filter.component_ids.iter().for_each(|component_id| {
                                if let Some(component) = id_to_component.get(component_id) {
                                    if let Some(index) =
                                        tag_id_to_idx.get(&component.over_alternative_id)
                                    {
                                        filter_components.push(ComputedFilterComponent {
                                            field_index: *index,
                                            regex: regex::Regex::new(&component.data)
                                                .map_err(|err| {
                                                    log_error!(
                                                        &FiltersManager::compute_active_filters,
                                                        "Failed to cumpute regex from \"{}\": {}",
                                                        component.data,
                                                        err
                                                    )
                                                })
                                                .unwrap(),
                                            metadata: (*component).clone(),
                                        });
                                    } else {
                                        log_warn!(
                                            &FiltersManager::compute_active_filters,
                                            "Missing over alternative with ID {}",
                                            component.over_alternative_id
                                        )
                                    }
                                } else {
                                    log_warn!(
                                        &FiltersManager::compute_active_filters,
                                        "Missing filter component with ID {}",
                                        component_id
                                    )
                                }
                            });

                            active_filters.push(ActiveFilter {
                                filter_id: filter.id.clone(),
                                priority: filter.priority,
                                components: filter_components,
                            });
                        }
                    } else {
                        log_warn!(
                            &FiltersManager::compute_active_filters,
                            "Missing filter with ID {}",
                            filter_id
                        );
                    }
                });
            }
        });

        active_filters
    }
}

impl ComputedFilterComponent {
    pub fn is_match(&self, value: &str) -> bool {
        self.regex.is_match(value)
    }
}
// </manager>
