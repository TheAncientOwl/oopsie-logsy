//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.11
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use std::fs::{File, OpenOptions};

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

use super::regex_tags::RegexTag;

// <data>
pub type ColumnLogs = Vec<Vec<String>>;

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

    pub fn open_field_file_out(&self, name: &str) -> Result<File, std::io::Error> {
        let path = self.get_field_file_path(name);

        log_trace!(
            &LogsManager::open_field_file_out,
            "new field file: {:?}",
            path
        );

        OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(path)
    }

    pub fn open_field_file_in(&self, name: &str) -> Result<File, std::io::Error> {
        let path = self.get_field_file_path(name);

        log_trace!(
            &LogsManager::open_field_file_in,
            "opening field file: {:?}",
            path
        );

        OpenOptions::new().read(true).open(path)
    }

    pub fn open_current_field_readers(
        &self,
        active_tags: &Vec<&RegexTag>,
    ) -> Vec<std::io::BufReader<std::fs::File>> {
        active_tags
            .iter()
            .map(|tag| {
                let file = self
                    .open_field_file_in(&tag.name)
                    .map_err(|err| {
                        log_error!(
                            &LogsManager::open_current_field_readers,
                            "Error opening output field file {}: {}",
                            tag.name,
                            err
                        );
                    })
                    .unwrap();
                std::io::BufReader::new(file)
            })
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

    pub fn make_empty_column_logs(&self, fields_count: usize) -> ColumnLogs {
        let mut logs: ColumnLogs = Vec::new();
        for _ in 0..fields_count {
            logs.push(Vec::new());
        }
        logs
    }

    pub fn make_empty_column_logs_with_capacity(
        &self,
        fields_count: usize,
        entries_count: usize,
    ) -> ColumnLogs {
        let mut logs: ColumnLogs = Vec::new();
        for _ in 0..fields_count {
            logs.push(Vec::with_capacity(entries_count));
        }
        logs
    }
}
// </manager>
