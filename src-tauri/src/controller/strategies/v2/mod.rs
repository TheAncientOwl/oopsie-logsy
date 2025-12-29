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
//! **Description**: Oopsie V2 Mod file.
//!
//! **Strategy**:
//!     - store each field in its own file, one value per line
//!     - filtered logs indices are stored in a file
//!

pub mod convert_logs;
pub mod filter_logs;
pub mod get_filtered_logs_chunk;

use crate::{
    controller::OopsieLogsyController,
    log_assert, log_error, log_trace,
    state::data::{logs::LogsManager, paths::common::get_oopsie_home_dir},
};

pub struct OopsieV2Controller {}

impl OopsieV2Controller {
    pub fn new() -> Self {
        Self {}
    }

    pub fn get_working_dir(logs_manager: &LogsManager) -> std::path::PathBuf {
        log_assert!(
            &OopsieV2Controller::get_working_dir,
            !logs_manager.get_raw_logs_path().is_empty(),
            "Raw logs path was not set"
        );

        let path = &logs_manager.get_raw_logs_path()[0];
        let out_dir_name = path
            .file_stem()
            .expect("Failed to extract valid UTF-8 file name from input");
        let working_dir = get_oopsie_home_dir().join(out_dir_name);

        if !working_dir.exists() {
            let _ = std::fs::create_dir_all(&working_dir).map_err(|err| {
                log_error!(
                    &OopsieV2Controller::get_working_dir,
                    "Error while creating processed logs dir {:?}: {}",
                    working_dir,
                    err
                );
            });
        }

        working_dir
    }

    pub fn get_database_path(logs_manager: &LogsManager) -> std::path::PathBuf {
        let working_dir = OopsieV2Controller::get_working_dir(logs_manager);
        working_dir.join("oopsie.csv")
    }

    pub fn get_filtered_database_path(logs_manager: &LogsManager) -> std::path::PathBuf {
        let working_dir = OopsieV2Controller::get_working_dir(logs_manager);
        working_dir.join("oopsie.filtered.csv")
    }
}

impl OopsieLogsyController for OopsieV2Controller {
    fn convert_logs(
        &mut self,
        app_data: &mut crate::state::data::AppData,
    ) -> Result<String, String> {
        log_trace!(&OopsieV2Controller::convert_logs, "");
        convert_logs::execute(app_data)
    }

    fn filter_logs(
        &mut self,
        app_data: &mut crate::state::data::AppData,
    ) -> Result<String, String> {
        log_trace!(&OopsieV2Controller::filter_logs, "");
        filter_logs::execute(app_data)
    }

    fn get_filtered_logs_chunk(
        &mut self,
        app_data: &mut crate::state::data::AppData,
        desired_range: crate::controller::common::index_range::IndexRange,
    ) -> Result<crate::state::data::logs::ColumnLogsChunk, String> {
        log_trace!(&OopsieV2Controller::get_filtered_logs_chunk, "");
        get_filtered_logs_chunk::execute(app_data, desired_range)
    }
}
