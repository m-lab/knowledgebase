---
title: "FAQ: Checking Node Probability and Status"
description: How to use the M-Lab Locate Service API to verify your node's probability setting and registration status.
tags: [byos, node-configuration, monitoring]
difficulty: beginner
---

**Q: How can I verify my node's current probability setting and registration status?**

**A:** Use the M-Lab Locate Service API to check your node's status:

```
https://locate.measurementlab.net/v2/siteinfo/registrations?org=YOUR_ORG_NAME
```

Replace `YOUR_ORG_NAME` with your organization name. This will show:

- Current probability percentage (0.0 to 1.0)
- Registration status
- Server details and locations
- Whether your node is actively serving traffic

Remember that probability changes require restarting your Docker Compose stack to take effect.
