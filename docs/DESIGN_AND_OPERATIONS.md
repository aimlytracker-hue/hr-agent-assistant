> Revision note: the current assignment review is in design-and-evaluation.md and docs/FINAL_REQUIREMENTS_AUDIT.md. The updated evaluation has 26 gold cases and 20 core tests. MCP traces now include returned results; ingestion reads six Markdown/TXT sources into a persisted sparse store.

# Design and operations

## Purpose and scope

The assistant helps a reviewer demonstrate how policy evidence and structured employee facts can support HR service requests. It covers annual leave, remote work, expenses and benefits. Conduct and security policies support general policy search. The assistant prepares requests for a human reviewer. It does not approve employment decisions, deduct leave, pay expenses, change benefits or send email.

## Architecture and data flow

1. The authenticated web user selects a fictional employee and submits a question.
2. The orchestrator checks input length, selected employee references and basic prompt/secret patterns.
3. The MCP client discovers server capabilities and the six tool schemas through JSON-RPC.
4. When configured, the OpenAI provider classifies the question and proposes a bounded read-only plan. Deterministic routing is the disclosed fallback.
5. The orchestrator executes the workflow through the MCP client. Policy search returns evidence. Employee tools return the relevant balance, eligibility or plan.
6. The orchestrator calculates explicit outcomes and preserves the verified assessment. The provider supplies a policy explanation, subject to citation-ID and numeric checks. Failed provider checks fall back to the rule-based answer.
7. The user can inspect source pages, actual tool calls and a draft. The separate confirmation action invokes create_hr_ticket through MCP.
8. D1 stores the request under the authenticated Site user. Reusing the same owner/request key returns the existing request. The employee ledger never changes.

The app uses an in-process JSON-RPC transport inside one Worker to avoid an authenticated loopback request. The independently exposed `/mcp` HTTP endpoint uses the same handler and schemas. The HTTP smoke test verifies discovery and a real tool call across HTTP. This is a bounded workflow agent, not an unrestricted autonomous agent. Model-selected tools are advisory within the route; the orchestrator enforces the required operations and action boundary.

## Policy ingestion and retrieval

`lib/hr/data.mjs` is the canonical, authored policy source. `docs/policies.json`, the 30-page PDF and web policy views are derived from it. Each of six policy areas contains five uniquely identified rules. One rule is an atomic retrieval chunk. Metadata includes policy ID, category, title, version, effective date and corpus page. The repeated procedure text in the reading corpus is not indexed, which avoids diluting the retrieval signal.

The module creates an in-memory sparse TF-IDF vector store at startup. It normalizes tokens and common HR synonyms, calculates document frequencies and log-scaled term weights, then ranks cosine similarity with a modest title-token bonus. The cutoff is 0.09 and the normal result count is four. No overlapping chunks are necessary because individual rules are short. Query expansion for workflows ensures that approval and exception rules accompany facts. General questions use the original question.

This design avoids an external vector service for a 30-rule corpus. It provides transparent, reproducible embeddings and low startup overhead. It is not a dense semantic embedding model and will miss some paraphrases. At larger scale, replace it with a versioned dense-vector index and evaluate hybrid retrieval, reranking and retrieval recall against an independently authored set before switching. Do not infer broad semantic search quality from this small acceptance set.

Update procedure: edit canonical rules and IDs deliberately, update effective date/version, regenerate JSON/PDF, rerun citation and workflow tests, inspect changed pages, then release a new source version. Do not silently reuse an ID for unrelated policy content. The application does not ingest arbitrary uploaded PDFs or untrusted remote documents.

## MCP contract

The server supports `server/discover`, `initialize`, `notifications/initialized`, `tools/list` and `tools/call`. Tool results are text content blocks containing structured JSON. Tool failures return `isError`; unknown methods return JSON-RPC errors. The client records method, tool, validated arguments, duration, status and any error. Discovery uses the Site platform protocol plus a legacy initialization compatibility path.

| Tool | Inputs | Effects |
|---|---|---|
| search_policies | query | Read-only ranked evidence |
| get_employee | employee_id | Selected fictional employee only |
| get_pto_balance | employee_id | Remaining working-day balance |
| get_benefits | employee_id | Plan limits, not remaining claims |
| draft_email | subject, body | Returns a draft without sending |
| create_hr_ticket | subject, body, request_key, confirmed | Saves a pending fictional review request |

Schemas reject extra fields and wrong types. Strings are bounded. Employee IDs must match the selected case. Only fictional records are selectable. This case boundary is not a substitute for an enterprise HR authorization model. Hosted identity and Site access protect requests, which are scoped by owner.

## Model configuration and safeguards

The server reads OPENAI_API_KEY from a secret binding. OPENAI_MODEL defaults to gpt-6-luna, which was verified against the configured project during delivery. Two bounded Responses calls handle planning and synthesis. Each has a 25-second timeout and a 1,800-output-token cap. The adapter uses store:false and does not log keys or raw request text. It does not change model or credentials on failure.

Input and retrieved evidence are described to the model as data. The model cannot directly save a ticket. Evidence checks reject unknown citations and new numeric quantities. The verified deterministic assessment remains visible even when the model explains it. These checks reduce but do not eliminate unsupported semantic claims. Review generated explanations for factual entailment, especially new question types. Basic pattern filtering is not comprehensive prompt-injection prevention or sensitive-data detection.

## Persistence and security

D1 tables are created by versioned Drizzle migrations, not request handlers. Inserts use parameter binding and a unique owner-scoped request key. Reads require the authenticated owner. Browser mutations reject mismatched Origin headers. Request bodies and individual strings have size limits. The private Site boundary remains essential. Do not expose the Worker directly or change the Site to public without revisiting access controls and rate limits.

No real employee data, medical records or credentials belong in this demonstration. Browser code contains only synthetic policy and employee data. Secret values stay in ignored local environment files and hosted secret bindings. The source and delivery archive must exclude .env.local, .sites-runtime, .wrangler and node_modules. Production use would require enterprise role mapping, retention/deletion workflows, durable audit logs, abuse/rate controls, privacy review and incident procedures.

## Deployment and cost

The deployment target is a private Sites-hosted Cloudflare Worker with a D1 binding. The manifest declares DB and MCP capability. The runtime uses HTTP connections and fits the Worker execution model. Source synchronization and release packaging use the Sites authenticated workflow. A release must identify the exact pushed commit and immutable saved version before deployment. API usage consumes the user's OpenAI balance; no zero-cost guarantee is made. The design avoids a continuously running VM and an external vector database.

Cold start: the policy index is initialized when an isolate loads. The first model call also depends on provider latency. Do not interpret local warm timings as hosted cold-start measurements. `/health` checks database reachability and reports model configuration, chunk count and version; it does not spend API credits or certify provider availability. A provider failure produces a labeled fallback rather than claiming live AI success.

## CI and release gates

`.github/workflows/ci.yml` defines push, pull-request and manual triggers. It installs locked dependencies, runs core tests and the offline evaluation, builds the Worker, initializes a temporary local database, starts the built server and tests HTTP health plus MCP discovery/call. Evaluation and server logs are retained as artifacts. The production environment gate marks validated source ready; publication uses the authenticated Sites workflow, not an unauthenticated deploy hook.

A workflow file is not evidence of a GitHub run. Actual push/PR execution depends on creating or connecting the GitHub repository. Record that limitation until an Actions run is observed. Local equivalents were executed separately. Do not claim automatic deployment is active merely because the validation job exists.

## Monitoring and response

The server emits structured events containing intent, latency, mode, error flag and tool count, without question text. Monitor health failures, provider fallback rate, workflow errors, latency percentiles and write failures. The evidence panel is per-request observability, not a durable enterprise audit log. Suggested pilot thresholds: alert on any sustained health failure, investigate fallback above 5 percent, and review p95 above 15 seconds over a meaningful sample. These are proposed operating thresholds, not measured service-level commitments.

On an incident, preserve the failed release ID and error class, disable affected write flows if necessary, and redeploy the last known-good saved version. Never replay a confirmed write with a new request key during recovery. Back up D1 before production schema changes. Use additive migrations and review rollback compatibility. Rotate a compromised API key through the approved secret setup flow and redeploy to apply it.

## Evaluation and acceptance

Core tests cover protocol discovery, schemas, employee scoping, confirmation, storage failure, workflow arithmetic, citation resolution, unknown evidence, basic injection patterns and provider fallback. The acceptance dataset is authored with 12 cases. Reports distinguish offline and live modes, metric denominators, case results and wall-clock latency. Expected-fact checks are regression proxies, not an independent semantic groundedness grade. Human review should score each claim against cited policy and employee facts and add adversarial paraphrases before broader use.

Browser demonstrations exercise actual answers, drafts, confirmation and persistence. Final acceptance and the rubric score belong to Scott. The assistant cannot approve its own delivery on Scott's behalf.

## Attribution

The implementation follows the supplied Complete AI Agentic HR Playbook and scoring images. Policies, employee names and balances are synthetic authoring for this project. Official API contract reference: https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses. The application uses the supplied Vinext Sites starter and its licensed dependencies.
