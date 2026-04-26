---
title: "FAQ: Required Ports for M-Lab Nodes"
description: Why M-Lab nodes must use ports 80 and 443 and what happens if those ports are blocked.
tags: [byos, node-configuration, networking]
difficulty: beginner
---

**Q: Can I change the ports that my M-Lab node uses? I need to use different ports than 80 and 443.**

**A:** **No, you cannot change the required ports.** M-Lab nodes must use ports 80 and 443 because:

- The M-Lab Locate Service returns test URLs specifically for these ports
- Google Search integration requires these standard HTTP/HTTPS ports
- M-Lab monitoring automatically checks port 443 availability
- **Nodes with blocked ports 80/443 are automatically removed from production**

## Running a Custom NDT Server

If you want to run your own NDT server with custom ports, that is possible, but it would not be part of the M-Lab platform and would not receive traffic from M-Lab clients.
