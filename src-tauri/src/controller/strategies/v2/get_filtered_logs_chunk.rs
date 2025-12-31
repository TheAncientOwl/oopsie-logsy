//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `get_filtered_logs_chunk.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Read filtered logs chunk.
//!

use polars::prelude::{IdxSize, LazyCsvReader, LazyFileListReader, PlPath};

use crate::{
    common::scope_log::ScopeLog,
    controller::{common::index_range::IndexRange, strategies::v2::OopsieV2Controller},
    log_debug, log_error, log_info,
    state::data::{logs::LogsChunk, AppData},
};

pub fn execute(data: &mut AppData, desired_range: IndexRange) -> Result<LogsChunk, String> {
    let _log = ScopeLog::new(&execute);

    let mut out = LogsChunk::with_capacity(desired_range.size());

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

    let mut desired_frame = {
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

    // Ensure the frame is a single chunk for faster iteration
    let desired_frame_chunk = desired_frame.as_single_chunk();

    // Get the series as string
    let string_columns: Vec<_> = desired_frame_chunk
        .get_columns()
        .iter()
        .map(|s| {
            s.cast(&polars::prelude::DataType::String)
                .expect("Failed to cast to string")
        })
        .collect();

    let mut iters: Vec<_> = string_columns
        .iter()
        .map(|s| s.str().expect("All columns are now strings").into_iter())
        .collect();

    // Iterate over rows
    let height = desired_frame_chunk.height();
    for _ in 0..height {
        let mut row_vec = Vec::with_capacity(iters.len());
        for col_iter in &mut iters {
            let value = col_iter.next().unwrap_or(None).unwrap_or("");
            row_vec.push(value.to_string());
        }
        out.data.push(row_vec);
    }

    // TODO: return total number of logs
    out.total_logs = 404;

    Ok(out)
}
