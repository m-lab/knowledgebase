---
title: "M-Lab Traceroute Data: Network Paths and Routing Analysis"
description: An overview of M-Lab's traceroute datasets — what Scamper measures, how to access the data in BigQuery, and common research applications.
tags: [measurement, data-access]
difficulty: intermediate
---

Every NDT7 test on M-Lab triggers a traceroute from the M-Lab server back to the client. This creates one of the largest longitudinal collections of internet routing data in the world — paired with performance measurements.

## From Paris Traceroute to Scamper

M-Lab ran **Paris traceroute** measurements from 2009 to 2019. Paris traceroute uses carefully chosen probe packets to avoid per-flow load balancing, producing more accurate path representations than classic traceroute.

In 2020, M-Lab migrated to **Scamper**, which supports a richer set of measurement techniques:

| Feature | Paris Traceroute | Scamper |
|---------|-----------------|---------|
| ICMP probes | ✓ | ✓ |
| UDP probes | ✓ | ✓ |
| TCP probes | | ✓ |
| MDA (multi-path) | | ✓ |
| PMTUD | | ✓ |
| Active data export | ✓ | ✓ |

Scamper data is available in BigQuery as `measurement-lab.traceroute.scamper1`.

## What a Traceroute Record Contains

Each traceroute record captures:

- The sequence of **hops** (routers) between the M-Lab server and the client
- The **RTT** at each hop
- The **IP address** of each hop (where ICMP responses are returned)
- The **AS path** — which autonomous systems the traffic traverses
- Probe metadata (type, TTL, timestamp)

Not all hops respond to probes; gaps in the hop sequence are common and don't indicate a problem.

## Accessing Traceroute Data in BigQuery

```sql
SELECT
  -- Basic traceroute metadata
  a.StartTime,
  a.Source.IP   AS server_ip,
  a.Destination AS client_ip,

  -- Extract hops from the nested structure
  hop.Addr      AS hop_ip,
  hop.TTL,
  rtt.RTT       AS hop_rtt_ms

FROM `measurement-lab.traceroute.scamper1`,
  UNNEST(Hop) AS hop,
  UNNEST(hop.Probes) AS probe,
  UNNEST(probe.Replies) AS rtt

WHERE DATE(a.StartTime) = '2024-01-15'
LIMIT 100
```

Traceroute data uses a deeply nested schema — UNNEST the `Hop`, `Probes`, and `Replies` arrays to work with individual hops.

## Joining Traceroutes with NDT7 Tests

Traceroutes are linked to NDT7 tests via a shared UUID. This lets you correlate network path properties with performance metrics:

```sql
WITH ndt AS (
  SELECT
    a.UUID,
    a.MeanThroughputMbps,
    a.MinRTT,
    client.Network.ASNumber AS client_asn
  FROM `measurement-lab.ndt.ndt7`
  WHERE DATE(a.TestTime) = '2024-01-15'
    AND a.MeanThroughputMbps > 0
),
traces AS (
  SELECT
    a.UUID,
    COUNT(DISTINCT hop.Addr) AS hop_count
  FROM `measurement-lab.traceroute.scamper1`,
    UNNEST(Hop) AS hop
  WHERE DATE(a.StartTime) = '2024-01-15'
  GROUP BY a.UUID
)
SELECT
  n.MeanThroughputMbps,
  n.MinRTT,
  t.hop_count,
  n.client_asn
FROM ndt n
JOIN traces t USING (UUID)
LIMIT 100
```

## Research Applications

### AS Path Analysis

Traceroutes enable study of how traffic flows between networks. Common questions:

- Which transit providers appear most frequently between residential ISPs and M-Lab servers?
- How does AS path length correlate with measured latency?
- Has an ISP's peering arrangement changed over time (detected via AS path shifts)?

### Inferring Interconnection Quality

Combining NDT7 performance with traceroute AS paths lets researchers identify where degradation occurs. A test with good RTT but poor throughput where traceroutes show a congested peering link suggests interconnection problems rather than last-mile issues.

### Geographic Routing

Traceroutes sometimes reveal **traffic tromboning** — where traffic between two nearby points routes through a distant hub. This is especially relevant for countries with limited local internet exchange infrastructure.

### Anomaly Detection

Large changes in AS paths to the same destination over time can indicate BGP route changes, which may correlate with censorship events or network incidents.

## Data Volume Considerations

Traceroute data is large. The Scamper dataset is hundreds of terabytes. Strategies for efficient analysis:

- Filter by `DATE(a.StartTime)` to use partition pruning
- Sample by UUID rather than loading all data
- Use approximate aggregate functions (`APPROX_QUANTILES`, `APPROX_COUNT_DISTINCT`)
- Pre-aggregate into smaller derived tables for iterative analysis

---

<!-- TODO: Add section on extracting single traceroutes using the M-Lab traceroute extraction tool (blog post: 2022-extracting-single-traceroute). Add worked example of AS path analysis using the CAIDA AS relationship dataset for enrichment. Add section on known limitations (MPLS tunnels hiding intermediate hops, load balancers causing inconsistent paths). -->
