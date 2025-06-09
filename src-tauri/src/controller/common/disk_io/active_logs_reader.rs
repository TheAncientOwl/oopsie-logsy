//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `active_logs_writer.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Save active logs indices.
//!

use std::fs::File;
use std::io::{BufReader, Read};

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

use super::active_logs_writer::DEFAULT_FILTER_ID;

const FILTER_ID_LEN: usize = DEFAULT_FILTER_ID.len();

pub struct ActiveLogsReader {
    reader: BufReader<File>,
}

pub struct LogMetadata {
    pub index: u64,
    pub filter_id: String,
}

impl ActiveLogsReader {
    pub fn open(path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&ActiveLogsReader::open);
        log_trace!(&ActiveLogsReader::open, "Opening index file at {:?}", path);

        let file = File::open(&path)
            .map_err(|err| {
                log_error!(
                    &ActiveLogsReader::open,
                    "Failed to open file at {:?}, reason: {}",
                    path,
                    err
                )
            })
            .unwrap();

        Self {
            reader: BufReader::new(file),
        }
    }

    pub fn read_next(&mut self) -> Option<LogMetadata> {
        let mut index_buf = [0u8; 8];
        if self.reader.read_exact(&mut index_buf).is_err() {
            return None;
        }

        let mut filter_buf = [0u8; FILTER_ID_LEN];
        if self.reader.read_exact(&mut filter_buf).is_err() {
            return None;
        }

        let log_index = u64::from_le_bytes(index_buf);
        let filter_id = match std::str::from_utf8(&filter_buf) {
            Ok(s) => s.to_string(),
            Err(_) => return None,
        };

        Some(LogMetadata {
            index: log_index,
            filter_id,
        })
    }

    pub fn read_at(&mut self, index: u64) -> Option<LogMetadata> {
        use std::io::{Seek, SeekFrom};

        let entry_size = 8 + FILTER_ID_LEN as u64;

        if self
            .reader
            .seek(SeekFrom::Start(index * entry_size))
            .is_err()
        {
            return None;
        }

        self.read_next()
    }
}
