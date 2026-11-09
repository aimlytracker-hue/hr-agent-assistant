# Design and evaluation

## Architecture

```text
Browser /api/chat -> bounded agent orchestrator -> MCP client
                                      |              |
                               Responses API   JSON-RPC transport
                                                     |
                                                MCP server
                                                /                                          persisted sparse store  mock employee JSON
                                                |
Browser confirmation -> /api/tickets -> MCP create_hr_ticket -> owner-scoped D1
```

The web layer is app/, orchestration and provider adapters are lib/hr/agent.mjs and provider.mjs, and MCP client/server modules are lib/hr/mcp-client.mjs and mcp-server.mjs. mock_data/employees.json is the synthetic ledger. The six corpus files and generated policy/index files are separate from employee data. Hosted and local implementations use the same modules.

## Ingestion, embedding and storage

Six source documents in corpus/ cover time off, remote work, expenses, benefits, conduct and security. Three are Markdown and three plain text. Each has five heading-delimited sections, totaling 30 page-linked sections; deliverables/Synthetic_HR_Policy_Corpus.pdf is the 30-page reading rendering, not 30 additional source documents. The original policies are deliberately small and synthetic.

`node scripts/ingest.mjs` normalizes line endings, strips nulls, parses Markdown or TXT section headings and metadata, validates 30 unique IDs, and persists policy records and a sparse vector store under lib/hr/generated/. `--check` fails if committed artifacts are stale. Each chunk is an atomic policy rule; page, document, section, title, version, effective date and source snippet are retained. Shared procedural text remains available in the full document but is excluded from embeddings so boilerplate does not dominate ranking. No overlap is needed because each rule is self-contained. This is heading-aware parsing of the supplied authoring formats, not a general arbitrary-PDF parser.

The local embedding model is deterministic TF-IDF (local-tfidf-v1): term counts use 1+log(tf), inverse frequency uses log(1+N/(1+df)); vocabulary is fitted to the corpus. Vectors, norms, vocabulary frequencies and document metadata are persisted in a lightweight JSON vector store, read at runtime. This is a transparent lexical embedding model, not a pretrained neural semantic model. It costs no API calls and fits modest Worker resources, but loses paraphrase recall. Cosine retrieval uses a small title bonus and a 0.09 threshold; k=4 is the default. The six-query k=1/2/4/8 ablation in evaluation/retrieval-ablation.json documents the recall/precision tradeoff. Remote workflows also retrieve security evidence, demonstrating multi-document synthesis.

## Agent and MCP

A manual state machine enforces high-impact HR boundaries. The live model proposes an intent and read-only tools from the discovered catalog. The orchestrator validates the intent through a bounded workflow, executes required tools, computes balances/caps deterministically and asks the model for a cited explanation. Tool suggestions are advisory; the model cannot bypass required tools or invoke writes. General policy Q&A can use retrieval alone. Missing days/amounts produce explicit clarification without a draft. Exceptions produce an escalation flag and review-only draft. No hidden chain-of-thought is displayed.

The client performs MCP initialize, notifications/initialized, tools/list and tools/call. The in-process transport serializes JSON-RPC requests and enforces the same schemas as the deployed /mcp endpoint. Co-location avoids extra free-tier services. The HTTP route supports JSON request/response MCP operations; long-lived subscriptions and streaming notifications are outside this small demo. The application does not call business tool handlers directly from the agent. Operational traces include method, selected tool, arguments, returned result, timing and error status. No model scratchpad is logged.

Six tools: search_policies(query); get_employee(employee_id); get_pto_balance(employee_id); get_benefits(employee_id); draft_email(subject,body); create_hr_ticket(subject,body,request_key,confirmed). All arguments are schema checked, extra fields rejected, and employee scope validated server-side. Full JSON schemas are the exported tools array in lib/hr/mcp-server.mjs. D1 inserts are parameterized, owner-scoped and idempotent by request key. Drafting never sends an email. Ticket saving requires explicit user confirmation and never approves leave, changes balances or authorizes payment.

### Demonstration sequences

1. Aisha/E001 requests 5 working days leave: initialize -> tools/list -> search_policies -> get_employee -> get_pto_balance -> draft_email. Explain 12 available and conditional remainder7; manager approval still required. Read the draft, confirm, then create_hr_ticket through a fresh MCP discovery. Reload HR requests to show persistence.
2. Priya/E003 requests 3 remote days in Malaysia: discovery -> remote policy search -> security policy search -> get_employee -> draft_email. Explain role ineligibility, the standard2-day limit, exception review, approved device/VPN. Confirm and save the exception-review request, then reload. Inspect actual arguments and results in the UI. Neither workflow grants HR approval.

## Evaluation and interpretation

The authored 26-case set in evaluation/questions.json includes gold answers, expected facts and expected operational outcomes. Categories include routine Q&A, cross-document remote/security tasks, employee tools, ambiguous and invalid requests, out-of-corpus requests, injection and cross-employee attempts. Run `node scripts/evaluate.mjs` offline or `node scripts/evaluate.mjs --live` with the ignored local key. Metrics include fact coverage, citation resolution, tool selection, workflow completion, clarification/escalation, multi-document coverage and action safety. Each metric reports its actual denominator; inapplicable cases are excluded rather than counted as success.

`node scripts/semantic-review.mjs` separately scores live answers against the retrieved evidence and tool facts on a 0-2 groundedness and citation-accuracy rubric. The model, date, scores and rationales are retained in evaluation/semantic-review.json. This automated same-provider review may share model biases and is not an independent benchmark. Inspect low scores and do a human citation audit before submission. Lexical checks alone are not a claim of semantic groundedness.

Live evaluation executes independent cases with concurrency3 and reports p50/p95 on the first20 successful representative live-provider tasks, with sample size stated. Offline latency is separately labeled. Neither includes hosted network or cold-start overhead. Hosted walkthrough timings are observational, not a controlled cold/warm comparison. No cold-start estimate is fabricated. Retrieval ablation holds corpus/chunks fixed and varies k over six authored queries; do not generalize perfect recall beyond this set.

## Reproducibility, deployment and safety

Node22+ and checkout-local node_modules provide the equivalent isolated dependency environment. package-lock.json pins dependencies. Corpus ordering and chunk boundaries are deterministic; no stochastic sampling is used. Model responses remain nondeterministic. Secrets are environment variables, excluded from Git. See README.md, deployed.md and docs/DESIGN_AND_OPERATIONS.md for execution, configuration, cost, monitoring and rollback details.

Tests cover initialization/discovery/call, invalid schemas, employee scope, confirmation, unavailable tools, absent employees, missing storage, provider fallback, ambiguity, multi-document evidence and citation resolution. CI runs ingestion freshness, ablation, tests, evaluation, build, database setup, startup, and HTTP MCP smoke checks on push/PR. Publishing occurs only after these pass for the release SHA.

Synthetic data and basic identity scoping are appropriate for a teaching pilot, not production HR. Do not collect real HR records or identity documents in the app. Production would need stronger authorization, audit/retention policy, abuse controls, broader evaluation and privacy/security review. Model evidence checks reduce but cannot eliminate hallucination.


### What the semantic review changed

The first complete-context rubric review flagged over-balance referrals expressed as mandatory HR policy, an unsupported “not approved” status assertion and an overly strong claim-eligibility referral. The revised implementation labels referrals as recommendations, separates evidence requirements from suggested next steps, and states only that this assistant cannot grant approval. evaluation/semantic-review-before-fixes.json retains those findings; the final review is in semantic-review.json. An earlier evaluator attempt omitted the original question/employee tool results; it was invalid as a full-context assessment and was replaced, not counted as application quality evidence.


## Recorded results for this revision

- Core tests: 20/20. Offline and live authored acceptance cases: 26/26.
- Gold facts: 21/21; citation resolution: 21/21; tool selection: 21/21.
- Workflow completion: 12/12; clarification/escalation: 12/12; action safety: 26/26; multi-document cases: 3/3.
- Live latency sample n=20, concurrency3: p50 4.409s; p95 5.297s.
- Same-provider semantic judge n=21: groundedness 1.905/2; citation accuracy 1.810/2.

These are the actual scores, not a perfect-groundedness claim. Remaining judge findings concern policy citations attached to tool-sourced balances, the citation placement for recording approved leave, and a generic domestic-location recommendation in meal guidance. The numeric balances are supported by tool outputs, but citation placement can still be improved. The judge's rationales remain visible; do not omit them from the demonstration.
