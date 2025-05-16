//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `test_json_rust.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Test JSON-Rust object creation and writing.
//!

use crate::{
    common::{
        benchmark::{benchmark, create_file, remove_file},
        timer::time_function_ms,
    },
    model::log_entry::{LogEntry, LogEntryIterator},
};
use json::object;
use std::{
    fs::File,
    io::{BufWriter, Write},
};

fn run1(logs_iterator: impl Iterator<Item = LogEntry>, out_file: &mut File) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);

    for log in logs_iterator {
        let mut obj = object! {};
        obj["timestamp"] = json::JsonValue::String(log.timestamp);
        obj["channel"] = json::JsonValue::String(log.channel);
        obj["level"] = json::JsonValue::String(log.level);
        obj["payload"] = json::JsonValue::String(log.payload);

        writer.write(json::stringify(obj).as_bytes())?;
        writer.write(b"\n")?;
    }

    writer.flush()?;
    Ok(())
}

fn run2(logs_iterator: impl Iterator<Item = LogEntry>, out_file: &mut File) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);
    let mut buffer = Vec::with_capacity(512);

    for log in logs_iterator {
        buffer.clear();

        for field in [&log.timestamp, &log.level, &log.channel, &log.payload] {
            let bytes = field.as_bytes();
            let len = bytes.len() as u32;
            buffer.extend_from_slice(&len.to_le_bytes());
            buffer.extend_from_slice(bytes);
        }

        writer.write_all(&buffer)?;
    }

    writer.flush()?;
    Ok(())
}

pub fn run_benchmark(logs_iterator: &mut LogEntryIterator) {
    let logs_file_path = "logs.json";

    {
        let tag = "JSON-Rust::run1 ~ text";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(logs_file_path);
            let elapsed = time_function_ms(|| {
                let _ = run1(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(logs_file_path);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
    {
        let tag = "JSON-Rust::run2 ~ binary";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(logs_file_path);
            let elapsed = time_function_ms(|| {
                let _ = run2(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(logs_file_path);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
}
