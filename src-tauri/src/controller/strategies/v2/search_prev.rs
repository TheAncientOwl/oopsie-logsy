//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2026 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `search_prev.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Apply search querry.
//!

use std::fs::File;
use std::io::{BufReader, Read, Seek, SeekFrom};

use crate::log_assert;
use crate::{
    common::scope_log::ScopeLog,
    state::data::{global_search::SearchResult, AppData},
};

pub fn execute(
    data: &mut AppData,
    matches_reader: &mut Option<BufReader<File>>,
) -> Result<SearchResult, String> {
    let _log = ScopeLog::new(&execute);

    let mut out = data.global_search.get_active_data().result.clone();

    if let Some(reader) = matches_reader.as_mut() {
        const ENTRY_SIZE: u64 = 8;

        if out.search_index == 0 {
            // Already at first entry
            out.has_prev = false;
            out.has_next = out.search_total > 1;
            return Ok(out);
        }

        let target_pos = (out.search_index - 1) as u64 * ENTRY_SIZE;

        reader
            .seek(SeekFrom::Start(target_pos))
            .map_err(|e| format!("Failed to seek to previous entry: {}", e))?;

        let mut buf = [0u8; 8];
        reader
            .read_exact(&mut buf)
            .map_err(|e| format!("Failed to read previous record index: {}", e))?;

        let record_index = i64::from_le_bytes(buf);
        out.row_index = record_index;
        out.search_index -= 1;

        out.has_prev = out.search_index > 0;
        out.has_next = true;
    } else {
        log_assert!(
            &execute,
            false,
            "[LogicError] matches_reader is not initialized"
        );
        return Err("matches_reader is not initialized".to_string());
    }

    Ok(out)
}
