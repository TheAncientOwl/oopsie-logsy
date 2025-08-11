//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logger.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.5
//! **Description**: Logger utilities.
//!

use std::{
    fs::OpenOptions,
    io::Write,
    sync::mpsc::{self, Receiver, Sender},
    thread,
};

use once_cell::sync::{Lazy, OnceCell};
use owo_colors::{OwoColorize, Style};

use crate::store::paths::common::get_oopsie_home_dir;

pub struct LogRecord {
    pub level: &'static str,
    pub caller: String,
    pub message: String,
    pub timestamp: chrono::DateTime<chrono::Local>,
}

static LOG_SENDER: OnceCell<Sender<LogRecord>> = OnceCell::new();

static SEP: Lazy<String> = Lazy::new(|| "|".bright_black().to_string());
static GRAY: Lazy<Style> = Lazy::new(|| Style::new().bright_black());
static TRACE_STYLE: Lazy<Style> = Lazy::new(|| Style::new().bright_white());
static INFO_STYLE: Lazy<Style> = Lazy::new(|| Style::new().bright_blue());
static WARN_STYLE: Lazy<Style> = Lazy::new(|| Style::new().yellow());
static DEBUG_STYLE: Lazy<Style> = Lazy::new(|| Style::new().bright_green());
static ERROR_STYLE: Lazy<Style> = Lazy::new(|| Style::new().red());
static SCOPE_STYLE: Lazy<Style> = Lazy::new(|| Style::new().bright_magenta());

pub fn init_logger_thread() {
    let (tx, rx): (Sender<LogRecord>, Receiver<LogRecord>) = mpsc::channel();

    if LOG_SENDER.set(tx).is_err() {
        panic!("Logger already initialized");
    }

    let file_path = get_oopsie_home_dir().join("oopsie-logsy.log");
    let mut file = OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .open(file_path)
        .expect("Failed to open log file");

    thread::spawn(move || loop {
        match rx.recv() {
            Ok(record) => {
                let level_style = match record.level {
                    "trace" => *TRACE_STYLE,
                    "info" => *INFO_STYLE,
                    "warn" => *WARN_STYLE,
                    "debug" => *DEBUG_STYLE,
                    "error" => *ERROR_STYLE,
                    "scope" => *SCOPE_STYLE,
                    _ => Style::new(),
                };

                let caller_str = &record.caller;

                let caller_short = caller_str
                    .strip_prefix("oopsie_logsy_lib")
                    .unwrap_or(caller_str);

                let styled_caller = caller_short
                    .split("::")
                    .enumerate()
                    .map(|(i, part)| {
                        if i > 0 {
                            format!("{}{}", "::".style(*GRAY), part.style(level_style))
                        } else {
                            part.style(level_style).to_string()
                        }
                    })
                    .collect::<String>();

                let log_line = format!(
                    "{} {} {} {} {} {}{} {}{}",
                    *SEP,
                    record
                        .timestamp
                        .format("%H:%M:%S:%3f:%6f")
                        .to_string()
                        .blue(),
                    *SEP,
                    format!("{:^5}", record.level).style(level_style),
                    *SEP,
                    styled_caller,
                    ":".bright_black(),
                    record.message.style(level_style),
                    "".default_color()
                );

                println!("{}", log_line);

                let _ = file.write_all(log_line.as_bytes());
                let _ = file.write_all(b"\n");
                let _ = file.flush();
            }
            Err(_) => {
                break;
            }
        }
    });
}

pub fn log<T>(level: &'static str, _caller: &T, args: std::fmt::Arguments) {
    if let Some(sender) = LOG_SENDER.get() {
        let _ = sender.send(LogRecord {
            level,
            caller: std::any::type_name::<T>().to_string(),
            message: format!("{}", args),
            timestamp: chrono::Local::now(),
        });
    }
}

pub fn trace<T>(caller: &T, args: std::fmt::Arguments) {
    log("trace", caller, args)
}

pub fn info<T>(caller: &T, args: std::fmt::Arguments) {
    log("info", caller, args)
}

pub fn warn<T>(caller: &T, args: std::fmt::Arguments) {
    log("warn", caller, args)
}

pub fn debug<T>(caller: &T, args: std::fmt::Arguments) {
    log("debug", caller, args)
}

pub fn error<T>(caller: &T, args: std::fmt::Arguments) {
    log("error", caller, args)
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
