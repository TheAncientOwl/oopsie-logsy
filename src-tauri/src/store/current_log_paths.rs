//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `current_log_paths.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: CurrentLogPaths data and ipc transfer commands.
//!

use once_cell::sync::Lazy;
use std::sync::Mutex;

use super::api::event_handler::EventHandler;
use crate::{commands::command_status, common::scope_log::ScopeLog, store::store::Store};

// <data>
pub type LogPaths = Vec<std::path::PathBuf>;

pub struct CurrentLogPathsManager {
    data: LogPaths,
}
// </data>

// <manager>
impl CurrentLogPathsManager {
    pub fn new() -> Self {
        Self { data: Vec::new() }
    }

    pub fn set(&mut self, new_path: &LogPaths) {
        self.data.clear();
        self.data.extend(new_path.iter().cloned())
    }

    pub fn get(&self) -> &LogPaths {
        &self.data
    }
}
// </manager>

// <events>
pub static ON_STORE_SET_CURRENT_LOG_PATHS: Lazy<
    Mutex<EventHandler<dyn Fn(&LogPaths) + Send + Sync>>,
> = Lazy::new(|| Mutex::new(EventHandler::new()));
// </events>

// <commands>
#[tauri::command]
pub fn set_current_log_paths(paths: LogPaths) -> Result<u16, String> {
    let _log = ScopeLog::new(&set_current_log_paths);

    let mut instance = Store::get_instance()?;

    ON_STORE_SET_CURRENT_LOG_PATHS
        .lock()
        .unwrap()
        .handlers()
        .iter()
        .for_each(|handler| handler(&paths));

    instance.current_log_paths.set(&paths);

    Ok(command_status::ok())
}
// </commands>
