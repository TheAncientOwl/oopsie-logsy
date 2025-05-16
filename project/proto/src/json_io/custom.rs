//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `custom.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Test custom implementation of writing json objects to a file.
//!

use std::{
    fs::File,
    io::{BufReader, BufWriter, Write},
};

use crate::{
    common::{
        benchmark::{benchmark, create_file, remove_file},
        timer::time_function_ms,
    },
    model::log_entry::{LogEntry, LogEntryIterator},
};

fn write1(
    logs_iterator: impl Iterator<Item = LogEntry>,
    out_file: &mut File,
) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);

    let common_length = 0
    + "timestamp:".len() // field names
    + "level:".len()
    + "channel:".len()
    + "payload:".len()
    + 4 // commas
    + 2 // {}
    + 4 * 4 // ""
    + 1 // \n
    ;
    for log in logs_iterator {
        let total_length = common_length
            + log.timestamp.len()
            + log.level.len()
            + log.channel.len()
            + log.payload.len();

        let mut json_str = String::with_capacity(total_length);

        json_str.push('{');

        json_str.push_str("\"timestamp\":\"");
        json_str.push_str(&log.timestamp);
        json_str.push_str("\",");

        json_str.push_str("\"level\":\"");
        json_str.push_str(&log.level);
        json_str.push_str("\",");

        json_str.push_str("\"channel\":\"");
        json_str.push_str(&log.channel);
        json_str.push_str("\",");

        json_str.push_str("\"payload\":\"");
        json_str.push_str(&log.payload);
        json_str.push_str("\",}\n");

        writer.write_all(json_str.as_bytes())?;
    }

    writer.flush()?;
    Ok(())
}

fn write_string(writer: &mut BufWriter<&mut File>, s: &str) -> std::io::Result<()> {
    let bytes = s.as_bytes();
    let len = bytes.len();
    writer.write_all(&len.to_le_bytes())?;
    writer.write_all(bytes)?;
    Ok(())
}

fn write2(
    logs_iterator: impl Iterator<Item = LogEntry>,
    out_file: &mut File,
) -> std::io::Result<()> {
    let mut writer = BufWriter::new(out_file);

    for log in logs_iterator {
        write_string(&mut writer, &log.timestamp)?;
        write_string(&mut writer, &log.level)?;
        write_string(&mut writer, &log.channel)?;
        write_string(&mut writer, &log.payload)?;
    }

    writer.flush()?;
    Ok(())
}

pub fn write3(
    logs_iterator: impl Iterator<Item = LogEntry>,
    out_file: &mut File,
) -> std::io::Result<()> {
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

fn read3(input_file: &mut File) -> std::io::Result<()> {
    use std::io::Read;

    let mut reader = BufReader::new(input_file);

    let _tags = vec!["timestamp", "level", "channel", "payload"];
    let mut index: usize = 0;

    loop {
        let mut len_bytes = [0u8; 4];
        // Try to read length prefix
        match reader.read_exact(&mut len_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }
        let len = u32::from_le_bytes(len_bytes) as usize;

        // Read the string bytes
        let mut buffer = vec![0u8; len];
        reader.read_exact(&mut buffer)?;

        // Convert bytes to String (lossy)
        let _s = String::from_utf8_lossy(&buffer).to_string();

        index = (index + 1) % 4;
        // println!("{}: {}", tags[index], s);
        if index % 4 == 0 {
            // println!(">");
        }
    }

    Ok(())
}

const LOGS_FILE_PATH: &str = "logs.oopsie";

fn benchmark3(logs_iterator: &mut LogEntryIterator) {
    {
        let tag = "Custom::write3 ~ custom binary";
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
        let tag = "Custom::read3 ~ custom binary";

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
    let logs_file_path = "logs.oops";

    {
        let tag = "Custom::write1 ~ handmade JSON";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(logs_file_path);
            let elapsed = time_function_ms(|| {
                let _ = write1(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(logs_file_path);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
    println!("\n");
    {
        let tag = "Custom::write2 ~ binary";
        let mut exec = || -> f64 {
            logs_iterator.reset();

            let mut file = create_file(logs_file_path);
            let elapsed = time_function_ms(|| {
                let _ = write2(logs_iterator.skip_io_errors(), &mut file);
                Ok(())
            });

            remove_file(logs_file_path);

            elapsed
        };
        benchmark(tag, &mut exec);
    }
    println!("\n");
    benchmark3(logs_iterator);
}
