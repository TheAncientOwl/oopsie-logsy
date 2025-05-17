//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logRegexTags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: LogRegexTags data and ipc transfer commands.
//!

use once_cell::sync::Lazy;
use std::sync::RwLock;

use crate::{
    common::{command_status, scope_log::ScopeLog},
    log_error,
    store::api::event_handler::EventHandler,
    store::store::Store,
};

// <data>
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RegexTag {
    pub id: String,
    pub displayed: bool,
    pub regex: String,
    pub name: String,
}

pub struct RegexTagsManager {
    regex_tags: Vec<RegexTag>,
}
// </data>

// <manager>
impl RegexTagsManager {
    pub fn new() -> Self {
        Self {
            regex_tags: Vec::new(),
        }
    }

    pub fn set(&mut self, new_tags: &Vec<RegexTag>) {
        self.regex_tags.clear();
        self.regex_tags.extend(new_tags.iter().cloned());
    }

    pub fn get(&self) -> &Vec<RegexTag> {
        &self.regex_tags
    }
}
// </manager>

// <events>
pub static ON_STORE_SET_REGEX_TAGS: Lazy<
    RwLock<EventHandler<dyn Fn(&Vec<RegexTag>) + Send + Sync>>,
> = Lazy::new(|| RwLock::new(EventHandler::new()));
pub static ON_STORE_GET_REGEX_TAGS: Lazy<
    RwLock<EventHandler<dyn Fn(&Vec<RegexTag>) + Send + Sync>>,
> = Lazy::new(|| RwLock::new(EventHandler::new()));
// </events>

// <commands>
#[tauri::command]
pub fn set_regex_tags(tags: Vec<RegexTag>) -> Result<u16, String> {
    let _log = ScopeLog::new(&set_regex_tags);

    ON_STORE_SET_REGEX_TAGS
        .write()
        .map_err(|err| {
            log_error!(
                &set_regex_tags,
                "Failed to acquire lock on ON_STORE_SET_REGEX_TAGS: {}",
                err
            );
        })
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&tags));

    Store::get_instance_mut().regex_tags.set(&tags);

    Ok(command_status::ok())
}

#[tauri::command]
pub fn get_regex_tags() -> Result<Vec<RegexTag>, String> {
    let _log = ScopeLog::new(&get_regex_tags);

    let store = Store::get_instance_mut();
    let tags = store.regex_tags.get().clone();
    std::mem::drop(store);

    ON_STORE_GET_REGEX_TAGS
        .write()
        .map_err(|err| {
            log_error!(
                &get_regex_tags,
                "Failed to acquire lock on ON_STORE_GET_REGEX_TAGS: {}",
                err
            );
        })
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&tags));

    Ok(tags)
}
// </commands>
