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
//! **Description**: Store mod file.
//!

pub mod filters;
pub mod global_search;
pub mod logs;
pub mod paths;
pub mod regex_tags;

use crate::state::data::{
    filters::FiltersManager, global_search::GlobalSearchManager, logs::LogsManager,
    regex_tags::RegexTagsManager,
};

pub struct AppData {
    pub regex_tags: RegexTagsManager,
    pub logs: LogsManager,
    pub filters: FiltersManager,
    pub global_search: GlobalSearchManager,
}

impl AppData {
    pub fn default() -> Self {
        Self {
            regex_tags: RegexTagsManager::default(),
            logs: LogsManager::default(),
            filters: FiltersManager::default(),
            global_search: GlobalSearchManager::default(),
        }
    }
}
