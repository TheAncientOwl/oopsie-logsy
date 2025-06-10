//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `active_logs_writer.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Save active logs indices.
//!

//   default filter: 00000000-0000-0000-0000-000000000000
// generated filter: 01974f35-19f5-7782-a378-dd3f8100bdaf

pub const DEFAULT_FILTER_ID: &str = "00000000-0000-0000-0000-000000000000";
pub const DEFAULT_FILTER_INDEX: u16 = 0;

use std::fs::OpenOptions;

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

pub struct ActiveLogsWriter {
    writer: std::io::BufWriter<std::fs::File>,
}

impl ActiveLogsWriter {
    pub fn open(path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&ActiveLogsWriter::open);
        log_trace!(&ActiveLogsWriter::open, "Opening index file at {:?}", path);

        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&path)
            .map_err(|err| {
                log_error!(
                    &ActiveLogsWriter::open,
                    "Failed to open index file at {:?}, reason: {}",
                    path,
                    err
                )
            })
            .unwrap();

        Self {
            writer: std::io::BufWriter::new(file),
        }
    }

    pub fn write(&mut self, log_index: u64, filter_id_index: u16) {
        // let _log = ScopeLog::new(&ActiveLogsWriter::write);
        use std::io::Write;

        let index_bytes = log_index.to_le_bytes();
        if let Err(err) = self.writer.write_all(&index_bytes) {
            log_error!(
                &ActiveLogsWriter::write,
                "Failed to write log index {}, reason: {}",
                log_index,
                err
            );
            return;
        }

        let filter_id_index_bytes = filter_id_index.to_le_bytes();
        if let Err(err) = self.writer.write_all(&filter_id_index_bytes) {
            log_error!(
                &ActiveLogsWriter::write,
                "Failed to write filter ID index \"{}\", reason: {}",
                filter_id_index,
                err
            );
        }
    }

    pub fn flush(&mut self) {
        use std::io::Write;

        if let Err(err) = self.writer.flush() {
            log_error!(
                &ActiveLogsWriter::flush,
                "Failed to flush data writer, reason: {}",
                err
            );
        }
    }
}
