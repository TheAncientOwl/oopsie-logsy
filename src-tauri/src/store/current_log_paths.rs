//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: CurrentLogPaths data.
//!

pub struct CurrentLogPathsManager {
    data: Vec<std::path::PathBuf>,
}

impl CurrentLogPathsManager {
    pub fn new() -> Self {
        Self { data: Vec::new() }
    }

    pub fn set(&mut self, new_path: &Vec<std::path::PathBuf>) {
        self.data.clear();
        self.data.extend(new_path.iter().cloned())
    }

    pub fn get(&self) -> &Vec<std::path::PathBuf> {
        &self.data
    }
}
