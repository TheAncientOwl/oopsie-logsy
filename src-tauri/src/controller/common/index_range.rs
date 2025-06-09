//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `index.range.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Utility struct. Inclusive range [begin, end]
//!

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IndexRange {
    begin: usize,
    end: usize,
}

impl IndexRange {
    pub fn new(begin: usize, end: usize) -> Self {
        Self { begin, end }
    }

    pub fn contains(&self, index: usize) -> bool {
        self.begin <= index && index <= self.end
    }

    pub fn size(&self) -> usize {
        self.end - self.begin + 1
    }

    pub fn begin(&self) -> usize {
        self.begin
    }

    pub fn end(&self) -> usize {
        self.end
    }
}
