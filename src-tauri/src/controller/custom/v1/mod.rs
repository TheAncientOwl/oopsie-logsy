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
//! **Description**: Mod file.
//!

use crate::state::{
    controller::{common::index_range::IndexRange, OopsieLogsyController},
    data::{logs::ColumnLogsChunk, AppData},
};

pub mod common;
pub mod convert_logs;
pub mod filter_logs;
pub mod read_logs_chunk;

pub struct CustomFileStorageV1Controller {}

impl CustomFileStorageV1Controller {
    pub fn new() -> Self {
        Self {}
    }
}

impl OopsieLogsyController for CustomFileStorageV1Controller {
    fn convert_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        convert_logs::execute(app_data)
    }

    fn filter_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        filter_logs::execute(app_data)
    }

    fn get_active_logs_chunk(
        &mut self,
        app_data: &mut AppData,
        desired_range: IndexRange,
    ) -> Result<ColumnLogsChunk, String> {
        read_logs_chunk::execute(app_data, desired_range)
    }
}
