//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `common.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Common IO operations.
//!

use crate::{
    common::{disk_io::read_file_to_string, scope_log::ScopeLog},
    log_error,
};

pub fn create_file(path: &std::path::PathBuf) {
    use std::fs;
    use std::io::Write;

    if path.exists() {
        return;
    }

    if let Some(parent) = path.parent() {
        if let Err(err) = fs::create_dir_all(parent) {
            log_error!(
                &create_file,
                "Failed to create directories for {:?}, reason: {}",
                path,
                err
            );
            return;
        }
    }

    match fs::File::create(path) {
        Ok(mut file) => {
            if let Err(err) = file.write_all(b"") {
                log_error!(
                    &create_file,
                    "Failed to write empty content to {:?}, reason: {}",
                    path,
                    err
                );
            }
        }
        Err(err) => {
            log_error!(
                &create_file,
                "Failed to create file at {:?}, reason: {}",
                path,
                err
            );
        }
    }
}

use serde::de::DeserializeOwned;

pub fn read_vec<T: DeserializeOwned>(path: &std::path::PathBuf) -> Vec<T> {
    let _log = ScopeLog::new(&read_vec::<T>);

    let content = read_file_to_string(path);
    if content.is_empty() {
        return vec![];
    }

    match serde_json::from_str::<Vec<T>>(&content) {
        Ok(data) => data,
        Err(err) => {
            log_error!(
                &read_vec::<T>,
                "Failed to deserialize JSON array from {:?}, reason: {}",
                path,
                err
            );
            vec![]
        }
    }
}
