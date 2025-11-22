//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Controller mod file.
//!

pub mod common;
pub mod strategies;

use crate::{
    controller::{self, common::index_range::IndexRange},
    state::data::{logs::ColumnLogsChunk, AppData},
};

/// Logs controller responsible with I/O and filtering.
///
/// # Examples
/// ```
/// let mut controller = OopsieLogsyController{};
/// let hash = controller.convert_logs(app_data);
/// let hash = controller.filter_logs(app_data);
/// let chunk = controller.get_filtered_logs_chunk(app_data, IndexRange{12, 50});
/// ```
///
pub trait OopsieLogsyController {
    ///
    /// Converts the **raw** input logs to `oopsie logsy format`.
    ///
    /// ## Params
    /// `app_data`: OopsieLogsy application data
    ///
    /// ## Returns
    /// Time hash of when the conversion was done.
    ///
    fn convert_logs(&mut self, app_data: &mut AppData) -> Result<String, String>;

    ///
    /// Filters `oopsie logsy formatted` logs.
    ///
    /// ## Params
    /// `app_data`: OopsieLogsy application data
    ///
    /// ## Returns
    /// Time hash of when the conversion was done.
    ///
    fn filter_logs(&mut self, app_data: &mut AppData) -> Result<String, String>;

    ///
    /// Get a filtered chunk of logs.
    ///
    /// ## Params
    /// `app_data`: OopsieLogsy application data
    ///
    /// `desired_range`: IndexRange of requested logs
    ///
    /// ## Returns
    /// Chunk representation of filtered logs
    ///
    fn get_filtered_logs_chunk(
        &mut self,
        app_data: &mut AppData,
        desired_range: IndexRange,
    ) -> Result<ColumnLogsChunk, String>;
}

pub enum OopsieLogsyControllerStrategy {
    OopsieV1(controller::strategies::v1::OopsieV1Controller),
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
