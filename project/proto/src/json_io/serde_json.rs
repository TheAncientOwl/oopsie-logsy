//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `serde_json.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Test Serde JSON object creation and writing.
//!

use crate::{
    common::{
        benchmark::{benchmark, create_file, remove_file},
        timer::time_function_ms,
    },
    model::log_entry::{LogEntry, LogEntryIterator},
};
use serde_json::{Value, json};
use std::{
    fs::File,
    io::{BufRead, BufReader, BufWriter, Write},
};

fn write1(
    logs_iterator: impl Iterator<Item = LogEntry>,
    out_file: &mut File,
) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);

    for log in logs_iterator {
        let mut obj = json!({});
        obj["timestamp"] = Value::String(log.timestamp);
        obj["channel"] = Value::String(log.channel);
        obj["level"] = Value::String(log.level);
        obj["payload"] = Value::String(log.payload);

        serde_json::to_writer(&mut writer, &obj)?;
        writer.write_all(b"\n")?;
    }

    writer.flush()?;
    Ok(())
}

pub fn read1(input_file: &mut File) -> std::io::Result<()> {
    let reader = BufReader::new(input_file);

    for line in reader.lines() {
        let line = line?;
        let _obj: Value = serde_json::from_str(&line)?;
    }

    Ok(())
}

fn write2(
    logs_iterator: impl Iterator<Item = LogEntry>,
    out_file: &mut File,
) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);

    for log in logs_iterator {
        let mut obj = serde_json::Map::new();
        obj.insert(
            "timestamp".to_string(),
            serde_json::Value::String(log.timestamp),
        );
        obj.insert(
            "channel".to_string(),
            serde_json::Value::String(log.channel),
        );
        obj.insert("level".to_string(), serde_json::Value::String(log.level));
        obj.insert(
            "payload".to_string(),
            serde_json::Value::String(log.payload),
        );

        serde_json::to_writer(&mut writer, &obj)?;
        writer.write_all(b"\n")?;
    }

    writer.flush()?;
    Ok(())
}

pub fn read2(input_file: &mut File) -> std::io::Result<()> {
    read1(input_file)
}

fn write3(
    logs_iterator: impl Iterator<Item = LogEntry>,
    out_file: &mut File,
) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);

    for log in logs_iterator {
        let mut obj = bson::Document::new();
        obj.insert("timestamp".to_string(), log.timestamp);
        obj.insert("channel".to_string(), log.channel);
        obj.insert("level".to_string(), log.level);
        obj.insert("payload".to_string(), log.payload);

        let bson_bytes = bson::to_vec(&obj).map_err(|e| {
            std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("BSON serialization error: {}", e),
            )
        })?;

        writer.write_all(&bson_bytes)?;
    }

    writer.flush()?;
    Ok(())
}

pub fn read3(input_file: &mut File) -> std::io::Result<()> {
    use std::io::{BufReader, Read};
    let mut reader = BufReader::new(input_file);

    loop {
        // Read the document length (first 4 bytes)
        let mut length_bytes = [0u8; 4];
        match reader.read_exact(&mut length_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }

        let doc_length = i32::from_le_bytes(length_bytes) as usize;

        // We've already read 4 bytes (length), so read the remaining bytes
        let mut doc_bytes = vec![0u8; doc_length - 4];
        reader.read_exact(&mut doc_bytes)?;

        // Combine length bytes + the rest of the document
        let mut full_doc_bytes = Vec::with_capacity(doc_length);
        full_doc_bytes.extend_from_slice(&length_bytes);
        full_doc_bytes.extend_from_slice(&doc_bytes);

        // Deserialize BSON document
        let _doc = bson::Document::from_reader(&mut full_doc_bytes.as_slice())
            .map_err(|e| std::io::Error::new(std::io::ErrorKind::InvalidData, e))?;
    }

    Ok(())
}

const LOGS_FILE_PATH: &str = "logs.json";

fn benchmark1(logs_iterator: &mut LogEntryIterator) {
    {
        let tag = "SerdeJSON::write1 ~ text";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(LOGS_FILE_PATH);
            let elapsed = time_function_ms(|| {
                let _ = write1(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(LOGS_FILE_PATH);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
    {
        let tag = "SerdeJSON::read1 ~ text";

        {
            let mut file = create_file(LOGS_FILE_PATH);
            logs_iterator.reset();
            let _ = write1(logs_iterator.skip_io_errors(), &mut file);
        }

        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE_PATH).unwrap();
            let elapsed = time_function_ms(|| {
                let _ = read1(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark(tag, &mut exec);

        remove_file(LOGS_FILE_PATH);
    }
}

fn benchmark2(logs_iterator: &mut LogEntryIterator) {
    {
        let tag = "SerdeJSON::write2 ~ text";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(LOGS_FILE_PATH);
            let elapsed = time_function_ms(|| {
                let _ = write2(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(LOGS_FILE_PATH);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
    {
        let tag = "SerdeJSON::read2 ~ text";

        {
            logs_iterator.reset();
            let mut file = create_file(LOGS_FILE_PATH);
            let _ = write2(logs_iterator.skip_io_errors(), &mut file);
        }

        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE_PATH).unwrap();
            let elapsed = time_function_ms(|| {
                let _ = read2(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark(tag, &mut exec);

        remove_file(LOGS_FILE_PATH);
    }
}

fn benchmark3(logs_iterator: &mut LogEntryIterator) {
    {
        let tag = "SerdeJSON::write3 ~ bson";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(LOGS_FILE_PATH);
            let elapsed = time_function_ms(|| {
                let _ = write3(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(LOGS_FILE_PATH);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
    {
        let tag = "SerdeJSON::read3 ~ bson";

        {
            logs_iterator.reset();
            let mut file = create_file(LOGS_FILE_PATH);
            let _ = write3(logs_iterator.skip_io_errors(), &mut file);
        }

        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE_PATH).unwrap();
            let elapsed = time_function_ms(|| {
                let _ = read3(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark(tag, &mut exec);

        remove_file(LOGS_FILE_PATH);
    }
}

pub fn run_benchmark(logs_iterator: &mut LogEntryIterator) {
    benchmark1(logs_iterator);
    println!("\n");
    benchmark2(logs_iterator);
    println!("\n");
    benchmark3(logs_iterator);
}
