# Final review against the eight-page course brief

The supplied course brief is the acceptance reference. This audit does not award a score. The earlier delivery missed several explicit requirements; this revision corrects the gaps listed below.

| Requirement | Evidence / implementation | Status |
|---|---|---|
| Local and deployed agentic HR app | README, deployed.md, hosted walkthrough | Implemented; reverify revised release |
| 5–20 documents / 30–120 pages | Six corpus Markdown/TXT documents, 30 section pages, 30-page PDF rendering | Implemented |
| Two input formats and chunking | scripts/ingest.mjs, heading-aware metadata parsing | Implemented |
| Embedding + lightweight vector store | Deterministic local TF-IDF model; persisted generated/vector-store.json | Implemented with documented lexical limitations |
| Top-k, citations, snippets, guardrails | rag.mjs, provider.mjs, source metadata and policy pages | Implemented |
| Complex multi-document question | Remote eligibility plus security/device/VPN evidence | Implemented and tested |
| Agentic selection and two workflows | Bounded model plan, required MCP calls, leave and remote | Implemented |
| Concise trace including results | MCP initialization, discovery, arguments, results and errors | Corrected in this revision |
| Failure, ambiguity and escalation | Explicit clarification/no draft, exception review, missing record/tool tests | Expanded in this revision |
| Five or more MCP tools | Six schemas; discovery and actual tool calls | Implemented |
| UI, chat, health and reproducibility | /api/chat, /health, examples, run instructions | Implemented; MCP health added |
| Compatible deployment and cost notes | Worker/D1, bundled store, env secrets, quota and cold-start caveats | Documented |
| Push/PR build/start/MCP CI | GitHub workflow; publish only after passing exact source SHA | Implemented; verify latest run |
| 20–30 gold evaluations | 26 cases in evaluation/questions.json | Corrected from original12 |
| Answer, behavior and system metrics | Offline/live results, semantic rubric review, p50/p95 sample20 | Expanded; judge limitations disclosed |
| Ablation | k=1,2,4,8 on six fixed retrieval probes | Added |
| Exact repository documents | README, design-and-evaluation.md, ai-tooling.md, deployed.md | Added/updated |
| Mock data and MCP code | mock_data/, lib/hr/mcp-*.mjs | Implemented |
| Recorded screen-share with voice/camera | docs/RECORDING_SCRIPT.md provides timed plan | NOT COMPLETE: presenter must record7–10 minutes |
| Identity/group requirements | Course identity procedure; group agreement when applicable | Individual submission confirmed; presenter action required; no ID collected by app |
| Share repo with quantic-grader | Public repository readable by quantic-grader | Owner-approved public access verified |
| Grader can open deployed app | Public URL; visitor uses own ChatGPT sign-in | Owner-approved public access configured |
| Two submission links | Repository exists; video link not supplied | Submission pending |

A slide deck, screenshots and automated tests do not substitute for the required recorded demonstration. A successful technical review does not guarantee score5. Do not submit until access and personal recording requirements are complete.
