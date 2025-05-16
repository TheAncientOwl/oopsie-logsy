//! ---------------------------------------------------------------------------------
//!                          Copyright (c) 2025 OopsieLogsy
//! ---------------------------------------------------------------------------------
//!
//! Licensed under: <https://github.com/TheAncientOwl/oopsie-logsy/blob/main/LICENSE>
//!
//! # `match.rs`
//!
//! **Author**: Alexandru Delegeanu
//! **Version**: 0.1
//! **Description**: Regex matching prototypes.
//!

use regex::Regex;
use std::fs::remove_file;
use std::{fs::File, io::BufReader};

use std::io::Read;

use crate::common::benchmark::{benchmark, create_file};
use crate::common::timer::time_function_ms;
use crate::json_io;
use crate::model::log_entry::LogEntryIterator;

const PATTERNS: [&str; 35] = [
    r"foo\d+",
    r"bar[a-z]+",
    r"^\d{3}-\d{2}-\d{4}$",
    r"\bhello\b",
    r"world!",
    r"test\d{1,3}",
    r"abc.*xyz",
    r"[A-Z]{5,}",
    r"^\w+@\w+\.\w{2,3}$",
    r"\d{2}/\d{2}/\d{4}",
    r"cat|dog",
    r"^\d+$",
    r"hello|world",
    r"\bfoo\b",
    r"bar\b",
    r"\d{4}-\d{2}-\d{2}",
    r"(?i)caseInsensitive",
    r"start.*end",
    r"(\w+)-(\d+)",
    r"^[a-z]+$",
    r"\bnumber\b",
    r"\bstring\b",
    r"hello\s+world",
    r"\w{8,}",
    r"^\s*$",
    r"[aeiou]{2,}",
    r"\d{1,2}:\d{2}",
    r"\b[A-Z]+\b",
    r"^\S+@\S+\.\S+$",
    r"\btest\b",
    r"\bregex\b",
    r"\bexample\d{1,2}\b",
    r"foo|bar|baz",
    r"^\d{5}$",
    r"end$",
];

fn vanilla_regex_brute_force_from_utf8_lossy(binary_input_file: &mut File) -> std::io::Result<()> {
    let regexes: Vec<Regex> = PATTERNS.iter().map(|p| Regex::new(p).unwrap()).collect();

    let matches = |s: &str| -> bool {
        for re in &regexes {
            if re.is_match(s) {
                return true;
            }
        }
        false
    };

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut tags_map = std::collections::HashMap::<String, usize>::new();
    tags_map.insert(tags[0].to_string(), 0);
    tags_map.insert(tags[1].to_string(), 1);
    tags_map.insert(tags[2].to_string(), 2);
    tags_map.insert(tags[3].to_string(), 3);

    let mut reader = BufReader::new(binary_input_file);

    let mut index: usize = 0;

    loop {
        let mut len_bytes = [0u8; 4];
        // Try to read length prefix
        match reader.read_exact(&mut len_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }
        let len = u32::from_le_bytes(len_bytes) as usize;

        // Read the string bytes
        let mut buffer = vec![0u8; len];
        reader.read_exact(&mut buffer)?;

        // Convert bytes to String (lossy)
        let value = String::from_utf8_lossy(&buffer).to_string();

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = matches(&value);
    }

    Ok(())
}

fn vanilla_regex_brute_force_from_utf8(binary_input_file: &mut File) -> std::io::Result<()> {
    let regexes: Vec<Regex> = PATTERNS.iter().map(|p| Regex::new(p).unwrap()).collect();

    let matches = |s: &str| -> bool {
        for re in &regexes {
            if re.is_match(s) {
                return true;
            }
        }
        false
    };

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut tags_map = std::collections::HashMap::<String, usize>::new();
    tags_map.insert(tags[0].to_string(), 0);
    tags_map.insert(tags[1].to_string(), 1);
    tags_map.insert(tags[2].to_string(), 2);
    tags_map.insert(tags[3].to_string(), 3);

    let mut reader = BufReader::new(binary_input_file);

    let mut index: usize = 0;

    loop {
        let mut len_bytes = [0u8; 4];
        // Try to read length prefix
        match reader.read_exact(&mut len_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }
        let len = u32::from_le_bytes(len_bytes) as usize;

        // Read the string bytes
        let mut buffer = vec![0u8; len];
        reader.read_exact(&mut buffer)?;

        // Convert bytes to String (lossy)
        let value = String::from_utf8(buffer).unwrap_or_else(|_| "".to_string());

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = matches(&value);
    }

    Ok(())
}

use regex::RegexSet;
fn vanilla_regex_set_from_utf8_lossy(binary_input_file: &mut File) -> std::io::Result<()> {
    let set = RegexSet::new(PATTERNS).unwrap();

    let matches = |s: &str| -> bool { set.is_match(s) };

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut tags_map = std::collections::HashMap::<String, usize>::new();
    tags_map.insert(tags[0].to_string(), 0);
    tags_map.insert(tags[1].to_string(), 1);
    tags_map.insert(tags[2].to_string(), 2);
    tags_map.insert(tags[3].to_string(), 3);

    let mut reader = BufReader::new(binary_input_file);

    let mut index: usize = 0;

    loop {
        let mut len_bytes = [0u8; 4];
        // Try to read length prefix
        match reader.read_exact(&mut len_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }
        let len = u32::from_le_bytes(len_bytes) as usize;

        // Read the string bytes
        let mut buffer = vec![0u8; len];
        reader.read_exact(&mut buffer)?;

        // Convert bytes to String (lossy)
        let value = String::from_utf8_lossy(&buffer).to_string();

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = matches(&value);
    }

    Ok(())
}

fn vanilla_regex_set_from_utf8(binary_input_file: &mut File) -> std::io::Result<()> {
    let set = RegexSet::new(PATTERNS).unwrap();

    let matches = |s: &str| -> bool { set.is_match(s) };

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut tags_map = std::collections::HashMap::<String, usize>::new();
    tags_map.insert(tags[0].to_string(), 0);
    tags_map.insert(tags[1].to_string(), 1);
    tags_map.insert(tags[2].to_string(), 2);
    tags_map.insert(tags[3].to_string(), 3);

    let mut reader = BufReader::new(binary_input_file);

    let mut index: usize = 0;

    loop {
        let mut len_bytes = [0u8; 4];
        // Try to read length prefix
        match reader.read_exact(&mut len_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }
        let len = u32::from_le_bytes(len_bytes) as usize;

        // Read the string bytes
        let mut buffer = vec![0u8; len];
        reader.read_exact(&mut buffer)?;

        // Convert bytes to String
        let value = String::from_utf8(buffer).unwrap_or_else(|_| "".to_string());

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = matches(&value);
    }

    Ok(())
}

fn vanilla_regex_set_str(binary_input_file: &mut File) -> std::io::Result<()> {
    let set = RegexSet::new(PATTERNS).unwrap();

    let matches = |s: &str| -> bool { set.is_match(s) };

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut tags_map = std::collections::HashMap::<String, usize>::new();
    tags_map.insert(tags[0].to_string(), 0);
    tags_map.insert(tags[1].to_string(), 1);
    tags_map.insert(tags[2].to_string(), 2);
    tags_map.insert(tags[3].to_string(), 3);

    let mut reader = BufReader::new(binary_input_file);

    let mut index: usize = 0;

    loop {
        let mut len_bytes = [0u8; 4];
        // Try to read length prefix
        match reader.read_exact(&mut len_bytes) {
            Ok(_) => {}
            Err(e) if e.kind() == std::io::ErrorKind::UnexpectedEof => break, // EOF reached cleanly
            Err(e) => return Err(e),
        }
        let len = u32::from_le_bytes(len_bytes) as usize;

        // Read the string bytes
        let mut buffer = vec![0u8; len];
        reader.read_exact(&mut buffer)?;

        // Convert bytes to String
        let value = std::str::from_utf8(&buffer).unwrap();

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = matches(&value);
    }

    Ok(())
}

use memmap2::MmapOptions;

fn regex_set_from_mmap_utf8_lossy(binary_input_file: &File) -> std::io::Result<()> {
    let set = RegexSet::new(PATTERNS).unwrap();

    let mmap = unsafe { MmapOptions::new().map(binary_input_file)? };
    let mut offset = 0;
    let len = mmap.len();

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut index = 0;

    while offset + 4 <= len {
        // Read length prefix
        let len_bytes = &mmap[offset..offset + 4];
        let entry_len = u32::from_le_bytes(len_bytes.try_into().unwrap()) as usize;
        offset += 4;

        // Ensure the full entry fits
        if offset + entry_len > len {
            break; // Corrupt or incomplete data at end
        }

        let entry_bytes = &mmap[offset..offset + entry_len];
        offset += entry_len;

        let value = String::from_utf8_lossy(entry_bytes).to_string();

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = set.is_match(&value);
    }

    Ok(())
}

fn regex_set_from_mmap_utf8(binary_input_file: &File) -> std::io::Result<()> {
    let set = RegexSet::new(PATTERNS).unwrap();

    let mmap = unsafe { MmapOptions::new().map(binary_input_file)? };
    let mut offset = 0;
    let len = mmap.len();

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut index = 0;

    while offset + 4 <= len {
        // Read length prefix
        let len_bytes = &mmap[offset..offset + 4];
        let entry_len = u32::from_le_bytes(len_bytes.try_into().unwrap()) as usize;
        offset += 4;

        // Ensure the full entry fits
        if offset + entry_len > len {
            break; // Corrupt or incomplete data at end
        }

        let entry_bytes = &mmap[offset..offset + entry_len];
        offset += entry_len;

        let value = String::from_utf8(entry_bytes.to_vec()).unwrap_or_else(|_| "".to_string());

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = set.is_match(&value);
    }

    Ok(())
}

fn regex_set_from_mmap_utf8_str_from(binary_input_file: &File) -> std::io::Result<()> {
    let set = RegexSet::new(PATTERNS).unwrap();

    let mmap = unsafe { MmapOptions::new().map(binary_input_file)? };
    let mut offset = 0;
    let len = mmap.len();

    let tags = vec!["timestamp", "level", "channel", "payload"];
    let mut index = 0;

    while offset + 4 <= len {
        // Read length prefix
        let len_bytes = &mmap[offset..offset + 4];
        let entry_len = u32::from_le_bytes(len_bytes.try_into().unwrap()) as usize;
        offset += 4;

        // Ensure the full entry fits
        if offset + entry_len > len {
            break; // Corrupt or incomplete data at end
        }

        let entry_bytes = &mmap[offset..offset + entry_len];
        offset += entry_len;

        let value = std::str::from_utf8(entry_bytes).unwrap();

        // println!("{}: {}", tags[index], value);
        index = (index + 1) % 4;

        let _ = set.is_match(&value);
    }

    Ok(())
}

const LOGS_FILE: &str = "logs.oopsie";

pub fn run_benchmark(logs_iterator: &mut LogEntryIterator) {
    let mut setup = || {
        logs_iterator.reset();
        let mut file = create_file(LOGS_FILE);
        let _ = json_io::custom::write3(logs_iterator.skip_io_errors(), &mut file);
    };

    let cleanup = || {
        let _ = remove_file(LOGS_FILE);
    };

    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = vanilla_regex_brute_force_from_utf8_lossy(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ brute force ~ lossy", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = vanilla_regex_brute_force_from_utf8(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ brute force", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = vanilla_regex_set_from_utf8_lossy(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ RegexSet ~ lossy", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = vanilla_regex_set_str(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ RegexSet ~ str", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = regex_set_from_mmap_utf8_lossy(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ RegexSet ~ lossy ~ mmap", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = regex_set_from_mmap_utf8_str_from(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ RegexSet ~ mmap ~ str", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = vanilla_regex_set_from_utf8(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ RegexSet", &mut exec);
        cleanup();
    }
    {
        setup();
        let mut exec = || -> f64 {
            let mut file = File::open(LOGS_FILE).unwrap();

            let elapsed = time_function_ms(|| {
                let _ = regex_set_from_mmap_utf8(&mut file);
                Ok(())
            });

            elapsed
        };
        benchmark("Vanilla::Regex ~ RegexSet ~ mmap", &mut exec);
        cleanup();
    }
}
