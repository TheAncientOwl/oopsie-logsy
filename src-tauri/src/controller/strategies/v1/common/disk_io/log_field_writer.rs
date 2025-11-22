//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `log_field_writer.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Log field output manager.
//!

use std::fs::OpenOptions;

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

pub struct LogFieldWriter {
    field_name: String,
    data_writer: std::io::BufWriter<std::fs::File>,
    index_writer: std::io::BufWriter<std::fs::File>,
    current_offset: u64,
}

pub struct LogWriteResult {
    pub offset: usize,
    pub size: usize,
}

impl LogFieldWriter {
    pub fn open(field_name: &str, data_path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&LogFieldWriter::open);
        log_trace!(&LogFieldWriter::open, "field: \"{}\"", field_name,);

        let index_path = data_path.with_file_name(
            data_path
                .file_name()
                .map(|f| format!("{}.idx", f.to_string_lossy()))
                .expect("Invalid file name"),
        );
        Self {
            field_name: field_name.to_owned(),
            data_writer: LogFieldWriter::open_file(data_path, field_name),
            index_writer: LogFieldWriter::open_file(index_path, field_name),
            current_offset: 0,
        }
    }

    fn open_file(path: std::path::PathBuf, field_name: &str) -> std::io::BufWriter<std::fs::File> {
        log_trace!(&LogFieldWriter::open_file, "path: {:?}", &path,);

        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&path)
            .map_err(|err| {
                log_error!(
                    &LogFieldWriter::open_file,
                    "Failed to open field \"{}\" storage file at {:?}, reason: {}",
                    field_name,
                    path,
                    err
                )
            })
            .unwrap();
        std::io::BufWriter::new(file)
    }

    pub fn write(&mut self, value: &str) -> LogWriteResult {
        use std::io::Write;

        let bytes = value.as_bytes();
        let offset_bytes = self.current_offset.to_le_bytes();
        let size_bytes = (bytes.len() as u64).to_le_bytes();

        if let Err(err) = self.index_writer.write_all(&offset_bytes) {
            log_error!(
                &LogFieldWriter::write,
                "Failed to write index offset for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return LogWriteResult { offset: 0, size: 0 };
        }
        if let Err(err) = self.index_writer.write_all(&size_bytes) {
            log_error!(
                &LogFieldWriter::write,
                "Failed to write index size for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return LogWriteResult { offset: 0, size: 0 };
        }

        if let Err(err) = self.data_writer.write_all(bytes) {
            log_error!(
                &LogFieldWriter::write,
                "Failed to write data for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return LogWriteResult { offset: 0, size: 0 };
        }

        let out = LogWriteResult {
            offset: self.current_offset as usize,
            size: bytes.len(),
        };

        self.current_offset += bytes.len() as u64;

        out
    }

    pub fn flush(&mut self) {
        use std::io::Write;

        if let Err(err) = self.data_writer.flush() {
            log_error!(
                &LogFieldWriter::flush,
                "Failed to flush data writer for field \"{}\": {}",
                self.field_name,
                err
            );
        }

        if let Err(err) = self.index_writer.flush() {
            log_error!(
                &LogFieldWriter::flush,
                "Failed to flush index writer for field \"{}\": {}",
                self.field_name,
                err
            );
        }
    }
}
