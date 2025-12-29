//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_filtered_logs_chunk.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Read filtered logs chunk.
//!

use polars::prelude::{IdxSize, LazyCsvReader, LazyFileListReader, PlPath};

use crate::{
    common::scope_log::ScopeLog,
    controller::{common::index_range::IndexRange, strategies::v2::OopsieV2Controller},
    log_debug, log_error, log_info,
    state::data::{logs::ColumnLogsChunk, AppData},
};

pub fn execute(data: &mut AppData, desired_range: IndexRange) -> Result<ColumnLogsChunk, String> {
    let _log = ScopeLog::new(&execute);

    let active_tags = data.regex_tags.compute_active_tags();
    let mut out = ColumnLogsChunk::new_with_field_capacity(active_tags.len(), desired_range.size());

    if data.logs.get_raw_logs_path().is_empty() {
        log_info!(
            &execute,
            "Raw logs path was not set, returning empty log chunk"
        );
        return Ok(out);
    }

    log_debug!(&execute, "Desired range: {:?}", desired_range);

    let csv_path = OopsieV2Controller::get_filtered_database_path(&data.logs);

    let lazy_csv_reader = LazyCsvReader::new(PlPath::new(csv_path.to_str().expect(
        "[OopsieV2Controller] Could not create PlPath from input filtered database file path",
    )))
    .with_has_header(false)
    .finish();

    let lazy_frame = match lazy_csv_reader {
        Ok(frame) => frame,
        Err(err) => {
            log_error!(&execute, "Polars CSV error: {:?}", err);
            return Err(format!("Polars CSV error: {:?}", err));
        }
    };

    let desired_lazy_frame = lazy_frame.slice(
        desired_range.begin() as i64,
        desired_range.size() as IdxSize,
    );

    let desired_frame = {
        // Run the blocking collect in a separate thread
        let lazy = desired_lazy_frame;
        let handle = std::thread::spawn(move || lazy.collect());
        match handle.join() {
            Ok(Ok(frame)) => frame,
            Ok(Err(err)) => {
                log_error!(&execute, "Polars CSV error: {:?}", err);
                return Err(format!("Polars CSV error: {:?}", err));
            }
            Err(_) => {
                log_error!(
                    &execute,
                    "Thread panicked while collecting Polars lazy frame"
                );
                return Err("Thread panicked while collecting Polars lazy frame".to_string());
            }
        }
    };

    if let Ok(columns) = desired_frame.columns(desired_frame.get_column_names()) {
        // filter IDs
        let filter_ids_col = columns[0]
            .cast(&polars::prelude::DataType::String)
            .map_err(|err| format!("Polars CSV cast error: {:?}", err))?;

        let filter_ids_val = match filter_ids_col.str() {
            Ok(data) => data,
            Err(err) => {
                log_error!(&execute, "Polars CSV error: {:?}", err);
                return Err(format!("Polars CSV error: {:?}", err));
            }
        };

        filter_ids_val.into_iter().for_each(|idk| {
            out.filter_ids
                .push(idk.unwrap_or("ERROR-MISSING").to_string());
        });

        // logs
        for col_idx in 1..columns.len() {
            let col = columns[col_idx]
                .cast(&polars::prelude::DataType::String)
                .map_err(|err| format!("Polars CSV cast error: {:?}", err))?;

            let val = match col.str() {
                Ok(data) => data,
                Err(err) => {
                    log_error!(&execute, "Polars CSV error: {:?}", err);
                    return Err(format!("Polars CSV error: {:?}", err));
                }
            };

            val.into_iter().for_each(|idk| {
                out.logs[col_idx - 1].push(idk.unwrap_or("ERROR-MISSING").to_string());
            });
        }
    }

    // TODO: I don't remember what is this at this point, do we still need it? - perhaps
    out.total_logs = 404;

    Ok(out)
}
