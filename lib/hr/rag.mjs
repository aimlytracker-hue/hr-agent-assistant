import {policies} from './data.mjs';
import persisted from './generated/vector-store.json' with {type:'json'};
const stop=new Set('a an the is are am i my me of for to and can do does how what please about with it be in on this that'.split(' '));
export function tokenize(s){return String(s).toLowerCase().match(/[a-z0-9]+/g)?.filter(w=>!stop.has(w))||[];}
const synonyms={vacation:'pto',holiday:'pto',leave:'pto',home:'remote',hybrid:'remote',reimburse:'expense',reimbursement:'expense',insurance:'benefits',medical:'benefits'};
function tokens(s){return tokenize(s).map(w=>synonyms[w]||w);}
// Atomic rule chunks preserve citations. Sparse TF-IDF vectors are reproducible embeddings.
export function buildStore(records){
 const docs=records.map(p=>({...p,terms:tokens(`${p.title} ${p.keywords} ${p.rule}`)}));
 const df={};for(const d of docs)for(const t of new Set(d.terms))df[t]=(df[t]||0)+1;
 const idf=t=>Math.log(1+docs.length/(1+(df[t]||0)));
 const vector=ts=>{const v={};for(const t of ts)v[t]=(v[t]||0)+1;for(const t in v)v[t]=(1+Math.log(v[t]))*idf(t);return v;};
 const norm=v=>Math.sqrt(Object.values(v).reduce((s,n)=>s+n*n,0))||1;
 for(const d of docs){d.vector=vector(d.terms);d.norm=norm(d.vector);}
 return {model:'local-tfidf-v1',dimensions:Object.keys(df).length,df,docs};
}
export function createIndex(records=policies,store=null){
 const {docs,df}=store||buildStore(records);
 const idf=t=>Math.log(1+docs.length/(1+(df[t]||0)));
 const vector=ts=>{const v={};for(const t of ts)v[t]=(v[t]||0)+1;for(const t in v)v[t]=(1+Math.log(v[t]))*idf(t);return v;};
 const norm=v=>Math.sqrt(Object.values(v).reduce((s,n)=>s+n*n,0))||1;
 return {count:docs.length,search(query,limit=4){
  const qt=tokens(query),q=vector(qt),qn=norm(q); if(!qt.length)return [];
  return docs.map(d=>{const cosine=Object.keys(q).reduce((s,t)=>s+q[t]*(d.vector[t]||0),0)/(qn*d.norm);const titleHit=tokens(d.title).filter(t=>qt.includes(t)).length;return {...d,score:cosine+titleHit*.035};})
   .filter(d=>d.score>=.09).sort((a,b)=>b.score-a.score).slice(0,Math.max(1,Math.min(8,limit)))
   .map(({terms,vector,norm,...p})=>({...p,score:Math.round(p.score*1000)/1000,url:`/policy/${p.id}`}));
 }};
}
export const index=createIndex(policies,persisted);
