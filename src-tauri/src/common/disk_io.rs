//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `disk_io.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Common disk IO utilities.
//!

use crate::{common::scope_log::ScopeLog, log_error};

pub fn remove_file(path: &std::path::PathBuf) {
    if let Err(err) = std::fs::remove_file(path) {
        log_error!(
            &remove_file,
            "Failed to remove file at {:?}, reason: {}",
            path,
            err
        );
    }
}

pub fn overwrite_file(path: &std::path::PathBuf, content: &str) {
    let _log = ScopeLog::new(&overwrite_file);

    if path.exists() {
        remove_file(path);
    }
    if let Err(err) = std::fs::write(path, content) {
        log_error!(
            &overwrite_file,
            "Failed to overwrite file at {:?}, reason: {}",
            path,
            err
        )
    }
}

pub fn read_file_to_string(path: &std::path::PathBuf) -> String {
    let _log = ScopeLog::new(&read_file_to_string);

    match std::fs::read_to_string(path) {
        Ok(content) => content,
        Err(err) => {
            log_error!(
                &read_file_to_string,
                "Failed to read file at {:?}, reason: {}",
                path,
                err
            );
            String::new()
        }
    }
}
