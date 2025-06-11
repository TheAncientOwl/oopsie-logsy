//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `log_chunks_manager.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Thread safe chunks splitter utility.
//!

use std::sync::Mutex;

use crate::controller::common::index_range::IndexRange;

pub struct LogChunkManager {
    total_logs: u64,
    chunk_size: u64,
    next_start: u64,
}

impl LogChunkManager {
    pub fn new(total_logs: u64, chunk_size: u64) -> Self {
        Self {
            total_logs,
            chunk_size,
            next_start: 0,
        }
    }

    pub fn get_chunk(&mut self) -> Option<IndexRange> {
        if self.next_start >= self.total_logs {
            None
        } else {
            let begin = self.next_start;
            let end = u64::min(begin + self.chunk_size, self.total_logs);
            self.next_start = end;
            Some(IndexRange::new(begin, end))
        }
    }
}

pub struct ThreadSafeLogChunkManager {
    inner: Mutex<LogChunkManager>,
}

impl ThreadSafeLogChunkManager {
    pub fn new(total_logs: u64, chunk_size: u64) -> Self {
        Self {
            inner: Mutex::new(LogChunkManager::new(total_logs, chunk_size)),
        }
    }

    pub fn get_chunk(&self) -> Option<IndexRange> {
        let mut manager = self.inner.lock().unwrap();
        manager.get_chunk()
    }
}
