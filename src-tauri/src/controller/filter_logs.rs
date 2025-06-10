//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filter_logs.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Filter logs logics.
//!

use std::{sync::Arc, thread};

use chrono::Utc;

use crate::{
    common::{scope_log::ScopeLog, timer::Timer},
    controller::common::{
        disk_io::{
            active_logs_reader::LogMetadata,
            active_logs_writer::{DEFAULT_FILTER_ID, DEFAULT_FILTER_INDEX},
            config_file::ConfigFile,
            filter_id_idx_map::FiltersIndexIdMap,
        },
        log_chunks_manager::ThreadSafeLogChunkManager,
        logs_config_keys,
    },
    log_debug, log_trace,
    store::{filters::ActiveFilter, paths::filters::get_filter_ids_map_path, store::Store},
};

fn get_filters_disk_map(active_filters: &Vec<ActiveFilter>) -> FiltersIndexIdMap {
    let _log = ScopeLog::new(&get_filters_disk_map);

    let mut filters_disk_map = FiltersIndexIdMap::load(get_filter_ids_map_path());
    if filters_disk_map.is_empty() {
        filters_disk_map.set(DEFAULT_FILTER_ID.to_owned(), DEFAULT_FILTER_INDEX);
    }
    filters_disk_map.update_with(&active_filters);
    filters_disk_map.save();

    filters_disk_map
}

fn find_matching_filter<'a>(
    target: &Vec<String>,
    active_filters: &'a Vec<ActiveFilter>,
) -> Option<&'a ActiveFilter> {
    // let _log = ScopeLog::new(&find_matching_filter);

    active_filters.iter().find(|filter| {
        filter.components.iter().all(|component| {
            component.is_equals == component.is_match(&target[component.field_index])
        })
    })
}

pub fn execute() -> Result<String, String> {
    let _log = ScopeLog::new(&execute);

    let store = Store::get_instance_mut();

    let mut config = ConfigFile::load(store.logs.get_logs_config_path());
    let active_tags = store.regex_tags.compute_active_tags();

    let mut active_filters = store.filters.compute_active_filters(&active_tags);
    if active_filters.len() == 0 {
        return Ok(String::from("No active filters found"));
    }
    log_trace!(&execute, "Active filters: {:?}", active_filters);
    active_filters.sort_by(|a, b| b.priority.cmp(&a.priority));
    log_trace!(&execute, "Sorted active filters: {:?}", active_filters);

    let field_readers = store.logs.open_field_readers(&active_tags);
    let filters_disk_map = get_filters_disk_map(&active_filters);

    const CHUNK_SIZE: u64 = 500;
    let chunks_manager = Arc::new(ThreadSafeLogChunkManager::new(
        config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as u64,
        CHUNK_SIZE,
    ));

    let fields_count = active_tags.len();

    const CHUNKS_COUNT: usize = 10;
    let mut thread_handles = Vec::new();
    for _ in 0..CHUNKS_COUNT {
        log_debug!(&execute, "Preparing thread datastructures");
        let mut timer = Timer::new();
        let thread_chunks_manager = Arc::clone(&chunks_manager);
        let thread_active_filters = active_filters.clone();
        let thread_filters_disk_map = filters_disk_map.clone();
        let mut thread_field_readers = field_readers.clone();
        let mut thread_log_entry_buf: Vec<String> = Vec::with_capacity(fields_count);
        log_debug!(
            &execute,
            "Preparing thread datastructures took {}",
            Timer::format_duration(timer.elapsed_ms())
        );

        let handle = thread::spawn(move || {
            let mut timer = Timer::new();
            log_debug!(&execute, "Spawned thread {:?}", thread::current().id());

            let mut new_active_logs_count: usize = 0;
            let mut out: Vec<LogMetadata> = Vec::new();

            let mut processed_chunks: usize = 0;

            while let Some(chunk) = thread_chunks_manager.get_chunk() {
                processed_chunks += 1;
                // log_debug!(
                //     &execute,
                //     "Thread {:?} processing logs [{}..{})",
                //     thread::current().id(),
                //     chunk.begin(),
                //     chunk.end()
                // );

                for log_index in chunk.begin()..chunk.end() {
                    let mut local = Timer::new();

                    thread_log_entry_buf.clear();
                    thread_field_readers.iter_mut().for_each(|field_reader| {
                        thread_log_entry_buf.push(field_reader.read_at(log_index));
                    });

                    // log_debug!(
                    //     &execute,
                    //     "Thread({:?}) ~ log({}): {:?}",
                    //     thread::current().id(),
                    //     log_index,
                    //     thread_log_entry_buf
                    // );

                    let mut matched = false;

                    if let Some(active_filer) =
                        find_matching_filter(&thread_log_entry_buf, &thread_active_filters)
                    {
                        new_active_logs_count += 1;
                        // log_debug!(
                        //     &execute,
                        //     "FOUND_MATCH Thread({:?}) ~ log({}): {:?}",
                        //     thread::current().id(),
                        //     log_index,
                        //     thread_log_entry_buf
                        // );

                        if let Some(filter_index) =
                            thread_filters_disk_map.get_index_of(&active_filer.filter_id)
                        {
                            matched = true;
                            out.push(LogMetadata {
                                index: log_index,
                                filter_id_index: *filter_index,
                            });
                        } else {
                            out.push(LogMetadata {
                                index: log_index,
                                filter_id_index: DEFAULT_FILTER_INDEX,
                            });
                        }
                    }

                    log_debug!(
                        &execute,
                        "Processing log {} of chunk [{}..{}), matched: {}, took {}",
                        log_index,
                        chunk.begin(),
                        chunk.end(),
                        matched,
                        Timer::format_duration(local.elapsed_ms())
                    );
                }
            }

            let duration = timer.elapsed_ms();

            log_debug!(
                &execute,
                "Thread {:?} finished, processed {} chunks, took {}",
                thread::current().id(),
                processed_chunks,
                Timer::format_duration(duration)
            );

            (out, new_active_logs_count)
        });

        thread_handles.push(handle);
    }

    let mut new_active_logs_count: usize = 0;

    let mut chunks = Vec::with_capacity(CHUNKS_COUNT);
    for handle in thread_handles {
        let value = handle.join().unwrap();

        chunks.push(value.0);
        new_active_logs_count += value.1
    }

    config.set_number(
        logs_config_keys::ACTIVE_LOGS_COUNT,
        new_active_logs_count as u128,
    );
    config.save();

    log_debug!(&execute, "Merging logs");
    let mut timer = Timer::new();
    let mut filtered_logs: Vec<LogMetadata> = Vec::with_capacity(new_active_logs_count);
    chunks.iter().for_each(|chunk| {
        filtered_logs.extend(chunk.iter().cloned());
    });
    log_debug!(
        &execute,
        "Merging logs took {}",
        Timer::format_duration(timer.elapsed_ms())
    );

    log_debug!(&execute, "Filtering merged logs");
    timer.restart();
    filtered_logs.sort_by_key(|log| log.index);
    log_debug!(
        &execute,
        "Filtering merged logs took {}",
        Timer::format_duration(timer.elapsed_ms())
    );

    let mut active_logs_writer = store.logs.open_active_logs_writer();
    filtered_logs.iter().for_each(|log| {
        // log_debug!(&execute, "Writing log index {}", log.index);
        active_logs_writer.write(log.index, log.filter_id_index);
    });
    active_logs_writer.flush();

    // let mut log_entry_buf: Vec<String> = Vec::with_capacity(active_tags.len());
    // for log_index in 0..(config.get_number(logs_config_keys::TOTAL_LOGS_COUNT, 0) as u64) {
    //     log_entry_buf.clear();

    //     field_readers.iter_mut().for_each(|field_reader| {
    //         log_entry_buf.push(field_reader.read_at(log_index));
    //     });

    //     if let Some(active_filter) = find_matching_filter(&log_entry_buf, &active_filters) {
    //         // log_debug!(
    //         //     &execute,
    //         //     "log {} matches filter {}",
    //         //     log_idx,
    //         //     active_filter.filter.id
    //         // );
    //         new_active_logs_count += 1;

    //         if let Some(filter_index) = filters_disk_map.get_index_of(&active_filter.filter_id) {
    //             active_logs_writer.write(log_index as u64, *filter_index);
    //         } else {
    //             active_logs_writer.write(log_index as u64, DEFAULT_FILTER_INDEX);
    //         }
    //     }
    // }

    Ok(Utc::now().format("%Y-%m-%d_%H-%M-%S").to_string())
}
