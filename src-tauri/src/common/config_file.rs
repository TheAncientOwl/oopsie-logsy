//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `configuration.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Configuration file helper.
//!

use crate::{log_error, log_trace};

use super::scope_log::ScopeLog;

pub struct ConfigFile {
    path: std::path::PathBuf,
    data: serde_json::Value,
}

impl ConfigFile {
    pub fn new(path: std::path::PathBuf) -> Self {
        Self {
            path: path,
            data: serde_json::Value::from("{}"),
        }
    }

    fn create_if_missing(&self) {
        if !self.path.exists() {
            log_trace!(
                &ConfigFile::create_if_missing,
                "Creating default config file at \"{:?}\"",
                self.path
            );
            if let Err(err) = std::fs::write(&self.path, "{}") {
                log_error!(
                    &ConfigFile::create_if_missing,
                    "Failed to create config file at {}: {}",
                    self.path.display(),
                    err
                );
            }
        }
    }

    pub fn create_and_load(&mut self) {
        let _log = ScopeLog::new(&ConfigFile::create_and_load);

        if self.path.exists() {
            let _ = std::fs::remove_file(&self.path);
        }

        self.create_if_missing();
        self.load();
    }

    pub fn load(&mut self) {
        let _log = ScopeLog::new(&ConfigFile::load);

        self.create_if_missing();

        if let Ok(content) = std::fs::read_to_string(&self.path) {
            match serde_json::from_str(&content) {
                Ok(json) => self.data = json,
                Err(err) => log_error!(
                    &ConfigFile::load,
                    "Failed to parse config file {}: {}",
                    self.path.display(),
                    err
                ),
            }
        } else {
            log_error!(
                &ConfigFile::load,
                "Failed to read config file at {}",
                self.path.display()
            );
        }
    }

    pub fn save(&self) {
        let _log = ScopeLog::new(&ConfigFile::save);

        self.create_if_missing();

        match serde_json::to_string_pretty(&self.data) {
            Ok(json_str) => {
                if let Err(err) = std::fs::write(&self.path, json_str) {
                    log_error!(
                        &ConfigFile::save,
                        "Failed to write config to file {}: {}",
                        self.path.display(),
                        err
                    );
                }
            }
            Err(err) => log_error!(
                &ConfigFile::save,
                "Failed to serialize config data: {}",
                err
            ),
        }
    }

    pub fn set_str(&mut self, key: &str, value: &str) {
        log_trace!(&ConfigFile::set_str, "\"{}\": \"{}\"", key, value);

        if let Some(obj) = self.data.as_object_mut() {
            obj.insert(key.to_owned(), serde_json::Value::from(value));
        } else {
            log_error!(
                &ConfigFile::set_str,
                "Unable to set \"{}\" key to \"{}\" value in config internals",
                key,
                value,
            )
        }
    }

    pub fn set_number(&mut self, key: &str, value: u128) {
        log_trace!(&ConfigFile::set_number, "\"{}\": \"{}\"", key, value);

        if let Some(obj) = self.data.as_object_mut() {
            if let Some(number) = serde_json::Number::from_u128(value) {
                obj.insert(key.to_owned(), serde_json::Value::Number(number));
            } else {
                log_error!(
                    &ConfigFile::set_number,
                    "Invalid number \"{}\", cannot be stored in config file",
                    value
                )
            }
        } else {
            log_error!(
                &ConfigFile::set_str,
                "Unable to set \"{}\" key to \"{}\" value in config internals",
                key,
                value,
            )
        }
    }

    pub fn get_str(&self, key: &str, default: &str) -> String {
        let value = self
            .data
            .get(key)
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .unwrap_or_else(|| default.to_string());

        log_trace!(&ConfigFile::get_str, "\"{}\": \"{}\"", key, value);

        value
    }

    pub fn get_number(&self, key: &str, default: u128) -> u128 {
        let value = self
            .data
            .get(key)
            .and_then(|v| v.as_i64())
            .map(|n| n as u128)
            .unwrap_or(default);

        log_trace!(&ConfigFile::get_number, "\"{}\": \"{}\"", key, value);

        value
    }
}
