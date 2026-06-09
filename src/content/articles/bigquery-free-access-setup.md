---
title: "Setting Up Free BigQuery Access to M-Lab Data"
description: How to get free query access to M-Lab's BigQuery datasets by joining the M-Lab Discuss group, using either the Google Cloud Console or the Cloud SDK.
tags: [data-access, bigquery]
difficulty: beginner
---

M-Lab provides free BigQuery query access to anyone who joins the M-Lab Discuss mailing list. Once you're a member, queries run against the `measurement-lab` project are paid for by M-Lab. **Queries billed to your own GCP project, saving results to BigQuery tables, and similar operations will incur costs to you.**

Questions? Email [support@measurementlab.net](mailto:support@measurementlab.net).

## Step 1: Join the M-Lab Discuss Group

Subscribe your Google account to the [M-Lab Discuss group](https://groups.google.com/a/measurementlab.net/g/discuss). Membership grants your account permission to query the `measurement-lab` project at no charge.

The mailing list is also used to announce data format changes, platform updates, and M-Lab events. All participants are asked to follow the [community guidelines](https://www.measurementlab.net/community-guidelines/).

## Step 2: Choose Your Access Method

### Option A — Google Cloud Console (browser-based)

1. Visit the [BigQuery page for the measurement-lab project](https://console.cloud.google.com/bigquery?project=measurement-lab).
2. If prompted, accept the BigQuery Terms of Service.
3. The `measurement-lab` project will appear in the left-hand **Resources** panel. Click it to browse datasets, tables, and views.

You can now run queries against M-Lab data at no charge. You do **not** need to activate Google's free credit offer.

### Option B — Google Cloud SDK (command line)

1. [Download and install the Google Cloud SDK](https://cloud.google.com/sdk/) for your operating system.
2. Authenticate using the Gmail account you subscribed to M-Lab Discuss:
   ```
   gcloud auth login
   ```
   Follow the browser prompts to complete authentication.
3. Set your default project to `measurement-lab`:
   ```
   gcloud config set project measurement-lab
   ```

BigQuery's `bq` command-line tool is now available and queries against `measurement-lab` datasets will not be billed to you.

## Next Steps

- [BigQuery Schema](https://www.measurementlab.net/data/docs/bq/schema) — understand how M-Lab data is structured
- [Google BigQuery documentation](https://cloud.google.com/bigquery/what-is-bigquery)
- [Querying date-partitioned tables](https://cloud.google.com/bigquery/docs/querying-partitioned-tables) — important for keeping query costs low
- [bq Command-Line Tool Quickstart](https://cloud.google.com/bigquery/bq-command-line-tool-quickstart)

See also the [Getting Started with M-Lab Data in BigQuery](../getting-started-bigquery) article for your first queries and schema overview.

## Using a Service Account

If you need to query M-Lab data from an application using a service account (e.g., `@developer.gserviceaccount.com`), email [support@measurementlab.net](mailto:support@measurementlab.net) so M-Lab can add the account to M-Lab Discuss manually.

M-Lab has confirmed that queries from a service account with the **BigQuery User**, **BigQuery Job User**, and **BigQuery Data Viewer** IAM roles — added to M-Lab Discuss and configured to use the `measurement-lab` project — do not incur billing. However, M-Lab does not exhaustively test all service account operations, so charges for edge cases cannot be fully guaranteed.
