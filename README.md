# HR Agent Assistant

A synthetic demonstration of policy retrieval, employee-specific guidance and reviewable HR workflows. All policies and employee records are fictional. This application is not Bank Rakyat policy or an operational HR system.

## Start here

- Open [https://hr-agent-assistant-scott-1109.almondgoldfinch1.chatgpt.site](https://hr-agent-assistant-scott-1109.almondgoldfinch1.chatgpt.site) (public URL; use your own ChatGPT sign-in for the assistant and requests).
- Select Aisha Rahman and ask `Can I take 5 days of annual leave?`.
- Read the answer, open its citations, inspect MCP tool activity, review the draft, and save the request.
- Select Priya Kumar and ask `Can I work remotely 3 days per week in Malaysia?`.
- Verify the exception requirement and save the review request. Both records appear under HR requests.

## Local reproduction

Requires Node.js 22.13 or newer and npm. Dependencies are pinned in package-lock.json.

```sh
npm ci
node scripts/ingest.mjs --check
node --test tests/core.test.mjs
node scripts/evaluate.mjs
npm run build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_fantastic_martin_li.sql
npm run dev -- --host 127.0.0.1 --port 4173
```

Apply the migration once to a fresh local database. Visit `/signin-with-chatgpt?return_to=/` for the development-only mock identity. Hosted sign-in is managed by Sites and does not use this development identity.

For live AI, securely configure `OPENAI_API_KEY` in ignored `.env.local` and optionally `OPENAI_MODEL` (default `gpt-6-luna`). Never commit that file. Without a key the same workflows run with explicit grounded-rules labeling. `node scripts/evaluate.mjs --live` runs the live acceptance set and incurs API usage.

For a production-build smoke test, start `npm start -- --port 4174`, then run `TEST_BASE_URL=http://127.0.0.1:4174 node scripts/smoke.mjs` (PowerShell: set `$env:TEST_BASE_URL` first). The smoke script uses synthetic identity headers against a LOCAL built Worker only. Hosted authentication is enforced by the platform boundary.

## Project map

| Component | Location | Responsibility |
|---|---|---|
| Web interface | app/page.tsx | Questions, evidence, traces, drafts, saved requests |
| Agent orchestrator | lib/hr/agent.mjs | Guardrails, bounded workflow, fact calculations, synthesis |
| Model provider | lib/hr/provider.mjs | Responses API planning and evidence-constrained explanation |
| MCP client | lib/hr/mcp-client.mjs | Discovery, JSON-RPC transport, tool traces and errors |
| MCP server | lib/hr/mcp-server.mjs and app/mcp/route.ts | Tool schemas, validation and execution |
| RAG index | lib/hr/rag.mjs | Sparse vectors, cosine retrieval and title reranking |
| Mock data | lib/hr/data.mjs | Three employees and 30 policy rules |
| Request persistence | db/schema.ts and lib/hr/context.ts | Owner-scoped D1 records and idempotency |
| Tests and evaluation | tests/ and evaluation/ | Repeatable acceptance evidence |
| Reviewer materials | docs/ and deliverables/ | Design, operations, policy corpus and demo |

See docs/DESIGN_AND_OPERATIONS.md for decisions, limits, monitoring and release controls. See docs/ACCEPTANCE.md for the rubric mapping and outstanding acceptance items.


## Assignment submission materials

- [Design and evaluation](design-and-evaluation.md): architecture, schemas, retrieval, metrics and limitations.
- [AI tooling disclosure](ai-tooling.md): how Codex and model APIs were used.
- [Deployment](deployed.md): app/health URLs, access, cold starts and release gate.
- [Recording script](docs/RECORDING_SCRIPT.md): timed 7–10 minute live screen-share walkthrough.
- [Final requirement audit](docs/FINAL_REQUIREMENTS_AUDIT.md): evidence and remaining personal submission steps.
- `corpus/`: six Markdown/TXT source documents; `mock_data/`: fictional employee ledger.
- `evaluation/questions.json`: 26 questions with gold answers; results, semantic rubric review and ablation alongside.

The presenter must record their own voice/camera demonstration and complete the course identity check. A slide deck and screenshots are supporting material, not substitutes for the required recording. Share the repository with quantic-grader and verify the grader can open the app and video before submitting both links through the course dashboard. Do not store identity documents or recordings containing ID in this source repository.
