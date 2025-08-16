//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `configuration.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Configuration file helper.
//!

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

use super::common::{overwrite_file, read_file_to_string, remove_file};

pub struct ConfigFile {
    path: std::path::PathBuf,
    data: serde_json::Value,
}

impl ConfigFile {
    pub fn overwrite(path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&ConfigFile::overwrite);

        if path.exists() {
            remove_file(&path);
            overwrite_file(&path, "{}");
        }

        Self {
            path: path,
            data: serde_json::Value::Object(serde_json::Map::new()),
        }
    }

    pub fn load(path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&ConfigFile::load);

        let file_content = read_file_to_string(&path);
        let data = match serde_json::from_str(&file_content) {
            Ok(val) => val,
            Err(err) => {
                log_error!(
                    &ConfigFile::load,
                    "Failed to parse config file as JSON: {}. Using empty object.",
                    err
                );
                serde_json::Value::Object(serde_json::Map::new())
            }
        };

        Self { path, data }
    }

    pub fn save(&self) {
        let _log = ScopeLog::new(&ConfigFile::save);
        match serde_json::to_string_pretty(&self.data) {
            Ok(json_str) => {
                log_trace!(&ConfigFile::save, "data: {}", self.data);
                overwrite_file(&self.path, &json_str);
            }
            Err(err) => log_error!(
                &ConfigFile::save,
                "Failed to serialize config data {}, reason: {}",
                self.data,
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
                "Unable to set \"{}\" key to \"{}\" value in config internals: {}",
                key,
                value,
                &self.data
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
