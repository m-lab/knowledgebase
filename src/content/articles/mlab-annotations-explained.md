---
title: "M-Lab Network Annotations: Geolocation, ASNs, and What They Mean"
description: How M-Lab annotates measurements with geographic and network metadata, the accuracy and limitations of each annotation type, and how to use them correctly in analysis.
tags: [data-access, internet-quality]
difficulty: intermediate
---

Every M-Lab measurement is enriched with metadata about the client's network and location — **annotations**. Understanding what these annotations represent (and where they fall short) is essential for doing rigorous analysis with M-Lab data.

## How Annotations Are Added

Annotations are applied **after** a test completes, during M-Lab's data processing pipeline. The pipeline takes the client's IP address and looks it up against several databases to add:

- **Geographic location** (country, region, city, lat/lon) from MaxMind GeoLite2
- **Autonomous System Number (ASN)** from RouteViews and CAIDA prefix-to-AS data
- **ISP name** from MaxMind's ASN database

This means annotations reflect the state of these databases at the time the test is processed, not necessarily at the time of testing.

## Geographic Annotations

### Fields Available

```
client.Geo.CountryCode        — ISO 3166-1 alpha-2 (e.g., "US", "DE", "BR")
client.Geo.CountryName        — Human-readable country name
client.Geo.Region             — ISO 3166-2 subdivision (e.g., "US-CA" for California)
client.Geo.City               — City name (MaxMind estimate)
client.Geo.Latitude           — Latitude (see accuracy notes below)
client.Geo.Longitude          — Longitude (see accuracy notes below)
client.Geo.PostalCode         — Postal code (US only, unreliable)
client.Geo.AccuracyRadiusKm   — Estimated accuracy radius in km
```

### Accuracy and Limitations

**Country-level** geolocation is generally reliable (>99% accuracy for most major countries).

**City-level** accuracy is much lower. MaxMind's GeoLite2 (the free database M-Lab uses) is accurate to the city level for roughly 75–80% of IP addresses — but "city level" can mean within 50 km for dense urban areas.

**Coordinates are city centroids**, not user locations. All measurements attributed to a city may share identical coordinates (the city center). This is by design:

1. Privacy — M-Lab data is public; precise coordinates would expose user locations
2. Accuracy — IP geolocation cannot determine exact addresses

**Do not use lat/lon for fine-grained spatial analysis below ~50 km resolution.** Use the `Region` field for sub-national analysis; it's far more reliable than coordinates.

**Rural and less-populated areas** often have very broad location estimates; geolocation accuracy varies significantly by region and ISP.

### Improving Spatial Precision

If your analysis requires finer geographic resolution:

1. **Filter by accuracy radius** — use `client.Geo.AccuracyRadiusKm <= 5` to focus on higher-confidence estimates
2. **Re-annotate with paid geolocation** — consider MaxMind GeoIP2, IPinfo, or similar services applied to raw IP addresses from M-Lab data
3. **Grid-based aggregation** — aggregate data into geographic grids (e.g., 0.5° × 0.5° cells) rather than relying on point coordinates
4. **Use `Region` for sub-national analysis** — ISO 3166-2 region codes are far more reliable than city or coordinate data

M-Lab's built-in geolocation is not suitable for block-level or infrastructure-specific analysis without supplementary sources.

### Region Codes

M-Lab uses ISO 3166-2 codes for subdivisions (states, provinces, etc.):

```sql
-- US state-level analysis
SELECT
  client.Geo.Region               AS state_code,
  COUNT(*)                        AS tests,
  ROUND(AVG(a.MeanThroughputMbps), 2) AS avg_mbps
FROM `measurement-lab.ndt.ndt7_union`
WHERE client.Geo.CountryCode = 'US'
  AND DATE(a.TestTime) BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY state_code
ORDER BY tests DESC
```

## Network Annotations (ASN)

### Fields Available

```
client.Network.ASNumber     — Autonomous System Number (integer)
client.Network.ASName       — AS name from MaxMind (e.g., "Comcast Cable")
client.Network.CIDR         — IP prefix the client address belongs to (e.g., "73.0.0.0/8")
```

### Why ASN is More Reliable Than City

ASN annotations are derived from **BGP routing tables** (RouteViews), which are authoritative. If an IP address belongs to Comcast's AS7922, that's a fact about the routing infrastructure — not an estimate. ASN-level analysis is therefore more reliable than city-level analysis.

For ISP comparisons, always use `ASNumber` rather than `ASName`. Names change (ISP mergers, rebranding), but ASNs are permanent identifiers.

```sql
-- Top ISPs by test volume in a country
SELECT
  client.Network.ASNumber AS asn,
  MAX(client.Network.ASName) AS isp_name,   -- stable within ASN
  COUNT(*) AS test_count,
  ROUND(APPROX_QUANTILES(a.MeanThroughputMbps, 100)[OFFSET(50)], 2) AS median_mbps
FROM `measurement-lab.ndt.ndt7_union`
WHERE client.Geo.CountryCode = 'BR'
  AND DATE(a.TestTime) BETWEEN '2024-01-01' AND '2024-03-31'
GROUP BY asn
HAVING test_count > 1000
ORDER BY test_count DESC
```

### Corporate vs. Residential Networks

A single ASN may include both corporate and residential customers. Comcast's AS7922, for example, includes business customers who may have very different service tiers than residential subscribers. For research on residential broadband specifically, consider filtering by test source (app/platform embedding) if that metadata is available.

## Geolocation Improvements Over Time

M-Lab has invested in improving geolocation accuracy. Key milestones:

- **2022** — Updated to MaxMind GeoLite2, added ISO 3166-2 region codes
- **2023** — Added metadata tracking geolocation database vintage (which version of MaxMind was used)
- **2025** — Ongoing work to improve accuracy for underrepresented regions

M-Lab published a blog post on [Improving M-Lab Geolocation](https://measurementlab.net/blog/improving-m-lab-geolocation) describing ongoing methodology improvements.

## Matching M-Lab Data to Other Datasets

When joining M-Lab data with external datasets (census, FCC broadband maps, etc.):

| Join level | Reliability | Recommended approach |
|-----------|------------|----------------------|
| Country | High | `CountryCode` |
| State/Province | High | `Region` (ISO 3166-2) |
| City | Medium | `City` name, but validate with test counts |
| ZIP/Postal | Low | Use sparingly, US only |
| Lat/lon | Low | Only for coarse (50+ km) spatial analysis |

---

<!-- TODO: Add section on the `server` annotations (M-Lab site, metro, geolocation of the server) and how server location affects interpretation. Add section on historical annotation changes — the schema changed in 2020 with the M-Lab 2.0 migration, so some older field names differ. Add worked example of joining M-Lab ASN data with CAIDA's AS rank and type dataset to distinguish eyeball from transit networks. -->
