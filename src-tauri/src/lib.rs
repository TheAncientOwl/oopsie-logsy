//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `lib.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: OopsieLogsy tauri lib.
//!

mod core;
pub mod logger;

#[tauri::command]
fn set_tags(tags: Vec<core::data::RegexTag>) -> Result<u8, String> {
    let mut instance = core::data::OopsieLogsy::get_instance()?;
    log_trace!(&set_tags, "received {}", tags.len());

    instance.set_regex_tags(&tags);

    Ok(0)
}

#[tauri::command]
fn get_tags() -> Result<Vec<core::data::RegexTag>, String> {
    let mut instance = core::data::OopsieLogsy::get_instance()?;
    log_trace!(&get_tags, "{} tags", instance.get_regex_tags().len());

    Ok(instance.get_regex_tags().clone())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_tags, get_tags])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
