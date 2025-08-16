//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `lib.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.12
//! **Description**: OopsieLogsy tauri lib.
//!

pub mod commands;
pub mod common;
pub mod controller;
pub mod logger;
pub mod state;

use std::sync::Mutex;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(debug_assertions)]
            {
                let window = app.get_webview_window("main").unwrap();
                window.open_devtools();
                window.close_devtools();
            }

            app.manage(Mutex::new(state::AppState::default()));

            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::apply_regex_tags::apply_regex_tags,
            commands::get_regex_tags::get_regex_tags,
            commands::apply_filters::apply_filters,
            commands::get_filters::get_filters,
            commands::import_logs::import_logs,
            commands::get_logs_chunk::get_logs_chunk
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
