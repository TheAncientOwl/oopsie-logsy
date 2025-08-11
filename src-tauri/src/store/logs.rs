//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.17
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use super::{paths::common::get_oopsie_home_dir, regex_tags::RegexTag};
use crate::{
    common::scope_log::ScopeLog,
    controller::common::disk_io::{
        active_logs_reader::ActiveLogsReader, active_logs_writer::ActiveLogsWriter,
        log_field_reader::LogFieldReader, log_field_writer::LogFieldWriter,
    },
    log_assert, log_error,
};
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
    working_dir: Option<std::path::PathBuf>,
}
// </data>

// <manager>
impl LogsManager {
    pub fn default() -> Self {
        Self {
            raw_logs_path: Vec::new(),
            working_dir: None,
        }
    }

    pub fn set_raw_logs_path(&mut self, new_path: Vec<std::path::PathBuf>) {
        let _log = ScopeLog::new(&LogsManager::set_raw_logs_path);

        self.raw_logs_path = new_path;

        let in_file_path = &self.raw_logs_path[0];
        let out_dir_name = in_file_path
            .file_stem()
            // .and_then(|name| name.to_str().map(|s| format!("{}.oopsie", s)))
            .expect("Failed to extract valid UTF-8 file name from input");

        self.working_dir = Some(get_oopsie_home_dir().join(out_dir_name));
    }

    pub fn get_raw_logs_path(&self) -> &Vec<std::path::PathBuf> {
        &self.raw_logs_path
    }

    pub fn is_working_dir_set(&self) -> bool {
        self.working_dir.is_some()
    }

    pub fn get_working_dir(&self) -> &std::path::PathBuf {
        log_assert!(
            &LogsManager::get_working_dir,
            self.working_dir.is_some(),
            "Working dir was not initialized"
        );

        let path = self.working_dir.as_ref().unwrap();

        if !path.exists() {
            let _ = std::fs::create_dir_all(&path).map_err(|err| {
                log_error!(
                    &LogsManager::get_working_dir,
                    "Error while creating processed logs dir: {}",
                    err
                );
            });
        }

        path
    }

    pub fn get_logs_config_path(&self) -> std::path::PathBuf {
        self.get_working_dir().join("config.oopsie")
    }

    fn get_field_file_path(&self, name: &str) -> std::path::PathBuf {
        let mut final_name = name.to_owned();
        final_name.push_str(".oopsie");

        self.get_working_dir().join(final_name)
    }

    pub fn open_field_readers(&self, active_tags: &Vec<&RegexTag>) -> Vec<LogFieldReader> {
        active_tags
            .iter()
            .map(|tag| LogFieldReader::open(&tag.name, self.get_field_file_path(&tag.name)))
            .collect()
    }

    pub fn open_field_writers(&self, active_tags: &Vec<&RegexTag>) -> Vec<LogFieldWriter> {
        active_tags
            .iter()
            .map(|tag| LogFieldWriter::open(&tag.name, self.get_field_file_path(&tag.name)))
            .collect()
    }

    fn get_active_logs_file(&self) -> std::path::PathBuf {
        self.get_working_dir().join("active_logs.oopsie")
    }

    pub fn open_active_logs_writer(&self) -> ActiveLogsWriter {
        ActiveLogsWriter::open(self.get_active_logs_file())
    }

    pub fn open_active_logs_reader(&self) -> ActiveLogsReader {
        ActiveLogsReader::open(self.get_active_logs_file())
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
