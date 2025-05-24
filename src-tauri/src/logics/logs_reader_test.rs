//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logs_reader_test.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Test only.
//!

use std::{
    fs::File,
    io::{BufRead, BufReader},
};

use crate::{common::scope_log::ScopeLog, log_debug, store::store::Store};

pub fn execute() {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance();
    let out_file_path = store.logs.get_current_processed_logs_dir();

    let file = File::open(out_file_path).expect("Cannot open file");
    let reader = BufReader::new(file);

    for line in reader.lines() {
        let line = line.expect("Failed to read line");
        let json_obj = json::from(line);

        log_debug!(&execute, "JSON: {}", json_obj)
    }
}
