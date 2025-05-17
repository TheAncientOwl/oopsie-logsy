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

    pub fn elapsed_ms(&mut self) -> f64 {
        let elapsed = Some(self.start.elapsed());
        elapsed.unwrap().as_secs_f64() * 1000.0
    }

    pub fn format_duration(ms: f64) -> String {
        let total_nanoseconds = (ms * 1_000_000.0).round() as u128;

        let minutes = total_nanoseconds / (60 * 1_000_000_000);
        let remainder_after_minutes = total_nanoseconds % (60 * 1_000_000_000);

        let seconds = remainder_after_minutes / 1_000_000_000;
        let remainder_after_seconds = remainder_after_minutes % 1_000_000_000;

        let milliseconds = remainder_after_seconds / 1_000_000;
        let nanoseconds = remainder_after_seconds % 1_000_000;

        let mut formatted = String::new();

        let values = [minutes, seconds, milliseconds, nanoseconds];
        let units = ["m", "s", "ms", "ns"];

        match values.iter().position(|&x| x != 0) {
            Some(index) => {
                for idx in index..values.len() {
                    formatted.push_str(&values[idx].to_string());
                    formatted.push_str(units[idx]);
                    formatted.push_str(", ");
                }
                formatted.pop();
                formatted.pop();
            }
            None => {}
        }

        formatted
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
