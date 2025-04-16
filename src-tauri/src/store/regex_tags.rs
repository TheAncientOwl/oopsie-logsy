//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logRegexTags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: LogRegexTags data and ipc transfer commands.
//!

use once_cell::sync::Lazy;
use std::sync::Mutex;

use super::api::event_handler::EventHandler;
use crate::{commands::command_status, common::scope_log::ScopeLog, store::store::Store};

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
    Mutex<EventHandler<dyn Fn(&Vec<RegexTag>) + Send + Sync>>,
> = Lazy::new(|| Mutex::new(EventHandler::new()));
pub static ON_STORE_GET_REGEX_TAGS: Lazy<
    Mutex<EventHandler<dyn Fn(&Vec<RegexTag>) + Send + Sync>>,
> = Lazy::new(|| Mutex::new(EventHandler::new()));
// </events>

// <commands>
#[tauri::command]
pub fn set_regex_tags(tags: Vec<RegexTag>) -> Result<u16, String> {
    let _log = ScopeLog::new(&set_regex_tags);

    Store::get_instance()?.regex_tags.set(&tags);

    ON_STORE_SET_REGEX_TAGS
        .lock()
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&tags));

    Ok(command_status::ok())
}

#[tauri::command]
pub fn get_regex_tags() -> Result<Vec<RegexTag>, String> {
    let _log = ScopeLog::new(&get_regex_tags);

    let instance = Store::get_instance()?;
    let tags = instance.regex_tags.get();

    ON_STORE_GET_REGEX_TAGS
        .lock()
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&tags));

    Ok(tags.clone())
}
// </commands>
