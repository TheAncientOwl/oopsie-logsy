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
