//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `main.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Tauri entry point.
//!

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    oopsie_logsy_lib::log_trace!(&main, "OopsieLogsy started running");
    oopsie_logsy_lib::run();
    oopsie_logsy_lib::log_trace!(&main, "OopsieLogsy stopped runnign");
}
