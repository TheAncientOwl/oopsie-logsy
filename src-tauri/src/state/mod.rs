//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: State mod file.
//!

use std::sync::Mutex;

use tauri::State;

use crate::{
    controller::oopsie::v1::OopsieV1Controller,
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
            controller: OopsieLogsyControllerStrategy::OopsieV1(OopsieV1Controller::new()),
        }
    }
}

pub type AppStateMutex<'a> = State<'a, Mutex<AppState>>;
