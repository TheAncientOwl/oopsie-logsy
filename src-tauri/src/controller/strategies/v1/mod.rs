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
//! **Description**: Oopsie V1 Mod file.
//!

use crate::{
    controller::{
        common::index_range::IndexRange,
        strategies::v1::common::disk_io::{
            active_logs_reader::ActiveLogsReader, active_logs_writer::ActiveLogsWriter,
            log_field_reader::LogFieldReader, log_field_writer::LogFieldWriter,
        },
        OopsieLogsyController,
    },
    log_assert, log_error,
    state::data::{
        logs::{ColumnLogsChunk, LogsManager},
        paths::common::get_oopsie_home_dir,
        regex_tags::RegexTag,
        AppData,
    },
};

pub mod common;
pub mod convert_logs;
pub mod filter_logs;
pub mod read_logs_chunk;

pub struct OopsieV1Controller {}

impl OopsieV1Controller {
    pub fn new() -> Self {
        Self {}
    }

    pub fn get_working_dir(logs_manager: &LogsManager) -> std::path::PathBuf {
        log_assert!(
            &OopsieV1Controller::get_working_dir,
            !logs_manager.get_raw_logs_path().is_empty(),
            "Raw logs path was not set"
        );

        let path = &logs_manager.get_raw_logs_path()[0];
        let out_dir_name = path
            .file_stem()
            .expect("Failed to extract valid UTF-8 file name from input");
        let working_dir = get_oopsie_home_dir().join(out_dir_name);

        if !working_dir.exists() {
            let _ = std::fs::create_dir_all(&path).map_err(|err| {
                log_error!(
                    &OopsieV1Controller::get_working_dir,
                    "Error while creating processed logs dir: {}",
                    err
                );
            });
        }

        working_dir
    }

    pub fn get_logs_config_path(logs_manager: &LogsManager) -> std::path::PathBuf {
        OopsieV1Controller::get_working_dir(logs_manager).join("config.oopsie")
    }

    fn get_field_file_path(name: &str, logs_manager: &LogsManager) -> std::path::PathBuf {
        let mut final_name = name.to_owned();
        final_name.push_str(".oopsie");

        OopsieV1Controller::get_working_dir(logs_manager).join(final_name)
    }

    pub fn open_field_readers(
        active_tags: &Vec<&RegexTag>,
        logs_manager: &LogsManager,
    ) -> Vec<LogFieldReader> {
        active_tags
            .iter()
            .map(|tag| {
                LogFieldReader::open(
                    &tag.name,
                    OopsieV1Controller::get_field_file_path(&tag.name, logs_manager),
                )
            })
            .collect()
    }

    pub fn open_field_writers(
        active_tags: &Vec<&RegexTag>,
        logs_manager: &LogsManager,
    ) -> Vec<LogFieldWriter> {
        active_tags
            .iter()
            .map(|tag| {
                LogFieldWriter::open(
                    &tag.name,
                    OopsieV1Controller::get_field_file_path(&tag.name, logs_manager),
                )
            })
            .collect()
    }

    fn get_active_logs_file(logs_manager: &LogsManager) -> std::path::PathBuf {
        OopsieV1Controller::get_working_dir(logs_manager).join("active_logs.oopsie")
    }

    pub fn open_active_logs_writer(logs_manager: &LogsManager) -> ActiveLogsWriter {
        ActiveLogsWriter::open(OopsieV1Controller::get_active_logs_file(logs_manager))
    }

    pub fn open_active_logs_reader(logs_manager: &LogsManager) -> ActiveLogsReader {
        ActiveLogsReader::open(OopsieV1Controller::get_active_logs_file(logs_manager))
    }
}

impl OopsieLogsyController for OopsieV1Controller {
    fn convert_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        convert_logs::execute(app_data)
    }

    fn filter_logs(&mut self, app_data: &mut AppData) -> Result<String, String> {
        filter_logs::execute(app_data)
    }

    fn get_filtered_logs_chunk(
        &mut self,
        app_data: &mut AppData,
        desired_range: IndexRange,
    ) -> Result<ColumnLogsChunk, String> {
        read_logs_chunk::execute(app_data, desired_range)
    }
}
