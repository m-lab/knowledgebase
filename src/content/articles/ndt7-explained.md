---
title: "How M-Lab Measures Internet Speed: NDT7 and MSAK"
description: A technical overview of NDT7 and MSAK — what they measure, how the tests work, and how to interpret the results.
tags: [measurement]
difficulty: intermediate
---

M-Lab's primary measurement tool is **NDT7** (Network Diagnostic Tool, version 7). Understanding what NDT7 actually measures — and what it doesn't — is essential for working with M-Lab data.

## What NDT7 Measures

NDT7 runs a series of bulk transfer tests between your device and an M-Lab server, capturing:

| Metric | Description |
|--------|-------------|
| Download throughput | Maximum bits per second when receiving data |
| Upload throughput | Maximum bits per second when sending data |
| Minimum RTT | Best-case round-trip time, a proxy for network latency |
| Packet retransmissions | Indicator of congestion or packet loss |
| TCP state | BBR or CUBIC congestion control parameters |

NDT7 uses a **WebSocket connection** over port 443 and runs for approximately 10 seconds in each direction. The test is designed to saturate a single TCP connection, measuring the performance achievable by a single bulk transfer.

## How the Test Works

1. Your client connects to the nearest M-Lab server (selected by the [Locate API](https://locate.measurementlab.net))
2. The server streams data to your client (download) for ~10 seconds
3. Your client streams data to the server (upload) for ~10 seconds
4. TCP kernel statistics are sampled throughout via the `tcp_info` socket API
5. Results are uploaded to M-Lab's data pipeline and archived within ~24 hours

The Locate API uses anycast routing and latency measurements to select the optimal server. You can query it directly:

```bash
curl "https://locate.measurementlab.net/v2/nearest/ndt/ndt7"
```

## MSAK: Multi-Stream Measurements

**MSAK** (Multi-Stream Aggregated Key-ments) was introduced in 2023 to complement NDT7. While NDT7 uses a single TCP stream, MSAK tests with multiple simultaneous streams, which can better saturate high-bandwidth connections.

Key differences:

| | NDT7 | MSAK |
|-|------|------|
| Streams | 1 | 4–16 (configurable) |
| Duration | ~10s | ~5s |
| Protocol | WebSocket/TCP | WebSocket/TCP |
| Best for | Single-stream benchmarks | High-capacity links |

## Interpreting Results

**What NDT7 is good for:**
- Detecting congestion on a single-stream TCP connection
- Longitudinal trending over time at the same location
- Detecting throttling of bulk transfers by ISPs (via Wehe comparison)
- Research requiring consistent, reproducible single-stream measurements

**Known limitations:**
- A single TCP stream may not saturate very fast links (>500 Mbps); use MSAK for these
- Results reflect conditions at the moment of testing — network conditions vary
- The measurement is from the client to an M-Lab server, not to an arbitrary endpoint
- Speed test results differ between providers due to server proximity, protocol, and stream count

## Key Fields in BigQuery

When querying NDT7 data in BigQuery, these are the most important fields:

```sql
SELECT
  a.TestTime,
  a.MeanThroughputMbps,          -- download speed
  a.MinRTT,                       -- minimum round-trip time (ms)
  a.LossRate,                     -- packet loss fraction
  client.Geo.CountryCode,
  client.Network.ASNumber,
  client.Network.ASName
FROM `measurement-lab.ndt.ndt7`
WHERE DATE(a.TestTime) = '2024-01-01'
  AND a.MeanThroughputMbps > 0
LIMIT 100
```

## Access Tokens (Why You May See Them)

Since 2021, M-Lab has used **access tokens** for NDT7 tests run through the Locate API. These tokens bind measurements to the test session and help prevent abuse. If you're running a custom NDT7 client, you must pass the token returned by the Locate API to the test server. Tokens are logged in the raw data, enabling audit of measurement provenance.

---

<!-- TODO: Add diagram showing NDT7 test flow (client → Locate API → server selection → measurement → pipeline). Add section on how to run your own NDT7 test from the command line using the reference client. Link to the ndt7-client-go repository. -->
