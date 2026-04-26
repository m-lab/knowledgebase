---
title: "FAQ: Environment File Path Issues"
description: How to resolve \"couldn't find env file\" errors when running Docker Compose commands for an M-Lab BYOS node.
tags: [docker, byos, troubleshooting, node-configuration]
difficulty: beginner
---

**Q: I'm getting "couldn't find env file" errors when running Docker Compose commands. How do I fix this?**

**A:** This error occurs when Docker Compose can't locate your environment file. Common solutions:

1. **Ensure you're in the correct directory** where your `env` file is located
2. **Use the full path** to the env file:

```bash
docker compose --profile ndt --env-file /full/path/to/env down
```

3. **Check file permissions** — ensure the env file is readable
4. **Verify the filename** — it should be exactly `env` (not `env.txt` or `.env`)

The env file contains critical configuration like your API key, IP address, and other deployment settings.
