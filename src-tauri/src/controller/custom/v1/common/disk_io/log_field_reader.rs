//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `log_field_reader.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Log field input manager.
//!

use std::fs::OpenOptions;

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

pub struct LogFieldReader {
    data_path: std::path::PathBuf,
    field_name: String,
    data_reader: std::io::BufReader<std::fs::File>,
    index_reader: std::io::BufReader<std::fs::File>,
    buffer: Vec<u8>,
}

impl Clone for LogFieldReader {
    fn clone(&self) -> Self {
        Self::open(&self.field_name, self.data_path.clone())
    }
}

impl LogFieldReader {
    pub fn open(field_name: &str, data_path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&LogFieldReader::open);
        log_trace!(&LogFieldReader::open, "field: \"{}\"", field_name,);

        let index_path = data_path.with_file_name(
            data_path
                .file_name()
                .map(|f| format!("{}.idx", f.to_string_lossy()))
                .expect("Invalid file name"),
        );
        Self {
            data_path: data_path.clone(),
            field_name: field_name.to_owned(),
            data_reader: LogFieldReader::open_file(data_path, field_name),
            index_reader: LogFieldReader::open_file(index_path, field_name),
            buffer: Vec::with_capacity(512),
        }
    }

    fn open_file(path: std::path::PathBuf, field_name: &str) -> std::io::BufReader<std::fs::File> {
        log_trace!(&LogFieldReader::open_file, "path: {:?}", &path,);

        let file = OpenOptions::new()
            .read(true)
            .open(&path)
            .map_err(|err| {
                log_error!(
                    &LogFieldReader::open_file,
                    "Failed to open field \"{}\" storage file at \"{:?}\", reason: {}",
                    field_name,
                    path,
                    err
                )
            })
            .unwrap();
        std::io::BufReader::new(file)
    }

    pub fn read_at(&mut self, index: u64) -> String {
        // let _log = ScopeLog::new(&LogFieldReader::read_at);

        use std::io::{Read, Seek, SeekFrom};

        let mut offset_bytes = [0u8; 8];
        let mut size_bytes = [0u8; 8];
        let seek_pos = (index * 16) as u64;

        if let Err(err) = self.index_reader.seek(SeekFrom::Start(seek_pos)) {
            log_error!(
                &LogFieldReader::read_at,
                "Failed to seek index for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return String::new();
        }

        if let Err(err) = self.index_reader.read_exact(&mut offset_bytes) {
            log_error!(
                &LogFieldReader::read_at,
                "Failed to read offset for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return String::new();
        }

        if let Err(err) = self.index_reader.read_exact(&mut size_bytes) {
            log_error!(
                &LogFieldReader::read_at,
                "Failed to read size for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return String::new();
        }

        let offset = u64::from_le_bytes(offset_bytes);
        let size = u64::from_le_bytes(size_bytes) as usize;

        if let Err(err) = self.data_reader.seek(SeekFrom::Start(offset)) {
            log_error!(
                &LogFieldReader::read_at,
                "Failed to seek data for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return String::new();
        }

        self.buffer.clear();
        self.buffer.reserve(size);
        unsafe {
            self.buffer.set_len(size);
        }

        if let Err(err) = self.data_reader.read_exact(&mut self.buffer) {
            log_error!(
                &LogFieldReader::read_at,
                "Failed to read data for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return String::new();
        }

        String::from_utf8_lossy(&self.buffer).to_string()
    }
}
