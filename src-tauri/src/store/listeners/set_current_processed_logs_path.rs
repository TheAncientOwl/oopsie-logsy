//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `set_current_processed_logs_path.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Set current processed logs path listener.
//!

use crate::{
    common::scope_log::ScopeLog,
    logic,
    store::{data::logs::LogPaths, store::Store},
};

pub fn listener(paths: &LogPaths) {
    let _log = ScopeLog::new(&listener);
    assert!(paths.len() > 0, "Received 0 log paths, logic error");

    let in_file_path = &paths[0];

    let out_file_name = in_file_path
        .file_name()
        .and_then(|name| name.to_str().map(|s| format!("{}.oopsie", s)))
        .expect("Failed to extract valid UTF-8 file name from input");

    let mut store = Store::get_instance_mut();
    store.logs.set_current_processed_logs_name(&out_file_name);
    let out_file_path_opt = store.logs.get_current_processed_logs_path().clone();
    std::mem::drop(store);

    assert!(
        out_file_path_opt.is_some(),
        "Failed to set output log path value"
    );

    logic::logs_converter::execute(in_file_path, out_file_path_opt.as_ref().unwrap());
    // logic::logs_reader_test::execute();
}
