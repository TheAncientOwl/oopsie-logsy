//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2026 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `global_search.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: GlobalSearch data.
//!

use serde::{Deserialize, Serialize};

use crate::common::scope_log::ScopeLog;

// <data>
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct SearchResult {
    #[serde(rename = "hasPrev")]
    pub has_prev: bool,
    #[serde(rename = "hasNext")]
    pub has_next: bool,
    #[serde(rename = "rowIndex")]
    pub row_index: i64,
    #[serde(rename = "searchIndex")]
    pub search_index: i64,
    #[serde(rename = "searchTotal")]
    pub search_total: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ActiveData {
    #[serde(rename = "result")]
    pub result: SearchResult,
    #[serde(rename = "alternativeId")]
    pub alternative_id: String,
    #[serde(rename = "pattern")]
    pub pattern: String,
}

pub struct GlobalSearchManager {
    active_data: ActiveData,
}
// </data>

// <manager>
impl GlobalSearchManager {
    pub fn default() -> Self {
        Self {
            active_data: ActiveData {
                result: SearchResult {
                    has_prev: false,
                    has_next: false,
                    row_index: -1,
                    search_index: -1,
                    search_total: -1,
                },
                alternative_id: String::from(""),
                pattern: String::from(""),
            },
        }
    }

    pub fn get_active_data(&self) -> &ActiveData {
        &self.active_data
    }

    pub fn set_alternative_id(&mut self, alternative_id: String) {
        let _log = ScopeLog::new(&GlobalSearchManager::set_alternative_id);
        self.active_data.alternative_id = alternative_id;
    }

    pub fn set_pattern(&mut self, pattern: String) {
        let _log = ScopeLog::new(&GlobalSearchManager::set_pattern);
        self.active_data.pattern = pattern;
    }

    pub fn set_search_result(&mut self, result: SearchResult) {
        let _log = ScopeLog::new(&GlobalSearchManager::set_search_result);
        self.active_data.result = result;
    }
}

impl SearchResult {
    pub fn default() -> Self {
        Self {
            has_prev: false,
            has_next: false,
            row_index: -1,
            search_index: -1,
            search_total: -1,
        }
    }
}
// </manager>
