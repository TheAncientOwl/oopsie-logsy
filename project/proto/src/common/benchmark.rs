//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `benchmark.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Benchmark common logics.
//!

use std::{
    fs::{File, OpenOptions},
    io::Write,
};

fn print_header(tag: &str) {
    println!("-----------------------[ {} ] -----------------------", tag);
}

fn print_start(tag: &str, runs_count: usize) {
    println!(
        "[+] {}: Start {} run{}",
        tag,
        runs_count,
        if runs_count == 1 { "" } else { "s" }
    );
}

fn format_duration(ms: f64) -> String {
    let total_ms = ms.round() as u64;
    let minutes = total_ms / 60000;
    let seconds = (total_ms % 60000) / 1000;
    let milliseconds = total_ms % 1000;

    if minutes > 0 {
        format!("{}min {}s {}ms", minutes, seconds, milliseconds)
    } else if seconds > 0 {
        format!("{}s {}ms", seconds, milliseconds)
    } else {
        format!("{}ms", milliseconds)
    }
}

fn print_end(tag: &str, runs_count: usize, total_duration_ms: f64) {
    if runs_count == 1 {
        println!(
            "[-] {}: Elapsed time once: {}",
            tag,
            format_duration(total_duration_ms)
        );
    } else {
        let avg_duration_ms = total_duration_ms / (runs_count as f64);
        println!(
            "[=] {}: Average duration over {} runs: {}",
            tag,
            runs_count,
            format_duration(avg_duration_ms)
        );
    }
}

const BENCHMARK_ONCE: usize = 1;
const BENCHMARK_MULTIPLE: usize = 10;
const BENCHMARK_ENABLE_MULTIPLE: bool = true;

pub fn create_file(path: &str) -> File {
    OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(path)
        .map_err(|e| {
            eprintln!("Error while creating file: {}", e);
        })
        .unwrap()
}

pub fn remove_file(path: &str) {
    if std::fs::metadata(path).is_ok() {
        let _ = std::fs::remove_file(path);
    };
}

pub fn benchmark<E>(tag: &str, exec: &mut E)
where
    E: FnMut() -> f64,
{
    print_header(tag);

    print_start(tag, BENCHMARK_ONCE);
    print_end(tag, BENCHMARK_ONCE, exec());

    if BENCHMARK_ENABLE_MULTIPLE {
        let mut total_duration_ms: f64 = 0.0;
        print_start(tag, BENCHMARK_MULTIPLE);
        for run_index in 0..BENCHMARK_MULTIPLE {
            if (run_index + 1) % 20 == 0 {
                println!("[>] Iteration {}", run_index + 1);
            }
            total_duration_ms += exec();
        }
        print_end(tag, BENCHMARK_MULTIPLE, total_duration_ms);
    }
}

pub fn pause() {
    print!("Press Enter to continue...");
    std::io::stdout().flush().unwrap();
    let mut input = String::new();
    std::io::stdin().read_line(&mut input).unwrap();
    println!("Continuing!");
}
