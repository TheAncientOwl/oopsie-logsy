//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `apply_filters.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.4
//! **Description**: Set FilterTabs command.
//!

use std::io::{BufRead, Read};

use crate::{
    common::scope_log::ScopeLog,
    log_error, log_trace, log_warn, logics,
    store::{
        filters::{Filter, FilterComponent, FilterTab},
        regex_tags::RegexTag,
        store::Store,
    },
};

fn log_data(tabs: &Vec<FilterTab>, filters: &Vec<Filter>, components: &Vec<FilterComponent>) {
    log_trace!(
        &apply_filters,
        "Received {} tabs: {}",
        tabs.len(),
        serde_json::to_string(&tabs).unwrap_or_else(|_| "Failed to serialize tabs".to_string())
    );

    log_trace!(
        &apply_filters,
        "Received {} filters: {}",
        filters.len(),
        serde_json::to_string(&filters)
            .unwrap_or_else(|_| "Failed to serialize filters".to_string())
    );

    log_trace!(
        &apply_filters,
        "Received {} components: {}",
        components.len(),
        serde_json::to_string(&components)
            .unwrap_or_else(|_| "Failed to serialize components".to_string())
    );
}

#[derive(Debug)]
struct ComputedFilterComponent {
    pub field_index: usize,
    pub regex: regex::Regex,
    pub is_equals: bool,
}

#[derive(Debug)]
struct ActiveFilter<'a> {
    pub filter: &'a Filter,
    pub components: Vec<ComputedFilterComponent>,
}

fn compute_active_filters<'a>(
    tabs: &Vec<FilterTab>,
    filters: &'a Vec<Filter>,
    components: &'a Vec<FilterComponent>,
    active_tags: &Vec<&RegexTag>,
) -> Vec<ActiveFilter<'a>> {
    let mut active_filters: Vec<ActiveFilter> = Vec::new();

    tabs.iter().for_each(|tab| {
        if tab.enabled {
            tab.filter_ids.iter().for_each(|filter_id| {
                let filter = filters.iter().find(|filter| filter.id == *filter_id);
                match filter {
                    Some(filter_val) => {
                        if filter_val.is_active {
                            let mut filter_components: Vec<ComputedFilterComponent> =
                                Vec::with_capacity(filter_val.component_ids.len());
                            filter_val.component_ids.iter().for_each(|component_id| {
                                let component = components
                                    .iter()
                                    .find(|component| component.id == *component_id);
                                match component {
                                    Some(component_val) => {
                                        if let Some(index) = active_tags.iter().position(|tag| {
                                            tag.id == component_val.over_alternative_id
                                        }) {
                                            filter_components.push(ComputedFilterComponent {
                                                field_index: index,
                                                regex: regex::Regex::new(&component_val.data)
                                                    .map_err(|err| {
                                                        log_error!(
                                                            &apply_filters,
                                                            "Failed to cumpute regex from \"{}\": {}",
                                                            component_val.data,
                                                            err
                                                        )
                                                    })
                                                    .unwrap(),
                                                is_equals: component_val.is_equals,
                                            });
                                        } else {
                                            log_warn!(
                                                &apply_filters,
                                                "Missing over alternative with ID {}",
                                                component_val.over_alternative_id
                                            )
                                        }
                                    }
                                    None => {
                                        log_warn!(
                                            &apply_filters,
                                            "Missing filter component with ID {}",
                                            component_id
                                        )
                                    }
                                }
                            });
                            active_filters.push(ActiveFilter {
                                filter: filter_val,
                                components: filter_components,
                            });
                        }
                    }
                    None => {
                        log_warn!(&apply_filters, "Missing filter with ID {}", filter_id)
                    }
                }
            });
        }
    });

    active_filters
}

// TODO: refactor and cleanup this mess
#[tauri::command]
pub fn apply_filters(
    tabs: Vec<FilterTab>,
    filters: Vec<Filter>,
    components: Vec<FilterComponent>,
) -> Result<(Vec<Vec<String>>, Vec<String>, bool), String> {
    let _log = ScopeLog::new(&apply_filters);

    log_data(&tabs, &filters, &components);

    let mut store = Store::get_instance_mut();

    store.filters.set(&tabs, &filters, &components);

    let active_tags: Vec<&RegexTag> = store
        .regex_tags
        .get_tags()
        .iter()
        .filter(|tag| tag.displayed)
        .collect();

    let mut active_filters = compute_active_filters(&tabs, &filters, &components, &active_tags);
    if active_filters.len() == 0 {
        std::mem::drop(store);
        return Ok((logics::read_converted_logs::execute(), Vec::new(), false));
    }

    log_trace!(&apply_filters, "Active filters: {:?}", active_filters);

    active_filters.sort_by(|a, b| b.filter.priority.cmp(&a.filter.priority));

    log_trace!(
        &apply_filters,
        "Sorted active filters: {:?}",
        active_filters
    );

    let mut field_readers: Vec<std::io::BufReader<std::fs::File>> = active_tags
        .iter()
        .map(|tag| {
            let file = store
                .logs
                .open_field_file_in(&tag.name)
                .map_err(|err| {
                    log_error!(
                        &apply_filters,
                        "Error opening output field file {}: {}",
                        tag.name,
                        err
                    );
                })
                .unwrap();
            std::io::BufReader::new(file)
        })
        .collect();

    let config_file = store
        .logs
        .open_current_processed_logs_config_file_in()
        .map_err(|err| log_error!(&apply_filters, "Error while opening config file: {}", err))
        .unwrap();
    let mut config_reader = std::io::BufReader::new(config_file);
    let mut buf = [0u8; 8];
    config_reader
        .read_exact(&mut buf)
        .expect("Failed to read from config file");
    let logs_count = u64::from_le_bytes(buf);

    let mut out_filtered_logs: Vec<Vec<String>> = Vec::with_capacity(active_tags.len());
    active_tags.iter().for_each(|_| {
        out_filtered_logs.push(Vec::new());
    });
    let mut out_filters: Vec<String> = Vec::new();

    let mut buf = String::with_capacity(512);
    for _ in 0..logs_count {
        let mut log_entry: Vec<String> = Vec::with_capacity(active_tags.len());

        field_readers.iter_mut().for_each(|field_reader| {
            buf.clear();
            field_reader
                .read_line(&mut buf)
                .expect("Failed to read field");
            buf.pop();

            log_entry.push(buf.to_owned());
        });

        if let Some(filter) = active_filters.iter().find(|filter| {
            filter.components.iter().all(|component| {
                component.is_equals == component.regex.is_match(&log_entry[component.field_index])
            })
        }) {
            for field_idx in 0..log_entry.len() {
                out_filtered_logs[field_idx].push(log_entry[field_idx].to_owned());
            }
            out_filters.push(filter.filter.id.clone());
        }
    }

    Ok((out_filtered_logs, out_filters, true))
}
