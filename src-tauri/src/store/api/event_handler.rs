//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `callback.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: .
//!

pub struct EventHandler<T>
where
    T: ?Sized,
{
    handlers: Vec<Box<T>>,
}

impl<T> EventHandler<T>
where
    T: ?Sized,
{
    pub fn new() -> Self {
        Self {
            handlers: Vec::new(),
        }
    }

    pub fn add_event_listener(&mut self, handler: Box<T>) {
        self.handlers.push(handler);
    }

    pub fn handlers(&mut self) -> &mut Vec<Box<T>> {
        &mut self.handlers
    }
}
