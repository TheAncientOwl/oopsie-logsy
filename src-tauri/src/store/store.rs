//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `store.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.4
//! **Description**: Application data store manager.
//!

use once_cell::sync::Lazy;
use std::sync::RwLock;

use super::{filter_tabs::FilterTabsManager, logs::Logs, regex_tags::RegexTagsManager};

pub struct Store {
    pub regex_tags: RegexTagsManager,
    pub logs: Logs,
    pub filter_tabs: FilterTabsManager,
}

static STORE: Lazy<RwLock<Store>> = Lazy::new(|| RwLock::new(Store::new()));

impl Store {
    fn new() -> Self {
        Self {
            regex_tags: RegexTagsManager::new(),
            logs: Logs::new(),
            filter_tabs: FilterTabsManager::new(),
        }
    }

    pub fn get_instance() -> std::sync::RwLockReadGuard<'static, Store> {
        STORE.read().expect("Failed to acquire read lock on STORE")
    }

    pub fn get_instance_mut() -> std::sync::RwLockWriteGuard<'static, Store> {
        STORE
            .write()
            .expect("Failed to acquire write lock on STORE")
    }
}
