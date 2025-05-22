//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.6
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use crate::common::scope_log::ScopeLog;

// <data>
pub struct LogsManager {
    current_raw_logs_path: Vec<std::path::PathBuf>,
    current_processed_logs_path: Option<std::path::PathBuf>,
}
// </data>

// <manager>
impl LogsManager {
    pub fn new() -> Self {
        Self {
            current_raw_logs_path: Vec::new(),
            current_processed_logs_path: None,
        }
    }

    pub fn set_current_raw_logs_path(&mut self, new_path: &Vec<std::path::PathBuf>) {
        let _log = ScopeLog::new(&LogsManager::set_current_raw_logs_path);

        self.current_raw_logs_path.clear();
        self.current_raw_logs_path.extend(new_path.iter().cloned());

        let in_file_path = &new_path[0];
        let out_file_name = in_file_path
            .file_name()
            .and_then(|name| name.to_str().map(|s| format!("{}.oopsie", s)))
            .expect("Failed to extract valid UTF-8 file name from input");

        self.current_processed_logs_path =
            Some(LogsManager::get_processed_logs_dir().join(out_file_name));
    }

    pub fn get_current_raw_logs_path(&self) -> &Vec<std::path::PathBuf> {
        &self.current_raw_logs_path
    }

    pub fn get_current_processed_logs_path(&self) -> &Option<std::path::PathBuf> {
        &self.current_processed_logs_path
    }

    pub fn get_home_dir() -> std::path::PathBuf {
        let path = dirs::home_dir()
            .map(|home| home.join(".oopsie-logsy"))
            .expect("Failed to determine user's home directory");

        if std::fs::metadata(&path).is_err() {
            let _ = std::fs::create_dir_all(path.clone());
        }

        path
    }

    pub fn get_processed_logs_dir() -> std::path::PathBuf {
        let path = LogsManager::get_home_dir().join("processed");

        if std::fs::metadata(&path).is_err() {
            let _ = std::fs::create_dir_all(path.clone());
        }

        path
    }
}
// </manager>
