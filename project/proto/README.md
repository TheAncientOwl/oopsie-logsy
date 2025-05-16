# 🚀 JSON Parsing Benchmark Suite (Rust)

This repository benchmarks JSON parsing libraries for OopsieLogsy backend strategies.
The goal is to determine the most efficient approach for each task:

- parsing log files (plain text for now) to json
- loading parsed objects in order to be displayed
- applying filters over parsed objects

## 📦 Libraries Compared

The following Rust libraries for JSON parsing were benchmarked:

- [Serde JSON](https://crates.io/crates/serde_json)
- [json-rust](https://crates.io/crates/json)

> ✅ Benchmarks are grouped by **oopsie logsy use cases**.

---

## 📚 Benchmark Cases

### 1. Write json objects to disk

- Serialize objects like {timestamp, level, channel, payload} into a compact JSON line (e.g., for NDJSON storage)

### 2. Load Parsed JSON objects (in order to be displayed)

- Read JSON line-by-line (multiple runs for 25%, 50%, 75%, 100% entries)
- Deserialize to display in a UI table

### 3. Filter Logs by Properties

- Access only a few fields (e.g., `level`, `payload`) and apply a couple regexes on them
- Avoid full deserialization if possible

---

## ⏱️ Benchmark Results

### 1,2. JSON IO

#### @Note

- OS: macOS 15.4.1 24E263 arm64
- CPU/GPU: Apple M4
- RAM: 16GB
- SSD: 512GB
- run with: `cargo build --release && cargo run --release`

```
target -> 9000000 logs ~ 1.2GB

-----------------------[ SerdeJSON::write1 ~ text ] -----------------------
[+] SerdeJSON::write1 ~ text: Start 1 run
[-] SerdeJSON::write1 ~ text: Elapsed time once: 8s 60ms
[+] SerdeJSON::write1 ~ text: Start 10 runs
[=] SerdeJSON::write1 ~ text: Average duration over 10 runs: 8s 206ms

-----------------------[ SerdeJSON::read1 ~ text ] -----------------------
[+] SerdeJSON::read1 ~ text: Start 1 run
[-] SerdeJSON::read1 ~ text: Elapsed time once: 6s 922ms
[+] SerdeJSON::read1 ~ text: Start 10 runs
[=] SerdeJSON::read1 ~ text: Average duration over 10 runs: 6s 739ms

-----------------------[ SerdeJSON::write2 ~ text ] -----------------------
[+] SerdeJSON::write2 ~ text: Start 1 run
[-] SerdeJSON::write2 ~ text: Elapsed time once: 7s 415ms
[+] SerdeJSON::write2 ~ text: Start 10 runs
[=] SerdeJSON::write2 ~ text: Average duration over 10 runs: 7s 407ms

-----------------------[ SerdeJSON::read2 ~ text ] -----------------------
[+] SerdeJSON::read2 ~ text: Start 1 run
[-] SerdeJSON::read2 ~ text: Elapsed time once: 6s 813ms
[+] SerdeJSON::read2 ~ text: Start 10 runs
[=] SerdeJSON::read2 ~ text: Average duration over 10 runs: 6s 767ms

-----------------------[ SerdeJSON::write3 ~ bson ] -----------------------
[+] SerdeJSON::write3 ~ bson: Start 1 run
[-] SerdeJSON::write3 ~ bson: Elapsed time once: 9s 162ms
[+] SerdeJSON::write3 ~ bson: Start 10 runs
[=] SerdeJSON::write3 ~ bson: Average duration over 10 runs: 9s 262ms

-----------------------[ SerdeJSON::read3 ~ bson ] -----------------------
[+] SerdeJSON::read3 ~ bson: Start 1 run
[-] SerdeJSON::read3 ~ bson: Elapsed time once: 8s 371ms
[+] SerdeJSON::read3 ~ bson: Start 10 runs
[=] SerdeJSON::read3 ~ bson: Average duration over 10 runs: 8s 317ms

-----------------------[ JSON-Rust::run1 ~ text ] -----------------------
[+] JSON-Rust::run1 ~ text: Start 1 run
[-] JSON-Rust::run1 ~ text: Elapsed time once: 5s 306ms
[+] JSON-Rust::run1 ~ text: Start 10 runs
‘[=] JSON-Rust::run1 ~ text: Average duration over 10 runs: 5s 331ms

-----------------------[ JSON-Rust::run2 ~ binary ] -----------------------
[+] JSON-Rust::run2 ~ binary: Start 1 run
[-] JSON-Rust::run2 ~ binary: Elapsed time once: 3s 270ms
[+] JSON-Rust::run2 ~ binary: Start 10 runs
[=] JSON-Rust::run2 ~ binary: Average duration over 10 runs: 3s 301ms

-----------------------[ Custom::write1 ~ handmade JSON ] -----------------------
[+] Custom::write1 ~ handmade JSON: Start 1 run
[-] Custom::write1 ~ handmade JSON: Elapsed time once: 3s 722ms
[+] Custom::write1 ~ handmade JSON: Start 10 runs
[=] Custom::write1 ~ handmade JSON: Average duration over 10 runs: 3s 683ms

-----------------------[ Custom::write2 ~ binary ] -----------------------
[+] Custom::write2 ~ binary: Start 1 run
[-] Custom::write2 ~ binary: Elapsed time once: 3s 301ms
[+] Custom::write2 ~ binary: Start 10 runs
[=] Custom::write2 ~ binary: Average duration over 10 runs: 3s 420ms

-----------------------[ Custom::write3 ~ custom binary ] -----------------------
[+] Custom::write3 ~ custom binary: Start 1 run
[-] Custom::write3 ~ custom binary: Elapsed time once: 3s 414ms
[+] Custom::write3 ~ custom binary: Start 10 runs
[=] Custom::write3 ~ custom binary: Average duration over 10 runs: 3s 323ms

-----------------------[ Custom::read3 ~ custom binary ] -----------------------
[+] Custom::read3 ~ custom binary: Start 1 run
[-] Custom::read3 ~ custom binary: Elapsed time once: 2s 634ms
[+] Custom::read3 ~ custom binary: Start 10 runs
[=] Custom::read3 ~ custom binary: Average duration over 10 runs: 2s 633ms
```

```
target -> 30000000 logs ~ 4.2GB

-----------------------[ SerdeJSON::write1 ~ text ] -----------------------
[+] SerdeJSON::write1 ~ text: Start 1 run
[-] SerdeJSON::write1 ~ text: Elapsed time once: 27s 397ms
[+] SerdeJSON::write1 ~ text: Start 10 runs
[=] SerdeJSON::write1 ~ text: Average duration over 10 runs: 27s 365ms

-----------------------[ SerdeJSON::read1 ~ text ] -----------------------
[+] SerdeJSON::read1 ~ text: Start 1 run
[-] SerdeJSON::read1 ~ text: Elapsed time once: 22s 563ms
[+] SerdeJSON::read1 ~ text: Start 10 runs
[=] SerdeJSON::read1 ~ text: Average duration over 10 runs: 22s 517ms

-----------------------[ SerdeJSON::write2 ~ text ] -----------------------
[+] SerdeJSON::write2 ~ text: Start 1 run
[-] SerdeJSON::write2 ~ text: Elapsed time once: 24s 812ms
[+] SerdeJSON::write2 ~ text: Start 10 runs
[=] SerdeJSON::write2 ~ text: Average duration over 10 runs: 24s 659ms

-----------------------[ SerdeJSON::read2 ~ text ] -----------------------
[+] SerdeJSON::read2 ~ text: Start 1 run
[-] SerdeJSON::read2 ~ text: Elapsed time once: 22s 571ms
[+] SerdeJSON::read2 ~ text: Start 10 runs
[=] SerdeJSON::read2 ~ text: Average duration over 10 runs: 22s 504ms

-----------------------[ SerdeJSON::write3 ~ bson ] -----------------------
[+] SerdeJSON::write3 ~ bson: Start 1 run
[-] SerdeJSON::write3 ~ bson: Elapsed time once: 29s 900ms
[+] SerdeJSON::write3 ~ bson: Start 10 runs
[=] SerdeJSON::write3 ~ bson: Average duration over 10 runs: 29s 819ms

-----------------------[ SerdeJSON::read3 ~ bson ] -----------------------
[+] SerdeJSON::read3 ~ bson: Start 1 run
[-] SerdeJSON::read3 ~ bson: Elapsed time once: 27s 699ms
[+] SerdeJSON::read3 ~ bson: Start 10 runs
[=] SerdeJSON::read3 ~ bson: Average duration over 10 runs: 27s 693ms

-----------------------[ JSON-Rust::run1 ~ text ] -----------------------
[+] JSON-Rust::run1 ~ text: Start 1 run
[-] JSON-Rust::run1 ~ text: Elapsed time once: 17s 672ms
[+] JSON-Rust::run1 ~ text: Start 10 runs
[=] JSON-Rust::run1 ~ text: Average duration over 10 runs: 17s 519ms

-----------------------[ JSON-Rust::run2 ~ binary ] -----------------------
[+] JSON-Rust::run2 ~ binary: Start 1 run
[-] JSON-Rust::run2 ~ binary: Elapsed time once: 10s 754ms
[+] JSON-Rust::run2 ~ binary: Start 10 runs
[=] JSON-Rust::run2 ~ binary: Average duration over 10 runs: 11s 54ms

-----------------------[ Custom::write1 ~ handmade JSON ] -----------------------
[+] Custom::write1 ~ handmade JSON: Start 1 run
[-] Custom::write1 ~ handmade JSON: Elapsed time once: 12s 967ms
[+] Custom::write1 ~ handmade JSON: Start 10 runs
[=] Custom::write1 ~ handmade JSON: Average duration over 10 runs: 12s 785ms

-----------------------[ Custom::write2 ~ binary ] -----------------------
[+] Custom::write2 ~ binary: Start 1 run
[-] Custom::write2 ~ binary: Elapsed time once: 11s 465ms
[+] Custom::write2 ~ binary: Start 10 runs
[=] Custom::write2 ~ binary: Average duration over 10 runs: 11s 503ms

-----------------------[ Custom::write3 ~ custom binary ] -----------------------
[+] Custom::write3 ~ custom binary: Start 1 run
[-] Custom::write3 ~ custom binary: Elapsed time once: 11s 438ms
[+] Custom::write3 ~ custom binary: Start 10 runs
[=] Custom::write3 ~ custom binary: Average duration over 10 runs: 11s 406ms

-----------------------[ Custom::read3 ~ custom binary ] -----------------------
[+] Custom::read3 ~ custom binary: Start 1 run
[-] Custom::read3 ~ custom binary: Elapsed time once: 8s 904ms
[+] Custom::read3 ~ custom binary: Start 10 runs
[=] Custom::read3 ~ custom binary: Average duration over 10 runs: 8s 909ms
```
