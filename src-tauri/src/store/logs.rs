//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

// <data>
pub type LogPaths = Vec<std::path::PathBuf>;

pub struct Logs {
    current_raw_logs_path: LogPaths,
    current_processed_logs_path: Option<std::path::PathBuf>,
}
// </data>

// <manager>
impl Logs {
    pub fn new() -> Self {
        Self {
            current_raw_logs_path: Vec::new(),
            current_processed_logs_path: None,
        }
    }

    pub fn set_current_raw_logs_path(&mut self, new_path: &LogPaths) {
        self.current_raw_logs_path.clear();
        self.current_raw_logs_path.extend(new_path.iter().cloned())
    }

    pub fn get_current_raw_logs_path(&self) -> &LogPaths {
        &self.current_raw_logs_path
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
        let path = Logs::get_home_dir().join("processed");

        if std::fs::metadata(&path).is_err() {
            let _ = std::fs::create_dir_all(path.clone());
        }

        path
    }

    pub fn set_current_processed_logs_name(&mut self, new_name: &str) {
        self.current_processed_logs_path = Some(Logs::get_processed_logs_dir().join(new_name));
    }

    pub fn clear_current_processed_logs_name(&mut self) {
        self.current_processed_logs_path = None
    }

    pub fn get_current_processed_logs_path(&self) -> &Option<std::path::PathBuf> {
        &self.current_processed_logs_path
    }
}
// </manager>
