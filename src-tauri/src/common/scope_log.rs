//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `scope_log.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Log the begining and end of a scope.
//!

use crate::log_trace;

pub struct ScopeLog<'a, T> {
    caller: &'a T,
}

impl<'a, T> ScopeLog<'a, T> {
    pub fn new(caller: &'a T) -> Self {
        log_trace!(caller, "begin");
        Self { caller }
    }
}

impl<'a, T> Drop for ScopeLog<'a, T> {
    fn drop(&mut self) {
        log_trace!(self.caller, "end");
    }
}
