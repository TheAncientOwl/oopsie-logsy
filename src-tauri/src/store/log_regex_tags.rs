//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `logRegexTags.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: LogRegexTags data.
//!

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RegexTag {
    pub id: String,
    pub displayed: bool,
    pub regex: String,
    pub name: String,
}

pub struct RegexTagsManager {
    regex_tags: Vec<RegexTag>,
}

impl RegexTagsManager {
    pub fn new() -> Self {
        Self {
            regex_tags: Vec::new(),
        }
    }

    pub fn set(&mut self, new_tags: &Vec<RegexTag>) {
        self.regex_tags.clear();
        self.regex_tags.extend(new_tags.iter().cloned());
    }

    pub fn get(&self) -> &Vec<RegexTag> {
        &self.regex_tags
    }
}
