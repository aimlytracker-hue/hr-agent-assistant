# Reviewer acceptance checklist

Reviewer: Scott. Target: score 5. This checklist records evidence and remaining acceptance work; it is not a self-awarded score.

| Rubric requirement | Evidence | Acceptance condition |
|---|---|---|
| Deployed agentic HR system | Private Site release and source commit | Open deployed URL and complete both demos |
| Grounded policy RAG | 30-page corpus, rule index, evidence links | Check every material policy claim against its citation |
| Functional MCP | Six schemas, client discovery, visible traces, HTTP smoke | Observe tools/list and actual calls; verify graceful error |
| Two end-to-end workflows | Annual leave and remote-work exception | Save and reload both pending review requests |
| RAG ingestion and citations | Canonical rules, sparse vector index, version/page metadata | Confirm corpus and retrieved rules match |
| Architecture separation | lib/hr modules, route layer and D1 schema | Review design document and component boundaries |
| Deployment documentation | Design and operations, health endpoint | Review secrets, cold-start limits and rollback |
| Push/PR CI | .github/workflows/ci.yml | Observe a real GitHub Actions run after repository connection |
| Evaluation | Core tests and offline/live JSON reports | Review denominators, failures, latency and human groundedness |
| Demo and design documentation | Reviewer guide, deck and operations guide | Reproduce demos and record reviewer acceptance |

## Demonstration one

Select Aisha Rahman (E001). Ask for 5 working days of annual leave. Expect a 12-day balance, conditional 7-day remainder and manager review. Inspect PTO-2 and the balance call. Read the draft, confirm and save it. Verify its pending status under HR requests. The employee balance must remain unchanged.

## Demonstration two

Select Priya Kumar (E003). Ask for 3 remote days per week in Malaysia. Expect that the role is not standard-eligible and the request exceeds the 2-day standard limit. Inspect REMOTE-1, REMOTE-2 and REMOTE-3 plus get_employee. Save the exception-review request and reload the requests view. No approval should be claimed.

## Challenge cases

Ask an unrelated sports question, request another employee ID within a selected case, omit ticket confirmation, request zero leave days and simulate storage or model failure. Confirm abstention, scoped access, explicit errors and labeled fallback. Read the test source to understand which cases are automated.

## Before a final score

Verify the deployed release, an actual GitHub Actions run and the demonstration with Scott. The current application is a synthetic pilot. Enterprise HRIS integration, production privacy controls, broad semantic retrieval and independent evaluation are future scope and must not be implied by the demonstration.
