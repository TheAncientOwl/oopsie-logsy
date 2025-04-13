//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_tabs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: FilterTabs data.
//!

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
    pub components: Vec<FilterComponent>,
    pub colors: FilterColors,
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct FilterTab {
    pub id: String,
    pub name: String,
    pub filters: Vec<Filter>,
}

pub struct FilterTabsManager {
    data: Vec<FilterTab>,
}

impl FilterTabsManager {
    pub fn new() -> Self {
        Self { data: Vec::new() }
    }

    pub fn set(&mut self, new_tabs: &Vec<FilterTab>) {
        self.data.clear();
        self.data.extend(new_tabs.iter().cloned());
    }

    pub fn get(&self) -> &Vec<FilterTab> {
        &self.data
    }
}
