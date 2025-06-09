//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `json.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: JSON utilities.
//!

use crate::log_error;
use serde::Serialize;
use serde_json::to_string;

pub fn stringify<T: Serialize>(vec: &Vec<T>) -> String {
    match to_string(&vec) {
        Ok(json) => json,
        Err(err) => {
            log_error!(&stringify::<T>, "Failed to serialize JSON: {}", err);
            String::new()
        }
    }
}
