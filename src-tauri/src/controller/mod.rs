//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Controller mod file.
//!

pub mod common;
pub mod strategies;

use crate::{
    controller::{self, common::index_range::IndexRange},
    state::data::{global_search::SearchResult, logs::LogsChunk, AppData},
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
    ) -> Result<LogsChunk, String>;

    ///
    /// Filter for searched logs
    ///
    /// ## Params
    /// `app_data`: OopsieLogsy application data
    /// `alternative`: ID
    /// `pattern`: what logs to log for, applied to given alternative
    ///
    /// ## Returns
    /// search result
    ///
    fn search_apply(
        &mut self,
        app_data: &mut AppData,
        alternative: String,
        pattern: String,
    ) -> Result<SearchResult, String>;

    ///
    /// Get next item in global search
    ///
    /// ## Params
    /// `app_data`: OopsieLogsy application data
    ///
    /// ## Returns
    /// search result
    ///
    fn search_next(&mut self, app_data: &mut AppData) -> Result<SearchResult, String>;

    ///
    /// Get prev item in global search
    ///
    /// ## Params
    /// `app_data`: OopsieLogsy application data
    ///
    /// ## Returns
    /// search result
    ///
    fn search_prev(&mut self, app_data: &mut AppData) -> Result<SearchResult, String>;
}

pub enum OopsieLogsyControllerStrategy {
    OopsieV1(controller::strategies::v1::OopsieV1Controller),
    OopsieV2(controller::strategies::v2::OopsieV2Controller),
}

impl OopsieLogsyController for OopsieLogsyControllerStrategy {
    fn convert_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => inner.convert_logs(app_data),
            OopsieLogsyControllerStrategy::OopsieV2(inner) => inner.convert_logs(app_data),
        }
    }

    fn filter_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => inner.filter_logs(app_data),
            OopsieLogsyControllerStrategy::OopsieV2(inner) => inner.filter_logs(app_data),
        }
    }

    fn get_filtered_logs_chunk(
        &mut self,
        app_data: &mut AppData,
        desired_range: IndexRange,
    ) -> Result<LogsChunk, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => {
                inner.get_filtered_logs_chunk(app_data, desired_range)
            }
            OopsieLogsyControllerStrategy::OopsieV2(inner) => {
                inner.get_filtered_logs_chunk(app_data, desired_range)
            }
        }
    }

    fn search_apply(
        &mut self,
        app_data: &mut AppData,
        alternative: String,
        pattern: String,
    ) -> Result<SearchResult, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => {
                inner.search_apply(app_data, alternative, pattern)
            }
            OopsieLogsyControllerStrategy::OopsieV2(inner) => {
                inner.search_apply(app_data, alternative, pattern)
            }
        }
    }

    fn search_next(&mut self, app_data: &mut AppData) -> Result<SearchResult, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => inner.search_next(app_data),
            OopsieLogsyControllerStrategy::OopsieV2(inner) => inner.search_next(app_data),
        }
    }

    fn search_prev(&mut self, app_data: &mut AppData) -> Result<SearchResult, String> {
        match self {
            OopsieLogsyControllerStrategy::OopsieV1(inner) => inner.search_prev(app_data),
            OopsieLogsyControllerStrategy::OopsieV2(inner) => inner.search_prev(app_data),
        }
    }
}
