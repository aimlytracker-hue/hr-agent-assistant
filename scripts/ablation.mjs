import fs from 'node:fs';
import {index} from '../lib/hr/rag.mjs';
const cases=[
 {query:'annual leave request approval carryover',gold:['PTO-1','PTO-2','PTO-3']},
 {query:'remote eligibility standard arrangement location',gold:['REMOTE-1','REMOTE-2','REMOTE-3']},
 {query:'meals evidence deadline',gold:['EXPENSE-1','EXPENSE-3']},
 {query:'hotel evidence deadline',gold:['EXPENSE-2','EXPENSE-3']},
 {query:'benefits standard plan enrollment',gold:['BENEFITS-1','BENEFITS-2']},
 {query:'devices networks approved corporate VPN security',gold:['SECURITY-2']}
];
const results=[1,2,4,8].map(k=>{
 const rows=cases.map(c=>{const ids=index.search(c.query,k).map(p=>p.id),hits=c.gold.filter(id=>ids.includes(id)).length;return {...c,retrieved:ids,recall:hits/c.gold.length,precision:hits/ids.length};});
 return {k,macro_recall:rows.reduce((s,r)=>s+r.recall,0)/rows.length,macro_precision:rows.reduce((s,r)=>s+r.precision,0)/rows.length,rows};
});
fs.writeFileSync('evaluation/retrieval-ablation.json',JSON.stringify({scope:'Six fixed retrieval probes; recall against authored relevant sections. Corpus and chunking held constant.',results},null,2));console.log(results.map(({k,macro_recall,macro_precision})=>({k,macro_recall,macro_precision})));
