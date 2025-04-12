//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `lib.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: OopsieLogsy tauri lib.
//!

pub mod commands;
pub mod logger;
pub mod store;

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
            Ok(())
        })
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            commands::log_regex_tags::set_tags,
            commands::log_regex_tags::get_tags,
            commands::current_log_paths::set_current_log_paths,
            commands::filter_tabs::set_filter_tabs,
            commands::filter_tabs::get_filter_tabs,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
