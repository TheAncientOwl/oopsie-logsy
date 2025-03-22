//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `data.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Defines application data structures.
//!

use crate::log_trace;

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RegexTag {
    pub id: u64,
    pub displayed: bool,
    pub regex: String,
    pub name: String,
}

pub struct OopsieLogsy {
    regex_tags: Vec<RegexTag>,
    current_log_paths: Vec<std::path::PathBuf>,
}

impl OopsieLogsy {
    fn new() -> Self {
        Self {
            regex_tags: Vec::new(),
            current_log_paths: Vec::new(),
        }
    }

    pub fn get_instance_mutex() -> &'static std::sync::Mutex<OopsieLogsy> {
        static INSTANCE: std::sync::OnceLock<std::sync::Mutex<OopsieLogsy>> =
            std::sync::OnceLock::new();
        INSTANCE.get_or_init(|| std::sync::Mutex::new(OopsieLogsy::new()))
    }

    pub fn get_instance() -> Result<std::sync::MutexGuard<'static, OopsieLogsy>, String> {
        OopsieLogsy::get_instance_mutex()
            .lock()
            .map_err(|error| format!("Mutex lock error: {}", error))
    }

    pub fn set_regex_tags(&mut self, new_tags: &Vec<RegexTag>) {
        log_trace!(
            &OopsieLogsy::set_regex_tags,
            "tags: {}",
            serde_json::to_string(new_tags)
                .unwrap_or_else(|_| "Failed to serialize tags".to_string())
        );

        self.regex_tags.clear();
        self.regex_tags.extend(new_tags.iter().cloned());
    }

    pub fn get_regex_tags(&self) -> &Vec<RegexTag> {
        log_trace!(
            &OopsieLogsy::get_regex_tags,
            "{} tags",
            self.regex_tags.len()
        );
        &self.regex_tags
    }

    pub fn set_current_log_path(&mut self, new_path: &Vec<std::path::PathBuf>) {
        log_trace!(
            &OopsieLogsy::set_current_log_path,
            "paths: {}",
            serde_json::to_string(new_path)
                .unwrap_or_else(|_| "Failed to serialize log paths".to_string())
        );

        self.current_log_paths.clear();
        self.current_log_paths.extend(new_path.iter().cloned());
    }

    pub fn get_current_log_paths(&self) -> &Vec<std::path::PathBuf> {
        &self.current_log_paths
    }
}
