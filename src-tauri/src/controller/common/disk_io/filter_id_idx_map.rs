//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_id_idx_map.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Datastructure to manage mapping of FilterID <-> u16 Index.
//!

use std::{collections::HashMap, fs, path::PathBuf};

use crate::{common::scope_log::ScopeLog, store::filters::ActiveFilter};

type IdToIndexMap = HashMap<String, u16>;
type IndexToIdMap = HashMap<u16, String>;

pub struct FiltersIndexIdMap {
    path: std::path::PathBuf,
    id_to_idx: IdToIndexMap,
    index_to_id: IndexToIdMap,
}

impl FiltersIndexIdMap {
    pub fn load(path: PathBuf) -> Self {
        let id_to_idx = if path.exists() {
            match fs::File::open(&path) {
                Ok(file) => {
                    let reader = std::io::BufReader::new(file);
                    match serde_json::from_reader(reader) {
                        Ok(map) => map,
                        Err(err) => {
                            eprintln!(
                                "Failed to deserialize FilterIdIdxMap data from {:?}: {}",
                                path, err
                            );
                            IdToIndexMap::new()
                        }
                    }
                }
                Err(err) => {
                    eprintln!("Failed to open FilterIdIdxMap file {:?}: {}", path, err);
                    IdToIndexMap::new()
                }
            }
        } else {
            IdToIndexMap::new()
        };

        let mut idx_to_id = IndexToIdMap::new();
        for (id, idx) in &id_to_idx {
            idx_to_id.insert(*idx, id.clone());
        }

        FiltersIndexIdMap {
            path,
            id_to_idx,
            index_to_id: idx_to_id,
        }
    }

    pub fn save(&self) {
        match fs::File::create(&self.path) {
            Ok(file) => {
                let writer = std::io::BufWriter::new(file);
                if let Err(err) = serde_json::to_writer_pretty(writer, &self.id_to_idx) {
                    eprintln!(
                        "Failed to write FilterIdIdxMap data to {:?}: {}",
                        self.path, err
                    );
                }
            }
            Err(err) => {
                eprintln!(
                    "Failed to create FilterIdIdxMap file {:?}: {}",
                    self.path, err
                );
            }
        }
    }

    pub fn set(&mut self, id: String, index: u16) {
        self.id_to_idx.insert(id.clone(), index);
        self.index_to_id.insert(index, id);
    }

    pub fn contains_id(&self, id: &str) -> bool {
        self.id_to_idx.contains_key(id)
    }

    pub fn contains_index(&self, index: u16) -> bool {
        self.index_to_id.contains_key(&index)
    }

    pub fn get_id_of(&self, index: u16) -> Option<&String> {
        let _log = ScopeLog::new(&FiltersIndexIdMap::get_id_of);
        self.index_to_id.get(&index)
    }

    pub fn get_index_of(&self, id: &str) -> Option<&u16> {
        let _log = ScopeLog::new(&FiltersIndexIdMap::get_index_of);
        self.id_to_idx.get(id)
    }

    pub fn is_empty(&self) -> bool {
        self.id_to_idx.is_empty()
    }

    pub fn update_with(&mut self, active_filters: &Vec<ActiveFilter>) {
        let _log = ScopeLog::new(&FiltersIndexIdMap::update_with);
        active_filters.iter().for_each(|active_filter| {
            let filter_id = &active_filter.filter.id;
            if !self.contains_id(&filter_id) {
                self.set(filter_id.clone(), self.get_next_free_index());
            }
        });
    }

    fn get_next_free_index(&self) -> u16 {
        let _log = ScopeLog::new(&FiltersIndexIdMap::get_next_free_index);
        for index in 1..u16::MAX {
            if !self.index_to_id.contains_key(&index) {
                return index;
            }
        }
        return 0;
    }
}
