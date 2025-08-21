//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.19
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use crate::common::scope_log::ScopeLog;
use serde::{Deserialize, Serialize};

// <data>
pub type ColumnLogs = Vec<Vec<String>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColumnLogsChunk {
    pub logs: ColumnLogs,
    #[serde(rename = "filterIds")]
    pub filter_ids: Vec<String>,
    #[serde(rename = "totalLogs")]
    pub total_logs: u64,
}

pub struct LogsManager {
    raw_logs_path: Vec<std::path::PathBuf>,
}
// </data>

// <manager>
impl LogsManager {
    pub fn default() -> Self {
        Self {
            raw_logs_path: Vec::new(),
        }
    }

    pub fn set_raw_logs_path(&mut self, new_path: Vec<std::path::PathBuf>) {
        let _log = ScopeLog::new(&LogsManager::set_raw_logs_path);
        self.raw_logs_path = new_path;
    }

    pub fn get_raw_logs_path(&self) -> &Vec<std::path::PathBuf> {
        &self.raw_logs_path
    }
}

impl ColumnLogsChunk {
    pub fn new(fields: usize) -> Self {
        let mut logs = Vec::with_capacity(fields);
        for _ in 0..fields {
            logs.push(Vec::new());
        }
        Self {
            logs,
            filter_ids: Vec::new(),
            total_logs: 0,
        }
    }

    pub fn new_with_field_capacity(fields: usize, capacity: usize) -> Self {
        let mut logs = Vec::with_capacity(fields);
        for _ in 0..fields {
            logs.push(Vec::with_capacity(capacity));
        }
        Self {
            logs,
            filter_ids: Vec::with_capacity(capacity),
            total_logs: 0,
        }
    }
}
// </manager>
