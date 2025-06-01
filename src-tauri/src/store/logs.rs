//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.13
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use super::regex_tags::RegexTag;
use crate::{
    common::{
        log_field_storage::{reader::Reader, writer::Writer},
        scope_log::ScopeLog,
    },
    log_error,
};
use serde::{Deserialize, Serialize};

// <data>
pub type ColumnLogs = Vec<Vec<String>>;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ColumnLogsView {
    pub logs: ColumnLogs,
    #[serde(rename = "totalLogs")]
    pub total_logs: usize,
}

pub struct LogsManager {
    current_raw_logs_path: Vec<std::path::PathBuf>,
    current_processed_logs_dir: std::path::PathBuf,
}
// </data>

// <manager>
impl LogsManager {
    pub fn new() -> Self {
        Self {
            current_raw_logs_path: Vec::new(),
            current_processed_logs_dir: std::path::PathBuf::new(),
        }
    }

    pub fn set_current_raw_logs_path(&mut self, new_path: &Vec<std::path::PathBuf>) {
        let _log = ScopeLog::new(&LogsManager::set_current_raw_logs_path);

        self.current_raw_logs_path.clear();
        self.current_raw_logs_path.extend(new_path.iter().cloned());

        let in_file_path = &new_path[0];
        let out_dir_name = in_file_path
            .file_stem()
            // .and_then(|name| name.to_str().map(|s| format!("{}.oopsie", s)))
            .expect("Failed to extract valid UTF-8 file name from input");

        self.current_processed_logs_dir = LogsManager::get_processed_logs_dir().join(out_dir_name);
    }

    pub fn get_current_raw_logs_path(&self) -> &Vec<std::path::PathBuf> {
        &self.current_raw_logs_path
    }

    pub fn get_current_processed_logs_dir(&self) -> &std::path::PathBuf {
        if std::fs::metadata(&self.current_processed_logs_dir).is_err() {
            let _ = std::fs::create_dir_all(&self.current_processed_logs_dir).map_err(|err| {
                log_error!(
                    &LogsManager::get_current_processed_logs_dir,
                    "Error while creating processed logs dir: {}",
                    err
                );
            });
        }

        &self.current_processed_logs_dir
    }

    pub fn get_current_processed_logs_config_path(&self) -> std::path::PathBuf {
        self.get_current_processed_logs_dir().join("config.oopsie")
    }

    fn get_field_file_path(&self, name: &str) -> std::path::PathBuf {
        let mut final_name = name.to_owned();
        final_name.push_str(".oopsie");

        self.get_current_processed_logs_dir().join(final_name)
    }

    pub fn open_current_field_readers(&self, active_tags: &Vec<&RegexTag>) -> Vec<Reader> {
        active_tags
            .iter()
            .map(|tag| Reader::open(&tag.name, self.get_field_file_path(&tag.name)))
            .collect()
    }

    pub fn open_current_field_writers(&self, active_tags: &Vec<&RegexTag>) -> Vec<Writer> {
        active_tags
            .iter()
            .map(|tag| Writer::open(&tag.name, self.get_field_file_path(&tag.name)))
            .collect()
    }

    pub fn get_home_dir() -> std::path::PathBuf {
        let path = dirs::home_dir()
            .map(|home| home.join(".oopsie-logsy"))
            .expect("Failed to determine user's home directory");

        if std::fs::metadata(&path).is_err() {
            let _ = std::fs::create_dir_all(&path);
        }

        path
    }

    pub fn get_processed_logs_dir() -> std::path::PathBuf {
        let path = LogsManager::get_home_dir().join("processed");

        if std::fs::metadata(&path).is_err() {
            let _ = std::fs::create_dir_all(&path);
        }

        path
    }
}

impl ColumnLogsView {
    pub fn new(fields: usize) -> Self {
        let mut logs = Vec::with_capacity(fields);
        for _ in 0..fields {
            logs.push(Vec::new());
        }
        Self {
            logs,
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
            total_logs: 0,
        }
    }
}
// </manager>
