//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `index.range.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.3
//! **Description**: Utility struct. Inclusive range [begin, end]
//!

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IndexRange {
    begin: u64,
    end: u64,
}

impl IndexRange {
    pub fn new(begin: u64, end: u64) -> Self {
        Self { begin, end }
    }

    pub fn contains(&self, index: u64) -> bool {
        self.begin <= index && index <= self.end
    }

    pub fn size(&self) -> usize {
        (self.end - self.begin + 1) as usize
    }

    pub fn begin(&self) -> u64 {
        self.begin
    }

    pub fn end(&self) -> u64 {
        self.end
    }
}
