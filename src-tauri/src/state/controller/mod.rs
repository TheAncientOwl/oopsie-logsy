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
//! **Description**: Controller mod file.
//!

pub mod common;

use crate::{
    controller,
    state::{
        controller::common::index_range::IndexRange,
        data::{logs::ColumnLogsChunk, AppData},
    },
};

pub trait OopsieLogsyController {
    fn convert_logs(&mut self, app_data: &mut AppData) -> Result<String, String>;
    fn filter_logs(&mut self, app_data: &mut AppData) -> Result<String, String>;
    fn get_filtered_logs_chunk(
        &mut self,
        app_data: &mut AppData,
        desired_range: IndexRange,
    ) -> Result<ColumnLogsChunk, String>;
}

pub enum OopsieLogsyControllerStrategy {
    OopsieV1(controller::oopsie::v1::OopsieV1Controller),
}

impl OopsieLogsyController for OopsieLogsyControllerStrategy {
    fn convert_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => inner.convert_logs(app_data),
        }
    }

    fn filter_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => inner.filter_logs(app_data),
        }
    }

    fn get_filtered_logs_chunk(
        &mut self,
        app_data: &mut AppData,
        desired_range: IndexRange,
    ) -> Result<ColumnLogsChunk, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => {
                inner.get_filtered_logs_chunk(app_data, desired_range)
            }
        }
    }
}
