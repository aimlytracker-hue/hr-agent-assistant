import {McpClient} from './mcp-client.mjs';
import {handleRpc} from './mcp-server.mjs';
export function classify(q){
 if(/\b(remote|remotely|hybrid|work from home|working from home)\b/i.test(q))return 'remote';
 if(/\b(pto|leave|vacation|holiday)\b/i.test(q))return 'pto';
 if(/\b(expense|meal|hotel|reimburse|reimbursement|receipt)\b/i.test(q))return 'expense';
 if(/\b(benefit|benefits|dental|medical|insurance|enroll|coverage)\b/i.test(q))return 'benefits';
 return 'policy';
}
export async function runAgent(input,context,provider=null){
 const started=performance.now();const q=String(input.message||'').trim();
 if(!q||q.length>2000)throw Error('Enter a question of 1 to 2000 characters');
 const client=new McpClient(m=>handleRpc(m,context));
 const base={intent:classify(q),citations:[],trace:[],steps:[],proposal:null,mode:'Grounded rules',answer:''};
 if(/ignore (all |previous |your )?instructions|system prompt|reveal.*(secret|key|password)|sk-proj-|\b\d{6}-\d{2}-\d{4}\b/i.test(q))return {...base,answer:'I cannot process credentials, identity numbers or instructions to bypass controls. Please ask an HR policy question using fictional information.',blocked:true,latency_ms:Math.round(performance.now()-started)};
 if(/\bE00[1-3]\b/i.test(q)&&!q.toUpperCase().includes(context.employeeId))return {...base,answer:'Select the fictional employee whose case you want to review. Cross-employee lookups within a case are blocked.',blocked:true,latency_ms:Math.round(performance.now()-started)};
 try{
  const catalog=await client.discover();base.steps.push('Discovered available MCP tools');
  if(provider?.plan){try{base.plan=await provider.plan(q,catalog);base.intent=base.plan.intent;base.steps.push('Model selected a bounded workflow and read-only tools');}catch{base.planning_fallback=true;}}
  const searches={pto:'annual leave request approval carryover',remote:'remote eligibility standard arrangement location',expense:/hotel/i.test(q)?'hotel evidence deadline':'meals evidence deadline',benefits:'benefits standard plan enrollment'};
  const r=await client.call('search_policies',{query:base.intent==='policy'?q:searches[base.intent]});
  base.citations=r.matches;base.steps.push('Retrieved policy evidence');
  if(!r.matches.length){base.answer='I could not find sufficient policy evidence. Please rephrase or ask HR; I will not invent a policy.';base.abstained=true;}
  else if(base.intent==='policy'){base.answer=r.matches.slice(0,3).map(p=>`${p.rule} [${p.id}]`).join('\n\n');}
  else{
   const e=await client.call('get_employee',{employee_id:context.employeeId});base.steps.push(`Checked ${e.name}'s fictional employee record`);
   const n=q.match(/(\d+(?:\.\d+)?)\s*(?:working\s*)?days?/i);const days=n?Number(n[1]):null;
   let assessment='';
   if(base.intent==='pto'){
    const b=await client.call('get_pto_balance',{employee_id:e.id});base.facts=b;
    assessment=`${e.name} has ${b.remaining_days} working days of annual leave remaining.`;
    if(days===null)assessment+=' Specify the number of working days and intended dates to assess a request.';
    else if(!Number.isInteger(days)||days<1)assessment+=' Requested leave must be a positive whole number of working days.';
    else assessment+=days<=b.remaining_days?` A ${days}-day request is within the current balance, leaving ${b.remaining_days-days} days if later approved and recorded. Manager approval and date/coverage checks remain required. [PTO-2]`:` A ${days}-day request exceeds the balance by ${days-b.remaining_days} days. HR must review alternatives; do not treat the request as approved. [PTO-2]`;
   }else if(base.intent==='remote'){
    base.facts={remoteEligible:e.remoteEligible,manager:e.manager};
    assessment=`${e.name}'s role is ${e.remoteEligible?'eligible':'not eligible'} for standard remote work. [REMOTE-1] `;
    assessment+=days===null?'Specify remote days per week and work location.':days<1||!Number.isInteger(days)?'Specify a positive whole number of remote days per week.':e.remoteEligible&&days<=2?`${days} remote days per week is within the standard limit, subject to manager approval. [REMOTE-2]`:'This arrangement requires an exception review; it is not approved. [REMOTE-2]';
    assessment+=' Work outside Malaysia requires separate review; confirm location before approval. [REMOTE-3]';
   }else if(base.intent==='expense'){
    const amount=q.match(/(?:MYR|RM)\s*(\d+(?:\.\d+)?)/i);const cap=/hotel/i.test(q)?250:60;const value=amount?Number(amount[1]):null;
    base.facts={amount_myr:value,cap_myr:cap};assessment=value===null?'Specify MYR amount, expense type, units (per person/day or per night), date, business purpose and receipt availability.':`MYR ${value} ${value<=cap?'is within':'exceeds'} the ${/hotel/i.test(q)?'per-night hotel':'per-person daily meal'} cap of MYR ${cap}. Confirm the unit, business purpose, receipt and claim date before Finance review. This does not authorize payment. [${/hotel/i.test(q)?'EXPENSE-2':'EXPENSE-1'}]`;
   }else{
    const b=await client.call('get_benefits',{employee_id:e.id});base.facts=b;assessment=`${e.name} is on the ${b.plan} plan: annual medical limit MYR ${b.medical_limit_myr}; dental limit MYR ${b.dental_limit_myr}. These are plan limits, not remaining balances. HR must confirm individual claim eligibility. [BENEFITS-1]`;
   }
   base.assessment=assessment;
   base.answer=assessment+'\n\n'+r.matches.slice(0,2).map(p=>`${p.rule} [${p.id}]`).join('\n\n');
   const draft=await client.call('draft_email',{subject:`${base.intent.toUpperCase()} review for ${e.name}`,body:assessment+'\n\nEmployee question: '+q});
   base.proposal={...draft,employee_id:e.id,request_key:crypto.randomUUID()};base.steps.push('Prepared a draft for review; nothing has been submitted');
  }
  if(provider&&!base.abstained){try{const generated=await provider({question:q,evidence:base.citations.map(p=>({id:p.id,rule:p.rule})),facts:base.facts||{},assessment:base.answer});if(generated){base.answer=(base.assessment?base.assessment+'\n\nPolicy explanation\n':'')+generated;base.mode='OpenAI + policy evidence';}}catch(e){base.provider_error='Model provider unavailable or its evidence checks failed; showing grounded rule-based result.';}}
 }catch(e){base.answer=`I could not complete the workflow: ${e.message}. No HR approval was issued.`;base.error=true;}
 base.trace=client.trace;base.latency_ms=Math.round(performance.now()-started);return base;
}

