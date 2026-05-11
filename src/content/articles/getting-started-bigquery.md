---
title: "Getting Started with M-Lab Data in BigQuery"
description: How to access M-Lab's public datasets in Google BigQuery, run your first queries, and understand the data structure.
tags: [data-access]
difficulty: beginner
starter: true
---

M-Lab publishes all measurement data to Google BigQuery as a public dataset. You can query it for free (within Google's free tier limits) without an M-Lab account — you only need a Google account.

## Setting Up Access

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and sign in
2. Create or select a Google Cloud project (required to run queries, even against public data)
3. Open BigQuery from the left menu
4. In the Explorer panel, click **"+ ADD"** → **"Star a project by name"**
5. Enter `measurement-lab` and click **Star**

The `measurement-lab` project will now appear in your Explorer panel with all public datasets.

## Key Datasets

| Dataset | Description |
|---------|-------------|
| `ndt` | NDT speed tests (use the `ndt7` view for modern data) |
| `traceroute` | Scamper traceroute paths |
| `msak` | Multi-stream throughput measurements |
| `wehe` | App-specific traffic differentiation tests |
| `sidestream` | Passive measurement data (deprecated) |

For most use cases, start with `measurement-lab.ndt.ndt7`.

## Your First Query

This query returns the average download speed by country for the last 30 days:

```sql
SELECT
  client.Geo.CountryCode                     AS country,
  ROUND(AVG(a.MeanThroughputMbps), 2)       AS avg_download_mbps,
  COUNT(*)                                   AS test_count
FROM `measurement-lab.ndt.ndt7`
WHERE DATE(a.TestTime) >= DATE_SUB(CURRENT_DATE(), INTERVAL 30 DAY)
  AND a.MeanThroughputMbps > 0
  AND a.MeanThroughputMbps < 10000   -- exclude outliers
GROUP BY country
ORDER BY avg_download_mbps DESC
LIMIT 20
```

## Understanding the Schema

NDT7 results have a nested structure. The key top-level fields are:

- **`a`** — measurement results (throughput, latency, loss)
- **`client`** — annotated client information (Geo, Network/ASN)
- **`server`** — M-Lab server that handled the test
- **`raw`** — raw TCP statistics from the kernel

### Commonly Used Fields

```
a.TestTime              — when the test ran (TIMESTAMP)
a.MeanThroughputMbps    — download speed in Mbps
a.MinRTT                — minimum RTT in milliseconds
a.LossRate              — packet loss fraction (0.0–1.0)

client.Geo.CountryCode  — ISO 3166-1 alpha-2 country code
client.Geo.Region       — ISO 3166-2 region/subdivision code
client.Geo.City         — city name (MaxMind, coarse precision)
client.Geo.Latitude     — latitude (city-level precision)
client.Geo.Longitude    — longitude (city-level precision)

client.Network.ASNumber — client's Autonomous System Number
client.Network.ASName   — client's ISP/network name

server.Site             — M-Lab site ID (e.g., "lga01")
server.Metro            — metro area (e.g., "lga" for New York)
```

## Query Costs and Free Tier

BigQuery charges for data scanned. The NDT7 table is large (~5 TB/month of new data). To minimize costs:

- Always filter by `DATE(a.TestTime)` to use partition pruning
- Use the **preview** feature in the BigQuery UI to check data before running queries
- Add `LIMIT` clauses during development
- Google's free tier includes 1 TB of query processing per month

```sql
-- Efficient: uses partition pruning
WHERE DATE(a.TestTime) = '2024-06-01'

-- Inefficient: scans all partitions
WHERE a.TestTime > '2024-06-01'
```

## Unified Views vs. Raw Tables

M-Lab provides both raw tables and cleaned **unified views**:

- `measurement-lab.ndt.ndt7` — recommended for most analysis (filtered for valid tests)
- `measurement-lab.ndt.ndt7_raw` — all rows including invalid/incomplete tests

The unified view applies standard quality filters: tests with zero throughput, abnormally short durations, or known client bugs are excluded. Use the raw table only if you need to understand test failures.

## Exporting Data

For larger analyses, export results to Google Cloud Storage rather than downloading from BigQuery:

```sql
EXPORT DATA
  OPTIONS (
    uri = 'gs://your-bucket/ndt7-export-*.csv',
    format = 'CSV',
    overwrite = true
  )
AS (
  SELECT a.TestTime, a.MeanThroughputMbps, client.Geo.CountryCode
  FROM `measurement-lab.ndt.ndt7`
  WHERE DATE(a.TestTime) = '2024-06-01'
);
```

---

> **TODO for full article:** Add section on using the BigQuery API from Python (google-cloud-bigquery library). Add worked example of ISP comparison query. Add section on M-Lab's long-term schema support policy (stable column names since 2020). Link to the M-Lab data documentation at measurementlab.net/data.
