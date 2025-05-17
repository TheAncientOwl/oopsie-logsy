//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `scope_log.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Log the begining and end of a scope.
//!

use owo_colors::{OwoColorize, Style};

use super::timer::Timer;
use crate::logger::log;

pub struct ScopeLog<'a, T> {
    caller: &'a T,
    timer: Timer,
}

use once_cell::sync::Lazy;

const COLOR: Style = Style::new().bright_magenta();

static BEGIN_BRACKET: Lazy<String> = Lazy::new(|| {
    "[".style(Style::new().bright_black()).to_string()
        + &"+".style(Style::new().bright_green()).to_string()
        + &"]".style(Style::new().bright_black()).to_string()
});
static BEGIN_LABEL: Lazy<String> =
    Lazy::new(|| " begin".style(Style::new().bright_green()).to_string());

static END_BRACKET: Lazy<String> = Lazy::new(|| {
    "[".style(Style::new().bright_black()).to_string()
        + &"-".style(Style::new().bright_red()).to_string()
        + &"]".style(Style::new().bright_black()).to_string()
});
static END_LABEL: Lazy<String> = Lazy::new(|| {
    " end".style(Style::new().bright_red()).to_string()
        + &" ~ elapsed".style(Style::new().bright_white()).to_string()
        + &": ".style(Style::new().bright_black()).to_string()
});

fn log_scope_begin<T>(caller: &T, args: std::fmt::Arguments) {
    log("scope", COLOR, caller, args)
}
#[macro_export]
macro_rules! log_scope_begin {
    ($caller:expr, $($arg:tt)*) => {
        $crate::common::scope_log::log_scope_begin($caller, format_args!($($arg)*))
    };
}

impl<'a, T> ScopeLog<'a, T> {
    pub fn new(caller: &'a T) -> Self {
        log_scope_begin!(caller, "{}{}", &*BEGIN_BRACKET, &*BEGIN_LABEL);
        Self {
            caller,
            timer: Timer::new(),
        }
    }
}

fn log_scope_end<T>(caller: &T, args: std::fmt::Arguments) {
    log("scope", COLOR, caller, args)
}
#[macro_export]
macro_rules! log_scope_end {
    ($caller:expr, $($arg:tt)*) => {
        $crate::common::scope_log::log_scope_end($caller, format_args!($($arg)*))
    };
}

impl<'a, T> Drop for ScopeLog<'a, T> {
    fn drop(&mut self) {
        log_scope_end!(
            self.caller,
            "{}{}{}",
            &*END_BRACKET,
            &*END_LABEL,
            Timer::format_duration(self.timer.elapsed_ms()).style(Style::new().bright_white()),
        );
    }
}
