# Presenter recording plan — target 8 minutes 45 seconds

Submission type: individual. You are the sole presenter; group agreement requirements do not apply. This is a rehearsal script, not a completed recording. Use your own voice and explain the system in your own words. Keep the deployed app, GitHub Actions, repository documents and evaluation reports open. Share your screen with camera overlay and microphone. Record a real live walkthrough, not a slideshow presented as an interactive demo. Target 7–10 minutes including the required identity segment. For a group, every member must speak and be on camera; complete the signed Group Project Agreement and submit once. Confirm the course's approved method for showing government ID; keep it out of GitHub, the app, screenshots and public sharing. Do not send identity documents to this assistant.

## 0:00–0:35 — introduction and course identity step

Introduce yourself (or every group member) and the project. Complete the identity/camera requirement using the course's designated recording/submission process. State: “This is a fictional HR assistant; it does not use real employee data or grant HR approvals. Codex helped create and test the application; I remain responsible for the implementation.”

## 0:35–1:15 — problem and architecture

Show the app URL and design-and-evaluation.md diagram. Explain: “The interface sends a request to a bounded agent. It discovers six MCP tools. Policy search reads a local sparse vector store; employee tools read fictional JSON. OpenAI proposes a workflow and explains supplied evidence. The state machine enforces mandatory checks. Confirmed mock requests are saved in an owner-scoped database.” Point out the separate client, server, retrieval and provider files.

## 1:15–3:20 — task one: leave

Select Aisha/E001. Click the five-day leave example. Read the 12-day balance and conditional seven-day remainder; emphasize manager approval and dates/coverage. Open PTO-2 and compare the claim with its source text. Expand MCP initialization and tools/list. Explain that the client discovers schemas before invoking tools. Expand search_policies: point to query argument and returned matches with IDs/pages. Expand get_employee and get_pto_balance: identify employee_id E001 and returned remaining_days12. Expand draft_email and show its output is a draft, not an email sent. Read the draft, tick confirmation, save, and open HR requests. Explain create_hr_ticket's confirmed flag and pending status. Reload and show the persisted record.

## 3:20–5:25 — task two: remote-work exception

Select Priya/E003 and request three remote days per week in Malaysia. Explain that the role is not standard-eligible and three days exceeds the two-day limit. Show remote eligibility/arrangement citations and the additional security document requiring an approved device and VPN. Expand the two search_policies calls and get_employee; point to arguments and actual returned values, not just green success markers. Explain the escalation to HR and absence of approval. Read, confirm and save the exception-review draft. Reload HR requests and show both pending tasks.

## 5:25–6:10 — boundaries and failure behavior

Ask “Can I take annual leave?” Show that missing days/dates prompt clarification and no draft is offered. Briefly show an out-of-corpus question and refusal to invent policy. Explain server-side employee scope, confirmation, unknown tool/schema errors and labeled provider fallback. Mention that real HR data and production decisions are out of scope.

## 6:10–7:05 — ingestion and retrieval design

Show six corpus files: Markdown and TXT, five sections each, with a 30-page PDF reading version. Explain deterministic heading-aware parsing, atomic rule chunks and persisted TF-IDF vectors/metadata. State clearly that this is lexical embedding, not neural semantic search. Show the ablation table: k1/2 miss relevant sections; k4 recovers all expected sections in the six authored probes; k8 adds noise. Explain that this is small-set evidence, not general retrieval perfection.

## 7:05–7:55 — deployment and CI

Show deployed.md and /health (app, database and MCP discovery status). Show the latest successful GitHub Actions run and the exact source commit. Explain dependency install, ingestion freshness, tests/evaluation, build, startup and MCP HTTP checks. Publication is permitted only after the same commit passes; the readiness job itself does not publish. Explain environment secrets, no paid database requirement, platform quotas and the lack of a controlled cold-start measurement.

## 7:55–8:45 — evaluation and limitations

Show evaluation/questions.json and live-results.json: 26 gold tasks, categories and real denominators. Explain the 20-query live latency sample and distinguish it from hosted latency. Show semantic-review.json and its rationale for any lower scores: this is a same-provider rubric judge, not an independent human assessment. Show the requirement audit and ai-tooling.md. Conclude with what works, the lexical retrieval/production-control limits, and how a grader can reproduce both tasks.

## Before submitting

Watch the exported recording end to end. Verify 7–10 minutes, audible narration, readable tool arguments/results, two saved deployed tasks, all required presenters and identity steps, and an accessible video link. Check repository access for quantic-grader, app access and video permissions from an authorized non-owner account. Submit the video link and repository link via the course dashboard. No submission or reviewer approval is claimed by this script.
