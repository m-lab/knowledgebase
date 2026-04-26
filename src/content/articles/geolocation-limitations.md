---
title: "FAQ: Geolocation Limitations in M-Lab Data"
description: Why M-Lab measurements often share identical coordinates and how to work around coarse geolocation for spatial analysis.
tags: [geolocation, data-access, privacy, bigquery]
difficulty: intermediate
---

**Q: Why do many M-Lab measurements show identical latitude/longitude coordinates? Can I get more precise location data for fine-grained spatial analysis?**

**A:** M-Lab's geolocation data has intentional limitations due to privacy considerations and the inherent constraints of IP-based geolocation:

## Geolocation Source and Privacy

- M-Lab uses MaxMind's GeoLite2 database for IP geolocation
- Geographic precision is intentionally kept coarse (typically city-level) for privacy protection
- All M-Lab data is publicly accessible, so fine-grained location data could compromise user privacy

## Common Limitations

- Multiple measurements may share identical coordinates within a city
- Geolocation accuracy varies significantly by region and ISP
- Rural or less-populated areas often have very broad location estimates
- The `client.Geo.AccuracyRadiusKm` field indicates the estimated accuracy radius

## Improving Spatial Precision

1. **Filter by accuracy:** Use `client.Geo.AccuracyRadiusKm <= 5` to focus on more precise estimates
2. **Alternative geolocation services:** Consider using paid services like MaxMind GeoIP2, IPinfo, or similar to re-annotate M-Lab data with your own geolocation
3. **Grid-based analysis:** Aggregate data into geographic grids rather than relying on exact coordinates
4. **Use newer datasets:** The `ndt7_union` table includes measurements from more servers and may provide better geographic coverage

## For Fine-Grained Analysis

M-Lab's built-in geolocation may not be suitable for block-level or infrastructure-specific analysis. Consider combining M-Lab data with external geolocation services or using statistical methods to estimate coverage areas based on network topology and known infrastructure locations.
