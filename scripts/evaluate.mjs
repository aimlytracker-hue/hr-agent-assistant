import fs from 'node:fs/promises';
import {runAgent} from '../lib/hr/agent.mjs';
import {createProvider} from '../lib/hr/provider.mjs';
const live=process.argv.includes('--live');if(live)process.loadEnvFile('.env.local');
const provider=live?createProvider(process.env):null;
const cases=JSON.parse(await fs.readFile('evaluation/questions.json','utf8'));const results=[];
async function evaluate(c){
 const r=await runAgent({message:c.question},{owner:'evaluation',employeeId:c.employee},provider);
 const ids=[...r.answer.matchAll(/\[([A-Z]+-\d+)\]/g)].map(m=>m[1]);
 const checks={gold_fact_coverage:c.facts.length?c.facts.every(t=>r.answer.toLowerCase().includes(t.toLowerCase())):null,
 citation_resolution:r.citations.length?ids.length>0&&ids.every(id=>r.citations.some(p=>p.id===id)):null,
 tool_selection:c.tool?r.trace.some(t=>t.tool===c.tool)&&r.intent===c.intent:null,
 workflow_completion:c.workflow?!!r.proposal&&!r.error:null,
 escalation_clarification:c.clarify?!!r.clarification_required&&!r.proposal:c.escalation?!!r.escalation_required:null,
 multi_document:c.multidoc?new Set(r.citations.map(p=>p.document_id)).size>=2:null,
 action_safety:c.blocked?!!r.blocked:c.abstain?!!r.abstained:!r.trace.some(t=>t.tool==='create_hr_ticket')};
 results.push({id:c.id,question:c.question,gold_answer:c.gold_answer,checks,passed:Object.values(checks).every(v=>v!==false),latency_ms:r.latency_ms,mode:r.mode,provider_error:r.provider_error||null,answer:r.answer,evidence:r.citations.map(({id,rule,source})=>({id,rule,source})),facts:r.facts||{},trace:r.trace});
 console.log(c.id,Object.values(checks).every(v=>v!==false)?'PASS':'FAIL',r.mode);
}
for(let i=0;i<cases.length;i+=3)await Promise.all(cases.slice(i,i+3).map(evaluate));
results.sort((a,b)=>cases.findIndex(c=>c.id===a.id)-cases.findIndex(c=>c.id===b.id));
const representative=results.filter(r=>r.mode==='OpenAI + policy evidence').slice(0,20);
const ts=(representative.length?representative:results.slice(0,20)).map(r=>r.latency_ms).sort((a,b)=>a-b);
const report={timestamp:new Date().toISOString(),mode:live?'Live OpenAI provider':'Deterministic offline',scope:'26 authored gold cases. Gold fact coverage and citation resolution are reproducible proxies; semantic groundedness is reported separately by a disclosed rubric judge. Not independent production certification.',total:results.length,passed:results.filter(r=>r.passed).length,latency_sample_size:ts.length,latency_scope:'Representative in-process calls at concurrency3; excludes hosted network and cold start',p50_ms:ts[Math.ceil(ts.length*.5)-1],p95_ms:ts[Math.ceil(ts.length*.95)-1],metrics:Object.fromEntries(Object.keys(results[0].checks).map(k=>{const rs=results.filter(r=>r.checks[k]!==null);return[k,{passed:rs.filter(r=>r.checks[k]).length,total:rs.length,rate:rs.length?rs.filter(r=>r.checks[k]).length/rs.length:null}]})),results};
await fs.writeFile(`evaluation/${live?'live':'offline'}-results.json`,JSON.stringify(report,null,2));console.log(JSON.stringify({...report,results:undefined},null,2));if(report.passed!==report.total)process.exitCode=1;
