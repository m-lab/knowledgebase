# Existing Article Index

Quick reference for cross-linking. All slugs are relative — use `../slug` in article links.

## Starter / Overview Articles

| Slug | Title | Tags | Difficulty |
|---|---|---|---|
| `welcome-to-mlab` | Welcome to M-Lab: Open Internet Measurement | measurement, research | beginner |
| `internet-quality-beyond-speed` | Beyond Speed: Understanding Internet Quality Metrics | internet-quality | beginner |

## Getting Started (by audience)

| Slug | Title | Audience |
|---|---|---|
| `getting-started-researchers` | Getting Started: Researchers | Academic researchers, data scientists |
| `getting-started-bigquery` | Getting Started with M-Lab Data in BigQuery | Anyone accessing data |
| `getting-started-isp-ixp` | Getting Started: ISP and IXP Staff | ISPs, IXPs, network operators |
| `getting-started-policymakers` | Getting Started: Internet Policymakers | Regulators, government staff |
| `getting-started-advocates` | Getting Started: Internet Advocates | Community broadband, advocacy groups |

## Test Reference Articles

| Slug | Title | Test type |
|---|---|---|
| `test-ndt` | NDT (Network Diagnostic Tool) | Single-stream throughput + latency + loss |
| `test-msak` | MSAK (Measurement Swiss-Army Knife) | Multi-stream throughput + UDP latency |
| `test-wehe` | WeHe — Traffic Differentiation Detection | App-specific throttling detection |
| `test-neubot-dash` | Neubot DASH Streaming Test | Adaptive video streaming emulation |
| `test-reverse-traceroute` | Reverse Traceroute | Return path measurement (~25% of NDT tests) |

## Core Service Articles (run automatically alongside every test)

| Slug | Title | Notes |
|---|---|---|
| `core-service-traceroute` | Traceroute — M-Lab Core Service | Forward path; one of the world's largest longitudinal routing datasets |
| `core-service-tcp-info` | TCP INFO — M-Lab Core Service | Kernel-level TCP socket stats; underlies RTT and loss metrics |
| `core-service-packet-headers` | Packet Headers (PCAP) — M-Lab Core Service | Per-flow packet captures; sub-RTT TCP behavior analysis |

## Data Access and Research

| Slug | Title | Difficulty |
|---|---|---|
| `accessing-data-buckets` | FAQ: Accessing M-Lab Data Buckets | beginner |
| `research-guide` | Analyzing M-Lab Data: A Researcher's Guide | intermediate |
| `mlab-annotations-explained` | M-Lab Network Annotations: Geolocation, ASNs, and What They Mean | intermediate |

## Explainers / FAQ

| Slug | Title | Notes |
|---|---|---|
| `ip-address-mismatch` | FAQ: IP Address Mismatch in M-Lab Data | Why annotated IP sometimes differs from client's actual IP |
| `understanding-speed-test-results` | Understanding Speed Test Results | Why M-Lab results differ from other speed tests |
| `test-rate-limits` | M-Lab Test Rate Limits | Rate limiting policy for the Locate API |

## Node Operations / BYOS

| Slug | Title | Difficulty |
|---|---|---|
| `byos-overview` | Running Your Own M-Lab Node: The BYOS Program | intermediate |
| `register-node-troubleshooting` | Troubleshooting Node Registration | intermediate |
| `docker-byos-monitoring-logging` | Docker BYOS Monitoring and Logging | intermediate |
| `checking-node-probability` | Checking Node Experiment Probability | intermediate |

## Developer / Integration

| Slug | Title |
|---|---|
| `integrating-mlab-tests` | Integrating M-Lab Tests Into Your Website or App |
| `troubleshooting-tests` | Troubleshooting M-Lab Tests |

---

## Planned Articles (gaps from faq-work-to-be-done.md)

These are identified gaps — reference when suggesting "see also" links or when creating them:

- Statistical pitfalls in M-Lab analysis (selection bias, temporal sampling)
- Working with M-Lab GCS raw data in Python
- ISP comparison query example
- BigQuery Python client for reproducible research
