//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logRegexTags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.9
//! **Description**: LogRegexTags data and ipc transfer commands.
//!

use crate::{common::scope_log::ScopeLog, log_trace};

// <data>
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RegexTag {
    pub id: String,
    pub displayed: bool,
    pub regex: String,
    pub name: String,
}

pub struct RegexTagsManager {
    regex_tags: Vec<RegexTag>,
    regex_line: regex::Regex,
}
// </data>

// <manager>
impl RegexTagsManager {
    pub fn default() -> Self {
        Self {
            regex_tags: Vec::new(),
            regex_line: regex::Regex::new(".*").expect("Failed to generate default regex line"),
        }
    }

    fn compute_line_regex(tags: &Vec<RegexTag>) -> regex::Regex {
        let _log = ScopeLog::new(&RegexTagsManager::compute_line_regex);

        let capacity: usize = tags
            .iter()
            .map(|tag| tag.regex.len() + if tag.displayed { 2 } else { 0 })
            .sum();

        let mut regex_str = String::with_capacity(capacity);

        for tag in tags.iter() {
            if tag.displayed {
                regex_str.push('(');
                regex_str.push_str(&tag.regex);
                regex_str.push(')');
            } else {
                regex_str.push_str(&tag.regex);
            }
        }

        log_trace!(&RegexTagsManager::compute_line_regex, "\"{}\"", regex_str);

        regex::Regex::new(&regex_str).unwrap()
    }

    pub fn set(&mut self, new_tags: Vec<RegexTag>) {
        let _log = ScopeLog::new(&RegexTagsManager::set);

        self.regex_tags = new_tags;

        self.regex_line = RegexTagsManager::compute_line_regex(&self.regex_tags);
    }

    pub fn get_tags(&self) -> &Vec<RegexTag> {
        &self.regex_tags
    }

    pub fn get_line_regex(&self) -> &regex::Regex {
        &self.regex_line
    }

    pub fn compute_active_tags(&self) -> Vec<&RegexTag> {
        self.regex_tags.iter().filter(|tag| tag.displayed).collect()
    }
}
// </manager>
