//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `log_field_storage.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Log field IO manager.
//!

use std::fs::OpenOptions;

use crate::{common::scope_log::ScopeLog, log_error, log_trace};

pub struct Writer {
    field_name: String,
    data_writer: std::io::BufWriter<std::fs::File>,
    index_writer: std::io::BufWriter<std::fs::File>,
    current_offset: u64,
}

impl Writer {
    pub fn open(field_name: &str, data_path: std::path::PathBuf) -> Self {
        let _log = ScopeLog::new(&Writer::open);
        log_trace!(&Writer::open, "field: \"{}\"", field_name,);

        let index_path = data_path.with_file_name(
            data_path
                .file_name()
                .map(|f| format!("{}.idx", f.to_string_lossy()))
                .expect("Invalid file name"),
        );
        Self {
            field_name: field_name.to_owned(),
            data_writer: Writer::open_file(data_path, field_name),
            index_writer: Writer::open_file(index_path, field_name),
            current_offset: 0,
        }
    }

    fn open_file(path: std::path::PathBuf, field_name: &str) -> std::io::BufWriter<std::fs::File> {
        log_trace!(&Writer::open_file, "path: {:?}", &path,);

        let file = OpenOptions::new()
            .write(true)
            .create(true)
            .truncate(true)
            .open(&path)
            .map_err(|err| {
                log_error!(
                    &Writer::open_file,
                    "Failed to open field \"{}\" storage file at {:?}, reason: {}",
                    field_name,
                    path,
                    err
                )
            })
            .unwrap();
        std::io::BufWriter::new(file)
    }

    pub fn write(&mut self, value: &str) {
        use std::io::Write;

        let bytes = value.as_bytes();
        let offset_bytes = self.current_offset.to_le_bytes();
        let size_bytes = (bytes.len() as u64).to_le_bytes();

        if let Err(err) = self.index_writer.write_all(&offset_bytes) {
            log_error!(
                &Writer::write,
                "Failed to write index offset for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return;
        }
        if let Err(err) = self.index_writer.write_all(&size_bytes) {
            log_error!(
                &Writer::write,
                "Failed to write index size for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return;
        }

        if let Err(err) = self.data_writer.write_all(bytes) {
            log_error!(
                &Writer::write,
                "Failed to write data for field \"{}\", reason: {}",
                self.field_name,
                err
            );
            return;
        }

        self.current_offset += bytes.len() as u64;
    }

    pub fn flush(&mut self) {
        use std::io::Write;

        if let Err(err) = self.data_writer.flush() {
            log_error!(
                &Writer::flush,
                "Failed to flush data writer for field \"{}\": {}",
                self.field_name,
                err
            );
        }

        if let Err(err) = self.index_writer.flush() {
            log_error!(
                &Writer::flush,
                "Failed to flush index writer for field \"{}\": {}",
                self.field_name,
                err
            );
        }
    }
}
