//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.20
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use crate::common::scope_log::ScopeLog;
use serde::{Deserialize, Serialize};

// <data>
// format: FilterUUID, field-1, field-2, ..., field-n
pub type LogRow = Vec<String>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogsChunk {
    pub data: Vec<LogRow>,
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

impl LogsChunk {
    pub fn new() -> Self {
        Self {
            data: Vec::new(),
            total_logs: 0,
        }
    }

    pub fn with_capacity(capacity: usize) -> Self {
        Self {
            data: Vec::with_capacity(capacity),
            total_logs: 0,
        }
    }
}
// </manager>
