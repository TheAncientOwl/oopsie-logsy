//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `store.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Application data store manager.
//!

use super::{
    current_log_paths::CurrentLogPathsManager, filter_tabs::FilterTabsManager,
    regex_tags::RegexTagsManager,
};

pub struct Store {
    pub regex_tags: RegexTagsManager,
    pub current_log_paths: CurrentLogPathsManager,
    pub filter_tabs: FilterTabsManager,
}

impl Store {
    fn new() -> Self {
        Self {
            regex_tags: RegexTagsManager::new(),
            current_log_paths: CurrentLogPathsManager::new(),
            filter_tabs: FilterTabsManager::new(),
        }
    }

    pub fn get_instance_mutex() -> &'static std::sync::Mutex<Store> {
        static INSTANCE: std::sync::OnceLock<std::sync::Mutex<Store>> = std::sync::OnceLock::new();
        INSTANCE.get_or_init(|| std::sync::Mutex::new(Store::new()))
    }

    pub fn get_instance() -> Result<std::sync::MutexGuard<'static, Store>, String> {
        Store::get_instance_mutex()
            .lock()
            .map_err(|error| format!("Mutex lock error: {}", error))
    }
}
