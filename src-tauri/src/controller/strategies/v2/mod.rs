//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `mod.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.4
//! **Description**: Oopsie V2 Mod file.
//!
//! **Strategy**:
//!     - CSV all the way
//!     - one file for parsed data
//!     - one file for filtered data
//!     - filtered logs indices are stored as first field in filtered file
//!

pub mod common;
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

    pub fn get_config_path(logs_manager: &LogsManager) -> std::path::PathBuf {
        let working_dir = OopsieV2Controller::get_working_dir(logs_manager);
        working_dir.join("config.json")
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
    ) -> Result<crate::state::data::logs::LogsChunk, String> {
        log_trace!(&OopsieV2Controller::get_filtered_logs_chunk, "");
        get_filtered_logs_chunk::execute(app_data, desired_range)
    }
}

#[cfg(test)]
mod tests {
    use std::{
        fs::File,
        io::{self, BufRead, BufReader},
        path::PathBuf,
    };

    use csv::StringRecord;

    use crate::{
        common::scope_log::ScopeLog,
        controller::{
            common::index_range::IndexRange,
            strategies::v2::{convert_logs::DEFAULT_FILTER_ID, OopsieV2Controller},
            OopsieLogsyController,
        },
        log_assert, log_info,
        logger::init_logger_thread,
        state::{
            data::{
                filters::{Filter, FilterColors, FilterComponent, FilterTab},
                logs::{LogsChunk, LogsManager},
                regex_tags::RegexTag,
            },
            AppState,
        },
    };

    fn cleanup_test_dir(logs_manager: &LogsManager) {
        let _res = std::fs::remove_dir(OopsieV2Controller::get_database_path(&logs_manager));
        let _res = std::fs::remove_dir(OopsieV2Controller::get_filtered_database_path(
            &logs_manager,
        ));
    }

    fn make_raw_input_file_path() -> PathBuf {
        let cwd = std::env::current_dir()
            .expect("[OopsieV2Controller::Test] Failed to get current dir")
            .join("..")
            .join("project")
            .join("proto")
            .join("benchmark_logs.1000.txt");
        cwd
    }

    fn make_default_tags() -> Vec<RegexTag> {
        vec![
            RegexTag {
                id: String::from("tag-0"),
                displayed: true,
                regex: String::from("\\d+"),
                name: String::from("Timestamp"),
            },
            RegexTag {
                id: String::from("tag-1"),
                displayed: false,
                regex: String::from("\\s+"),
                name: String::from("-"),
            },
            RegexTag {
                id: String::from("tag-2"),
                displayed: true,
                regex: String::from("Channel[1-4]"),
                name: String::from("Channel"),
            },
            RegexTag {
                id: String::from("tag-3"),
                displayed: false,
                regex: String::from("\\s+"),
                name: String::from("-"),
            },
            RegexTag {
                id: String::from("tag-4"),
                displayed: true,
                regex: String::from("trace|info|error|debug|warn"),
                name: String::from("Level"),
            },
            RegexTag {
                id: String::from("tag-5"),
                displayed: false,
                regex: String::from("\\s+"),
                name: String::from("-"),
            },
            RegexTag {
                id: String::from("tag-6"),
                displayed: true,
                regex: String::from(".*"),
                name: String::from("Payload"),
            },
        ]
    }

    fn test_convert_logs(
        app_state: &mut AppState,
        raw_input_file_path: &PathBuf,
    ) -> io::Result<()> {
        let _ = ScopeLog::new(&test_convert_logs);

        // >> convert logs
        let _res = app_state.controller.convert_logs(&mut app_state.data);

        // >> assert files were created
        log_assert!(
            &test_convert_logs,
            std::fs::exists(OopsieV2Controller::get_database_path(&app_state.data.logs))?,
            "Missing database file"
        );
        log_assert!(
            &test_convert_logs,
            std::fs::exists(OopsieV2Controller::get_filtered_database_path(
                &app_state.data.logs
            ))?,
            "Missing filtered database file"
        );

        // >> check that both oopsie files are created
        let raw_input_reader = BufReader::new(File::open(&raw_input_file_path)?);
        let db_reader = csv::ReaderBuilder::new()
            .has_headers(false)
            .from_path(OopsieV2Controller::get_database_path(&app_state.data.logs))?;
        let filtered_db_reader = csv::ReaderBuilder::new().has_headers(false).from_path(
            OopsieV2Controller::get_filtered_database_path(&app_state.data.logs),
        )?;

        let mut raw_lines = raw_input_reader.lines();
        let mut db_records = db_reader.into_records();
        let mut filtered_db_records = filtered_db_reader.into_records();

        let mut line_index = 0;
        loop {
            match (
                raw_lines.next(),
                db_records.next(),
                filtered_db_records.next(),
            ) {
                (Some(Ok(raw_line)), Some(Ok(db_row)), Some(Ok(filtered_db_row))) => {
                    line_index += 1;

                    println!("-------------------------------------------------");
                    println!(">> Checking line {}", line_index);
                    println!(">> Raw line: {}", raw_line);
                    println!(">> DB row: {:?}", db_row);
                    println!(">> Filtered DB row: {:?}", filtered_db_row);

                    let db_row_str = db_row.iter().collect::<Vec<_>>().join(" ");
                    println!(">> DB row as string: {}", db_row_str);

                    log_assert!(
                        &test_convert_logs,
                        raw_line.eq(&db_row_str),
                        "Raw line and DB row did not match"
                    );

                    log_assert!(
                        &test_convert_logs,
                        filtered_db_row
                            .get(0)
                            .expect(
                                format!(
                                    "Could not get first field of filtered record at line {}",
                                    line_index
                                )
                                .as_str()
                            )
                            .eq(DEFAULT_FILTER_ID),
                        "Default filter ID missmatch on line {}",
                        line_index
                    );

                    let filtered_db_row_str =
                        filtered_db_row.iter().skip(1).collect::<Vec<_>>().join(" ");
                    println!(">> Filtered DB row as string: {}", filtered_db_row_str);

                    log_assert!(
                        &test_convert_logs,
                        raw_line.eq(&db_row_str),
                        "Raw line and Filtered DB row did not match"
                    );
                }
                (None, None, None) => {
                    break;
                }
                _ => {
                    log_assert!(
                        &test_convert_logs,
                        false,
                        "Input length mismatch at line {} (raw / db / filtered)",
                        line_index
                    );
                }
            }
        }

        Ok(())
    }

    fn test_get_filtered_logs(
        app_state: &mut AppState,
        desired_range: IndexRange,
    ) -> io::Result<()> {
        let _ = ScopeLog::new(&test_get_filtered_logs);
        log_info!(
            &test_get_filtered_logs,
            "desired range: {:?}",
            desired_range
        );

        let fetched_data = match app_state
            .controller
            .get_filtered_logs_chunk(&mut app_state.data, desired_range.clone())
        {
            Ok(chunk) => chunk,
            Err(err) => {
                log_assert!(
                    &test_get_filtered_logs,
                    false,
                    "Error while filtering: {}",
                    err
                );
                LogsChunk::new()
            }
        };

        let filtered_db_reader = csv::ReaderBuilder::new().has_headers(false).from_path(
            OopsieV2Controller::get_filtered_database_path(&app_state.data.logs),
        )?;
        let mut filtered_records = filtered_db_reader.into_records();
        for _ in 0..desired_range.begin() {
            let _data = filtered_records.next();
        }
        let mut raw_data: Vec<StringRecord> = Vec::with_capacity(desired_range.size());
        for index_line in desired_range.begin()..(desired_range.end() + 1) {
            let record = filtered_records
                .next()
                .expect(format!("Could not read record at line {}", index_line).as_str())?;
            raw_data.push(record);
        }

        log_assert!(
            &test_get_filtered_logs,
            raw_data.len() == fetched_data.data.len(),
            "Missmatch in data length"
        );

        let labels = vec!["ID", "Timestamp", "Channel", "Level", "Payload"];
        for row_index in 0..raw_data.len() {
            let raw_line_index = row_index + desired_range.begin() as usize;
            let raw = &raw_data[row_index];
            let filtered = &fetched_data.data[row_index];

            for field_idx in 0..5 {
                log_assert!(
                    &test_get_filtered_logs,
                    raw[field_idx].eq(&filtered[field_idx]),
                    "Missmatch {} on line {}\n\traw: {}, filtered: {}",
                    labels[field_idx],
                    raw_line_index,
                    raw.get(field_idx).unwrap(),
                    filtered[field_idx]
                );
            }
        }

        Ok(())
    }

    fn test_filter_logs(app_state: &mut AppState) -> io::Result<()> {
        let _ = ScopeLog::new(&test_filter_logs);

        // >> set filters
        app_state.data.filters.set(
            vec![FilterTab {
                id: String::from("filter-tab-1"),
                name: String::from("Tab1"),
                filter_ids: vec![String::from("filter-1"), String::from("filter-2")],
                enabled: true,
            }],
            vec![
                Filter {
                    id: String::from("filter-1"),
                    name: String::from("Filter 1"),
                    is_active: true,
                    is_highlight_only: false,
                    component_ids: vec![String::from("component-1")],
                    colors: FilterColors {
                        fg: String::from("blue"),
                        bg: String::from("black"),
                    },
                    priority: 1,
                    collapsed: false,
                },
                Filter {
                    id: String::from("filter-2"),
                    name: String::from("Filter 2"),
                    is_active: true,
                    is_highlight_only: false,
                    component_ids: vec![String::from("component-2")],
                    colors: FilterColors {
                        fg: String::from("yellow"),
                        bg: String::from("black"),
                    },
                    priority: 1,
                    collapsed: false,
                },
            ],
            vec![
                FilterComponent {
                    id: String::from("component-1"),
                    over_alternative_id: String::from("tag-4"),
                    data: String::from("info"),
                    is_regex: false,
                    is_equals: true,
                    ignore_case: true,
                },
                FilterComponent {
                    id: String::from("component-2"),
                    over_alternative_id: String::from("tag-4"),
                    data: String::from("debug"),
                    is_regex: false,
                    is_equals: true,
                    ignore_case: true,
                },
            ],
        );

        // >> do the filtering
        let _res = app_state.controller.filter_logs(&mut app_state.data);

        // >> assert databases exist
        log_assert!(
            &test_filter_logs,
            std::fs::exists(OopsieV2Controller::get_database_path(&app_state.data.logs))?,
            "Missing database file"
        );
        log_assert!(
            &test_filter_logs,
            std::fs::exists(OopsieV2Controller::get_filtered_database_path(
                &app_state.data.logs
            ))?,
            "Missing filtered database file"
        );

        // >> check what was filtered
        let mut filtered_db_reader = csv::ReaderBuilder::new().has_headers(false).from_path(
            OopsieV2Controller::get_filtered_database_path(&app_state.data.logs),
        )?;
        let mut line_index = 0;
        for record in filtered_db_reader.records() {
            line_index += 1;
            let record = record.expect("Error getting record of filtered db");

            let filter_id = record.get(0);
            match filter_id {
                Some(filter_id) => {
                    log_assert!(
                        &test_filter_logs,
                        filter_id.eq("filter-1") || filter_id.eq("filter-2"),
                        "Missmatch in filter IDs at line {}",
                        line_index
                    );
                }
                None => {
                    log_assert!(
                        &test_filter_logs,
                        false,
                        "Could not get first field of filtered record at line {}",
                        line_index
                    );
                }
            }

            let record_channel = record.get(3);
            match record_channel {
                Some(record_channel) => {
                    log_assert!(
                        &test_filter_logs,
                        record_channel.eq("info") || record_channel.eq("debug"),
                        "Wrong filter channel at line {}",
                        line_index
                    );
                }
                None => {
                    log_assert!(
                        &test_filter_logs,
                        false,
                        "Could not get 4th field of filtered record at line {}",
                        line_index
                    );
                }
            }
        }

        Ok(())
    }

    #[test]
    fn test_controller() -> io::Result<()> {
        init_logger_thread();

        println!(">> Testing OopsieV2Controller");

        // >> setup app state
        let mut app_state = AppState::default();
        app_state.controller =
            crate::controller::OopsieLogsyControllerStrategy::OopsieV2(OopsieV2Controller::new());
        app_state.data.regex_tags.set(make_default_tags());

        // >> get raw test file path
        let raw_input_file_path = make_raw_input_file_path();
        println!("Raw input file path: {}", raw_input_file_path.display());
        app_state
            .data
            .logs
            .set_raw_logs_path(vec![raw_input_file_path.clone()]);

        // >> cleanup oopsie data files
        cleanup_test_dir(&app_state.data.logs);

        // >> testing
        test_convert_logs(&mut app_state, &raw_input_file_path)?;

        test_get_filtered_logs(&mut app_state, IndexRange::new(12, 45))?;
        test_get_filtered_logs(&mut app_state, IndexRange::new(10, 11))?;
        test_get_filtered_logs(&mut app_state, IndexRange::new(15, 100))?;

        test_filter_logs(&mut app_state)?;

        test_get_filtered_logs(&mut app_state, IndexRange::new(12, 45))?;
        test_get_filtered_logs(&mut app_state, IndexRange::new(10, 11))?;
        test_get_filtered_logs(&mut app_state, IndexRange::new(15, 100))?;

        Ok(())
    }
}
