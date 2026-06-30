# M-Lab Domain Knowledge Reference

## What is M-Lab?

Measurement Lab (M-Lab) is the world's largest open internet measurement platform, operating since 2009. It runs standardized tests from measurement points hosted at internet exchange facilities worldwide and publishes all data as open data under Creative Commons licensing.

M-Lab is a non-profit supported by Google, OTI (Open Technology Institute), and academic partners. Website: [measurementlab.net](https://measurementlab.net).

**Key mission:** provide open, reproducible internet measurement data for researchers, policymakers, advocates, and network operators.

---

## Tests and Datasets

### NDT (Network Diagnostic Tool)
- **Slug:** `test-ndt.md`
- Single TCP stream throughput (download + upload), latency (MinRTT), packet loss
- Running since M-Lab's founding (2009); current protocol is NDT7 (Feb 2020+)
- NDT7 uses WebSocket over ports 80/443; NDT5 is legacy on non-standard ports
- Web UI: [speed.measurementlab.net](https://speed.measurementlab.net)
- BigQuery: `measurement-lab.ndt.ndt7_union` (recommended), `.ndt7`, `.ndt7_dynamic`, `.ndt5`
- Unified views: `unified_downloads`, `unified_uploads` (quality-filtered)
- GCS: `gs://archive-measurement-lab/ndt/`

### MSAK (Measurement Swiss-Army Knife)
- **Slug:** `test-msak.md`
- Configurable multi-stream throughput + UDP latency
- Useful for high-bandwidth connections where NDT's single stream doesn't saturate the link
- BigQuery: `measurement-lab.msak` / `measurement-lab.msak_raw`

### Wehe (Traffic Differentiation Detection)
- **Slug:** `test-wehe.md`
- Detects app-specific throttling using traffic replays + Kolmogorov-Smirnov statistical test
- BigQuery: `measurement-lab.wehe_raw`

### Neubot DASH (Adaptive Video Streaming)
- **Slug:** `test-neubot-dash.md`
- Emulates adaptive bitrate video streaming (like YouTube/Netflix buffering behavior)
- Measures network quality from a video player's perspective

### Reverse Traceroute
- **Slug:** `test-reverse-traceroute.md`
- Reconstructs the return path (M-Lab server → client), the direction standard traceroute can't see
- Run for ~25% of NDT tests

### Core Services (automatic for every test)

**Traceroute (Scamper)** (`core-service-traceroute.md`):
- Forward path from M-Lab server to client for every connection
- One of the world's largest longitudinal routing datasets
- BigQuery: `measurement-lab.ndt_raw` (joined with NDT)

**TCP INFO** (`core-service-tcp-info.md`):
- Kernel-level TCP socket statistics polled throughout each connection
- Underlies NDT's RTT and loss metrics; data comes from `tcp_info` socket API

**Packet Headers / PCAP** (`core-service-packet-headers.md`):
- Per-flow packet header captures
- Useful for sub-RTT TCP behavior analysis

---

## Data Access

### BigQuery (primary access method)
- **Free access:** join the M-Lab Discuss group at `https://groups.google.com/a/measurementlab.net/g/discuss`
- Group membership activates sponsored query access to the `measurement-lab` project
- **Project:** `measurement-lab` (never `mlab` or `m-lab` in queries)
- BigQuery console: `https://console.cloud.google.com/bigquery?project=measurement-lab`
- Service accounts need manual addition by M-Lab; email `support@measurementlab.net`

**Partition pruning (critical):** Always use `DATE(a.TestTime)` in WHERE clauses, not `a.TestTime >`. Without it, BigQuery scans the entire multi-TB table.

**Key NDT fields:**
```
a.TestTime              — TIMESTAMP when the test ran
a.MeanThroughputMbps    — download speed in Mbps
a.MinRTT                — minimum RTT in milliseconds
a.LossRate              — packet loss fraction (0.0–1.0)
client.Geo.CountryCode  — ISO 3166-1 alpha-2
client.Geo.Region       — ISO 3166-2 region code
client.Geo.City         — city name (MaxMind, coarse precision)
client.Network.ASNumber — client's Autonomous System Number
client.Network.ASName   — client's ISP/network name
server.Site             — M-Lab site ID (e.g., "lga01")
server.Metro            — metro area (e.g., "lga" for New York)
```

### Google Cloud Storage (raw archives)
- Bucket: `gs://archive-measurement-lab/`
- Format: newline-delimited JSON, one file per server per hour
- Access via `gsutil` (Google Cloud SDK)
- Article: `accessing-data-buckets.md`

### M-Lab Observatory
- Pre-built visualization dashboards for ISP and geographic comparisons
- URL: `https://viz.measurementlab.net`

---

## Key Infrastructure Concepts

### Locate API
- Returns nearest M-Lab servers for a given test
- URL pattern: `https://locate.measurementlab.net/v2/nearest/{experiment}/{datatype}`
- Example: `https://locate.measurementlab.net/v2/nearest/ndt/ndt7`
- Returns JSON list of nearest servers with access tokens

### Access Tokens
- Since 2021, NDT7 tests via the Locate API require tokens
- Tokens bind measurements to the test session; must be passed from Locate API response to the test server
- Logged in raw data for measurement provenance auditing

### M-Lab-Managed vs. Host-Managed Servers (2024+)
- **M-Lab-managed:** M-Lab's own infrastructure at IXP sites
- **Host-Managed (BYOS nodes):** network operators hosting their own M-Lab servers
- `ndt7_union` includes both; `ndt7` = M-Lab-managed only; `ndt7_dynamic` = Host-Managed only
- Researchers choose scope based on study needs

### BYOS (Bring Your Own Server) Program
- Lets ISPs, academic institutions, research networks host M-Lab nodes
- Runs as Docker containers; requires static public IPv4, ports 80/443/9990 open
- Data flows through M-Lab's standard pipeline → BigQuery within ~24 hours
- Registration: `https://measurementlab.net/contribute`
- Article: `byos-overview.md`

### IQB (Internet Quality Barometer)
- M-Lab's composite quality metric framework (2025)
- Goes beyond speed to include latency, loss, "working quality"
- Full report and executive summary at `measurementlab.net/publications`
- Article: `internet-quality-beyond-speed.md`

### M-Lab Annotations
- Geographic annotations: MaxMind GeoIP2 (city-level, coarse for rural areas)
- Network annotations: RouteViews + CAIDA for ASN attribution
- IP address in data = IP as seen by M-Lab server (may differ from client's actual IP if behind NAT/proxy/VPN)
- Article: `mlab-annotations-explained.md`

---

## Audience Types

| Audience | Entry point article | Primary interests |
|---|---|---|
| Researchers / data scientists | `getting-started-researchers.md` | BigQuery access, dataset methodology, analysis patterns, citation |
| ISPs / IXPs / network operators | `getting-started-isp-ixp.md` | Hosting BYOS nodes, understanding their own traffic in data |
| Internet policymakers | `getting-started-policymakers.md` | Using M-Lab data for regulatory/broadband mapping work |
| Internet advocates | `getting-started-advocates.md` | Community broadband, FCC filings, ISP accountability |
| Developers / integrators | `integrating-mlab-tests.md` | Embedding NDT7 in apps/portals, ndt7-js library |
| General public | `welcome-to-mlab.md` | What M-Lab is, why measurements matter |

---

## Common Sampling Bias Caveats (for research articles)

Always mention these when writing research-focused articles:

- **Self-selection bias:** users running tests are more likely experiencing problems or have high interest in their connection
- **Platform distribution:** test volume varies by client platform (Android, browser, ISP portal integrations) over time
- **Coverage gaps:** limited data from low-test-volume regions; always filter for minimum test counts
- **ISP integration effects:** some ISPs embed NDT7 in support tools, creating concentrated test volumes

Use **median** not mean for throughput statistics (distribution is right-skewed).

---

## External Links (canonical references)

| Resource | URL |
|---|---|
| M-Lab website | `https://measurementlab.net` |
| Speed test | `https://speed.measurementlab.net` |
| BigQuery console | `https://console.cloud.google.com/bigquery?project=measurement-lab` |
| M-Lab Observatory | `https://viz.measurementlab.net` |
| Locate API | `https://locate.measurementlab.net` |
| M-Lab Discuss group | `https://groups.google.com/a/measurementlab.net/g/discuss` |
| Support email | `support@measurementlab.net` |
| BigQuery schema repo | `https://github.com/m-lab/etl-schema` |
| NDT server GitHub | `https://github.com/m-lab/ndt-server` |
| M-Lab publications | `https://www.measurementlab.net/publications/` |
| IQB report 2025 | `https://www.measurementlab.net/publications/IQB_report_2025.pdf` |
| NDT unified views examples | `https://www.measurementlab.net/tests/ndt/views/examples` |
| M-Lab Privacy Policy | `https://www.measurementlab.net/privacy/` |
| BYOS / contribute page | `https://measurementlab.net/contribute` |
| Community guidelines | `https://www.measurementlab.net/community-guidelines/` |
