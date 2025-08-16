//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Filters paths.
//!

use crate::log_error;

use super::common::get_oopsie_home_dir;

fn get_data_path() -> std::path::PathBuf {
    let path = get_oopsie_home_dir().join("filters");

    if !path.exists() {
        let _ = std::fs::create_dir_all(&path).map_err(|err| {
            log_error!(
                &get_oopsie_home_dir,
                "Error while creating oopsie filters dir: {}",
                err
            );
        });
    }

    path
}

pub fn get_tabs_path() -> std::path::PathBuf {
    get_data_path().join("tabs.oopsie")
}

pub fn get_filters_path() -> std::path::PathBuf {
    get_data_path().join("filters.oopsie")
}

pub fn get_components_path() -> std::path::PathBuf {
    get_data_path().join("components.oopsie")
}

pub fn get_filter_ids_map_path() -> std::path::PathBuf {
    get_data_path().join("filter_ids.map.oopsie")
}
