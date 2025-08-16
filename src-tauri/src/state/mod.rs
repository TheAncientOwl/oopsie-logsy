//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: State mod file.
//!

use std::sync::Mutex;

use tauri::State;

use crate::{
    controller::custom::v1::CustomFileStorageV1Controller,
    state::{controller::OopsieLogsyControllerStrategy, data::AppData},
};

pub mod controller;
pub mod data;

pub struct AppState {
    pub data: AppData,
    pub controller: OopsieLogsyControllerStrategy,
}

impl AppState {
    pub fn default() -> Self {
        Self {
            data: AppData::default(),
            controller: OopsieLogsyControllerStrategy::CustomFileStorageV1(
                CustomFileStorageV1Controller::new(),
            ),
        }
    }
}

pub type AppStateMutex<'a> = State<'a, Mutex<AppState>>;
