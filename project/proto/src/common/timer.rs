//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `timer.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Timer utility.
//!

use std::time::Instant;

pub struct Timer {
    start: Instant,
}

impl Timer {
    pub fn new() -> Self {
        Timer {
            start: Instant::now(),
        }
    }

    pub fn restart(&mut self) {
        self.start = Instant::now();
    }

    pub fn elapsed(&mut self) -> std::time::Duration {
        let elapsed = Some(self.start.elapsed());
        elapsed.unwrap()
    }
}

pub fn time_function_ms<T>(mut target_fn: T) -> f64
where
    T: FnMut() -> std::io::Result<()>,
{
    let mut timer = Timer::new();
    let _ = target_fn();
    timer.elapsed().as_secs_f64() * 1000.0
}
