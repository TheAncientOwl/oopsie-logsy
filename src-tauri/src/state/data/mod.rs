//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Store mod file.
//!

pub mod filters;
pub mod logs;
pub mod paths;
pub mod regex_tags;

use crate::state::data::{
    filters::FiltersManager, logs::LogsManager, regex_tags::RegexTagsManager,
};

pub struct AppData {
    pub regex_tags: RegexTagsManager,
    pub logs: LogsManager,
    pub filters: FiltersManager,
}

impl AppData {
    pub fn default() -> Self {
        Self {
            regex_tags: RegexTagsManager::default(),
            logs: LogsManager::default(),
            filters: FiltersManager::default(),
        }
    }
}
