//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `lib.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.7
//! **Description**: OopsieLogsy tauri lib.
//!

pub mod common;
pub mod logger;
pub mod logic;
pub mod store;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    store::store::Store::setup();

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
            store::data::regex_tags::set_regex_tags,
            store::data::regex_tags::get_regex_tags,
            store::data::filter_tabs::set_filter_tabs,
            store::data::filter_tabs::get_filter_tabs,
            store::data::logs::set_current_log_paths,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
