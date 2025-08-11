//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `oopsie_logsy_state.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: Application state data structures.
//!

use super::{filters::FiltersManager, logs::LogsManager, regex_tags::RegexTagsManager};

pub struct OopsieLogsyStore {
    pub regex_tags: RegexTagsManager,
    pub logs: LogsManager,
    pub filters: FiltersManager,
}

impl OopsieLogsyStore {
    pub fn default() -> Self {
        Self {
            regex_tags: RegexTagsManager::default(),
            logs: LogsManager::default(),
            filters: FiltersManager::default(),
        }
    }
}
