//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logger.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.4
//! **Description**: Logger utilities.
//!

use std::{fs::OpenOptions, sync::Mutex};

use once_cell::sync::Lazy;
use owo_colors::{OwoColorize, Style};

use crate::store::paths::common::get_oopsie_home_dir;

static LOG_FILE: Lazy<Mutex<std::fs::File>> = Lazy::new(|| {
    let file_path = get_oopsie_home_dir().join("oopsie-logsy.log");

    let file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(file_path)
        .expect("Failed to open log file");

    Mutex::new(file)
});

const NEW_LINE: &[u8] = "\n".as_bytes();

pub fn log<T>(level: &'static str, level_style: Style, _caller: &T, args: std::fmt::Arguments) {
    // return;

    let sep = "|".bright_black();
    let caller_str = std::any::type_name::<T>();

    let caller_short = caller_str
        .strip_prefix("oopsie_logsy_lib")
        .unwrap_or(caller_str);

    let gray = Style::new().bright_black();
    let styled_caller = caller_short
        .split("::")
        .enumerate()
        .map(|(i, part)| {
            if i > 0 {
                format!("{}{}", "::".style(gray), part.style(level_style))
            } else {
                part.style(level_style).to_string()
            }
        })
        .collect::<String>();

    let log_line = format!(
        // "| time | level | caller: message"
        "{} {} {} {} {} {}{} {}{}",
        sep, // |
        chrono::Local::now()
            .format("%H:%M:%S:%3f:%6f")
            .to_string()
            .blue(), // time
        sep, // |
        format!("{:^5}", level).style(level_style), // level
        sep, // |
        styled_caller, // caller
        ":".bright_black(), // :
        args.style(level_style), // message
        "".default_color()
    );
    println!("{}", log_line);

    use std::io::Write;
    if let Ok(mut file) = LOG_FILE.lock() {
        let _ = file.write_all(log_line.as_bytes());
        let _ = file.write_all(NEW_LINE);
    }
}

pub fn trace<T>(caller: &T, args: std::fmt::Arguments) {
    log("trace", Style::new().bright_white(), caller, args)
}

pub fn info<T>(caller: &T, args: std::fmt::Arguments) {
    log("info", Style::new().bright_blue(), caller, args)
}

pub fn warn<T>(caller: &T, args: std::fmt::Arguments) {
    log("warn", Style::new().yellow(), caller, args)
}

pub fn debug<T>(caller: &T, args: std::fmt::Arguments) {
    log("debug", Style::new().bright_green(), caller, args)
}

pub fn error<T>(caller: &T, args: std::fmt::Arguments) {
    log("error", Style::new().red(), caller, args)
}

pub fn stringify<T>(val: T) -> &'static str {
    std::any::type_name_of_val(&val)
}

pub fn assert<T>(caller: &T, condition: bool, message: std::fmt::Arguments) {
    if !condition {
        error(caller, format_args!("Assertion Failed: {}", message));
        panic!("Assertion Failed");
    }
}

#[macro_export]
macro_rules! log_trace {
    ($caller:expr, $($arg:tt)*) => ($crate::logger::trace($caller, format_args!($($arg)*)));
}

#[macro_export]
macro_rules! log_info {
    ($caller:expr, $($arg:tt)*) => ($crate::logger::info($caller, format_args!($($arg)*)));
}

#[macro_export]
macro_rules! log_warn {
    ($caller:expr, $($arg:tt)*) => ($crate::logger::warn($caller, format_args!($($arg)*)));
}

#[macro_export]
macro_rules! log_debug {
    ($caller:expr, $($arg:tt)*) => ($crate::logger::debug($caller, format_args!($($arg)*)));
}

#[macro_export]
macro_rules! log_error {
    ($caller:expr, $($arg:tt)*) => ($crate::logger::error($caller, format_args!($($arg)*)));
}

#[macro_export]
macro_rules! log_assert {
    ($caller:expr, $cond:expr, $($arg:tt)*) => {
        $crate::logger::assert($caller, $cond, format_args!($($arg)*));
    };
}
