//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `main.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Benchmark entry point.
//!

pub mod common;
pub mod json_io;
pub mod model;
pub mod regex_matching;

use model::log_entry::LogEntryIterator;

pub fn benchmark_json_io(logs_iterator: &mut LogEntryIterator) -> std::io::Result<()> {
    // json_io::serde_json::run_benchmark(logs_iterator);
    // json_io::json_rust::run_benchmark(logs_iterator);
    json_io::custom::run_benchmark(logs_iterator);

    Ok(())
}

fn main() {
    // let mut log_iterator = LogEntryIterator::new("benchmark_logs.1000.txt");
    // let mut log_iterator = LogEntryIterator::new("benchmark_logs.100000.txt");
    // let mut log_iterator = LogEntryIterator::new("benchmark_logs.9000000.txt");
    // let mut log_iterator = LogEntryIterator::new("benchmark_logs.25000000.txt");
    let mut log_iterator = LogEntryIterator::new("benchmark_logs.30000000.txt");

    // let _ = benchmark_json_io(&mut log_iterator);
    let _ = regex_matching::bench_match::run_benchmark(&mut log_iterator);
}
