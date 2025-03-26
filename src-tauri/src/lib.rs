//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `lib.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: OopsieLogsy tauri lib.
//!

mod core;
pub mod logger;

#[tauri::command]
fn set_tags(tags: Vec<core::data::RegexTag>) -> Result<u16, String> {
    let mut instance = core::data::OopsieLogsy::get_instance()?;
    log_trace!(
        &set_tags,
        "Received {} tags: {}",
        tags.len(),
        serde_json::to_string(&tags).unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );
    instance.set_regex_tags(&tags);

    Ok(core::command_status::ok())
}

#[tauri::command]
fn get_tags() -> Result<Vec<core::data::RegexTag>, String> {
    let instance = core::data::OopsieLogsy::get_instance()?;
    log_trace!(
        &get_tags,
        "Sending {} tags: {}",
        instance.get_regex_tags().len(),
        serde_json::to_string(&instance.get_regex_tags())
            .unwrap_or_else(|_| "Failed to serialize tags".to_string())
    );

    Ok(instance.get_regex_tags().clone())
}

#[tauri::command]
fn set_current_log_paths(paths: Vec<std::path::PathBuf>) -> Result<u16, String> {
    let mut instance = core::data::OopsieLogsy::get_instance()?;
    log_trace!(
        &set_current_log_paths,
        "Received {} paths: {}",
        paths.len(),
        serde_json::to_string(&paths).unwrap_or_else(|_| "Failed to serialize paths".to_string())
    );

    instance.set_current_log_path(&paths);

    Ok(core::command_status::ok())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            set_tags,
            get_tags,
            set_current_log_paths
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
