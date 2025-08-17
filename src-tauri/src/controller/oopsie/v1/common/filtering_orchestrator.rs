//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `filtering_orchestrator.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.2
//! **Description**: Orchestrate logs reading and filtering.
//!

use std::{
    collections::VecDeque,
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    thread::{self, JoinHandle},
};

use crate::{
    controller::oopsie::v1::common::disk_io::{
        active_logs_reader::LogMetadata, active_logs_writer::DEFAULT_FILTER_INDEX,
        filter_id_idx_map::FiltersIndexIdMap, log_field_reader::LogFieldReader,
    },
    log_debug,
    state::data::filters::ActiveFilter,
};

pub type Log = Vec<String>;

pub struct LogLine {
    pub index: u64,
    pub data: Log,
}

pub struct FilteringOrchestrator {
    pub reading_done: AtomicBool,

    pub total_logs: usize,
    pub read_chunk_size: usize,
    pub field_readers: Vec<LogFieldReader>,
    pub fields_count: usize,

    pub input_chunks: Mutex<VecDeque<Vec<LogLine>>>,

    pub reading_threads_count: u8,
    pub filtering_threads_count: u8,

    pub active_filters: Vec<ActiveFilter>,
    pub filters_disk_map: FiltersIndexIdMap,
}

impl FilteringOrchestrator {
    pub fn new(
        total_logs: usize,
        read_chunk_size: usize,
        reading_threads_count: u8,
        filtering_threads_count: u8,
        active_filters: Vec<ActiveFilter>,
        filters_disk_map: FiltersIndexIdMap,
        field_readers: Vec<LogFieldReader>,
        fields_count: usize,
    ) -> Self {
        Self {
            reading_done: AtomicBool::new(false),

            input_chunks: Mutex::new(VecDeque::new()),

            reading_threads_count,
            filtering_threads_count,
            active_filters,
            filters_disk_map,
            total_logs,
            read_chunk_size,
            field_readers,
            fields_count,
        }
    }
}

pub fn run(orchestrator: Arc<FilteringOrchestrator>) -> (usize, Vec<LogMetadata>) {
    let reading_handles = start_reading_threads(Arc::clone(&orchestrator));
    let filtering_handles = start_filtering_threads(Arc::clone(&orchestrator));

    let mut total_matched_logs_count: usize = 0;

    for handle in reading_handles {
        handle.join().expect("run: reading thread panicked");
    }

    orchestrator.reading_done.store(true, Ordering::SeqCst);

    let mut filtered_chunks: Vec<Vec<LogMetadata>> =
        Vec::with_capacity(orchestrator.filtering_threads_count as usize);

    for handle in filtering_handles {
        let (matched_logs_count, chunks) = handle.join().expect("run: filtering thread panicked");
        total_matched_logs_count += matched_logs_count;
        filtered_chunks.push(chunks);
    }

    let mut filtered_logs: Vec<LogMetadata> = Vec::with_capacity(total_matched_logs_count);

    for filtered_chunk in filtered_chunks {
        for log_metadata in filtered_chunk {
            filtered_logs.push(log_metadata);
        }
    }

    // TODO: consider par sort
    filtered_logs.sort_by_key(|log| log.index);

    (total_matched_logs_count, filtered_logs)
}

fn start_reading_threads(orchestrator: Arc<FilteringOrchestrator>) -> Vec<JoinHandle<()>> {
    let mut handles = Vec::new();

    let logs_per_thread =
        (orchestrator.total_logs / orchestrator.reading_threads_count as usize) as u64;
    let remainder = (orchestrator.total_logs % orchestrator.reading_threads_count as usize) as u64;

    for thread_index in 0..orchestrator.reading_threads_count as u64 {
        let orchestrator_clone = Arc::clone(&orchestrator);

        let begin = thread_index * logs_per_thread + remainder.min(thread_index);
        let end = begin + logs_per_thread + if thread_index < remainder { 1 } else { 0 };

        let handle = thread::spawn(move || {
            log_debug!(
                &start_reading_threads,
                "Spawned reading thread {:?}",
                thread::current().id()
            );

            let mut field_readers = orchestrator_clone.field_readers.clone();

            let mut chunk: Vec<LogLine> = Vec::with_capacity(orchestrator_clone.read_chunk_size);

            for log_index in begin..end {
                let mut log: Log = Vec::with_capacity(orchestrator_clone.fields_count);

                field_readers.iter_mut().for_each(|field_reader| {
                    log.push(field_reader.read_at(log_index));
                });

                // log_debug!(
                //     &start_reading_threads,
                //     "Thread {:?} processing log {} -> {:?}",
                //     thread::current().id(),
                //     log_index,
                //     log
                // );

                chunk.push(LogLine {
                    index: log_index,
                    data: log,
                });

                // log_debug!(&start_reading_threads, "chunk size: {}", chunk.len());

                if chunk.len() >= orchestrator_clone.read_chunk_size {
                    push_input_chunk(&orchestrator_clone, chunk);
                    chunk = Vec::with_capacity(orchestrator_clone.read_chunk_size);
                }
            }

            if !chunk.is_empty() {
                push_input_chunk(&orchestrator_clone, chunk);
            }
        });

        handles.push(handle);
    }

    handles
}

fn find_matching_filter<'a>(
    target: &Log,
    active_filters: &'a Vec<ActiveFilter>,
) -> Option<&'a ActiveFilter> {
    active_filters.iter().find(|filter| {
        filter.components.iter().all(|component| {
            if component.metadata.is_regex {
                component.metadata.is_equals == component.is_match(&target[component.field_index])
            } else if component.metadata.is_equals {
                component.metadata.data == target[component.field_index]
            } else {
                component.metadata.data != target[component.field_index]
            }
        })
    })
}

fn start_filtering_threads(
    orchestrator: Arc<FilteringOrchestrator>,
) -> Vec<JoinHandle<(usize, Vec<LogMetadata>)>> {
    let mut handles = Vec::new();

    for _ in 0..orchestrator.filtering_threads_count {
        let orchestrator_clone = Arc::clone(&orchestrator);

        let handle = thread::spawn(move || {
            log_debug!(
                &start_filtering_threads,
                "Spawned filtering thread {:?}",
                thread::current().id()
            );

            let mut matched_logs_count: usize = 0;
            let mut out_chunk: Vec<LogMetadata> = Vec::new();

            loop {
                // log_debug!(
                //     &start_filtering_threads,
                //     "Loop {:?}",
                //     thread::current().id()
                // );

                if let Some(chunk) = get_next_input_chunk(&orchestrator_clone) {
                    // log_debug!(
                    //     &start_filtering_threads,
                    //     "Filtering thread {:?} got chunk [{}..{}] to process",
                    //     thread::current().id(),
                    //     chunk.first().unwrap().index,
                    //     chunk.last().unwrap().index
                    // );

                    for log in chunk {
                        if let Some(active_filter) =
                            find_matching_filter(&log.data, &orchestrator_clone.active_filters)
                        {
                            matched_logs_count += 1;
                            out_chunk.push(LogMetadata {
                                index: log.index,
                                filter_id_index: (if let Some(filter_index) = orchestrator_clone
                                    .filters_disk_map
                                    .get_index_of(&active_filter.filter_id)
                                {
                                    *filter_index
                                } else {
                                    DEFAULT_FILTER_INDEX
                                }),
                            });
                        }
                    }
                } else if orchestrator_clone.reading_done.load(Ordering::SeqCst) {
                    log_debug!(
                        &start_filtering_threads,
                        "No more chunks to process, stopping {:?}",
                        thread::current().id()
                    );
                    break;
                } else {
                    // log_debug!(
                    //     &start_filtering_threads,
                    //     "Waiting for new threads, {:?}",
                    //     thread::current().id()
                    // );
                }
            }

            return (matched_logs_count, out_chunk);
        });

        handles.push(handle);
    }

    handles
}

fn push_input_chunk(orchestrator: &Arc<FilteringOrchestrator>, chunk: Vec<LogLine>) {
    // log_debug!(
    //     &push_input_chunk,
    //     "Pushing new chunk: [{}..{}]",
    //     chunk.first().unwrap().index,
    //     chunk.last().unwrap().index
    // );
    let mut input_chunks = orchestrator
        .input_chunks
        .lock()
        .expect("push_input_chunk: input_chunks mutex poisoned");
    input_chunks.push_back(chunk);
}

fn get_next_input_chunk(orchestrator: &Arc<FilteringOrchestrator>) -> Option<Vec<LogLine>> {
    let mut input_chunks = orchestrator
        .input_chunks
        .lock()
        .expect("get_next_input_chunk: input_chunks mutex poisoned");
    input_chunks.pop_front()
}
