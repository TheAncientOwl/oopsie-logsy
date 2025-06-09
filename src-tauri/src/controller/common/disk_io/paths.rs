//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Paths management.
//!

use crate::log_error;

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

pub fn overwrite_file(path: &std::path::PathBuf, content: &str) {
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

pub fn read_file_to_string(path: &std::path::PathBuf) -> String {
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

pub fn get_oopsie_home_dir() -> std::path::PathBuf {
    let path = dirs::home_dir()
        .map(|home| home.join(".oopsie-logsy"))
        .expect("Failed to determine user's home directory");

    if !path.exists() {
        let _ = std::fs::create_dir_all(&path).map_err(|err| {
            log_error!(
                &&get_oopsie_home_dir,
                "Error while creating oopsie home dir: {}",
                err
            );
        });
    }

    path
}
