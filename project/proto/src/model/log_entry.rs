//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `log_entry.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Main data struct of benchmark.
//!

use std::{
    fs::File,
    io::{BufRead, BufReader, Seek},
    str::FromStr,
};

#[derive(Debug)]
pub struct LogEntry {
    pub timestamp: String,
    pub channel: String,
    pub level: String,
    pub payload: String,
}

impl FromStr for LogEntry {
    type Err = String;

    fn from_str(line: &str) -> Result<Self, Self::Err> {
        let parts: Vec<&str> = line.splitn(4, ' ').collect();
        if parts.len() < 4 {
            return Err("Invalid log line format".to_string());
        }

        Ok(LogEntry::new(
            parts[0].to_string(),
            parts[1].to_string(),
            parts[2].to_string(),
            parts[3].to_string(),
        ))
    }
}

impl LogEntry {
    pub fn new(timestamp: String, channel: String, level: String, payload: String) -> Self {
        Self {
            timestamp,
            channel,
            level,
            payload,
        }
    }
}

pub struct LogEntryIterator {
    reader: BufReader<File>,
}

impl LogEntryIterator {
    pub fn new(file_path: &str) -> Self {
        let file = File::open(file_path).expect("Failed to open log file");
        LogEntryIterator {
            reader: BufReader::new(file),
        }
    }

    pub fn reset(&mut self) {
        let _ = self.reader.seek(std::io::SeekFrom::Start(0));
    }

    pub fn skip_io_errors(&mut self) -> impl Iterator<Item = LogEntry> {
        self.by_ref().filter_map(|res| res.ok()).into_iter()
    }
}

impl Iterator for LogEntryIterator {
    type Item = Result<LogEntry, String>;

    fn next(&mut self) -> Option<Self::Item> {
        let mut line = String::new();

        match self.reader.read_line(&mut line) {
            Ok(0) => None, // EOF
            Ok(_) => {
                line.pop(); // remove new-line char
                Some(LogEntry::from_str(&line))
            }
            Err(e) => {
                eprintln!("IO Error while reading: {}", e);
                self.next()
            }
        }
    }
}
