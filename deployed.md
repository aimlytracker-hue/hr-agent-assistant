# Deployed application

- App: https://hr-agent-assistant-scott-1109.almondgoldfinch1.chatgpt.site
- Health: https://hr-agent-assistant-scott-1109.almondgoldfinch1.chatgpt.site/health
- MCP: https://hr-agent-assistant-scott-1109.almondgoldfinch1.chatgpt.site/mcp
- Repository: https://github.com/aimlytracker-hue/hr-agent-assistant

The app is publicly accessible by URL following owner approval. The assistant and owner-scoped saved requests require the visitor's own ChatGPT sign-in; no owner password or API key is shared. Use the visible Sign in with ChatGPT link. The GitHub repository is public and readable by quantic-grader without an invitation. GitHub rejected a read-only collaborator invitation on this personal repository; the owner explicitly chose public visibility instead of write access. No write invitation was sent.

Sites runs the app as a Cloudflare Worker with D1 storage, a small committed vector store, and mock JSON records. It requires no separately purchased database. Hosting is subject to the account's platform allowances; this project makes no claim of unlimited free quota. OpenAI model usage can incur charges; a clearly labeled rules fallback runs without a key.

The source, generated index and mock data are bundled, so startup does not download a model or rebuild a vector database. Worker scheduling may add a cold-start delay; no controlled host cold-start experiment has been performed. In-process latency excludes browser/network/cold-start time. Distinguish it from the observed hosted walkthrough timings in the delivery evidence. Allow up to two bounded 25-second model calls; provider errors yield labeled fallback rather than invented answers.

Publication is a gated release: run ingestion verification, tests, evaluation, build and startup/MCP checks; push the exact source commit to GitHub; require a successful Actions run for that SHA; only then invoke authenticated Sites publication for that same source. The Actions deployment-gate reports readiness, and does not itself publish. A workflow failure means no release. Hosted secrets are configured separately and never included in source archives.
