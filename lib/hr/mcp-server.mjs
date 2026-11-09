import {employees} from './data.mjs';
import {index} from './rag.mjs';
const str={type:'string',minLength:1,maxLength:2000};
const schema=(properties,required=[])=>({type:'object',properties,required,additionalProperties:false});
export const tools=[
 {name:'search_policies',description:'Retrieve ranked fictional policy rules with page citations.',inputSchema:schema({query:str},['query'])},
 {name:'get_employee',description:'Look up the selected fictional employee only.',inputSchema:schema({employee_id:str},['employee_id'])},
 {name:'get_pto_balance',description:'Return the selected employee remaining annual leave days.',inputSchema:schema({employee_id:str},['employee_id'])},
 {name:'get_benefits',description:'Return selected employee plan and limits, not claim balances.',inputSchema:schema({employee_id:str},['employee_id'])},
 {name:'draft_email',description:'Prepare a review email draft. Does not send email.',inputSchema:schema({subject:str,body:str},['subject','body'])},
 {name:'create_hr_ticket',description:'Save a fictional HR review request only after explicit confirmation. Never approves HR actions.',inputSchema:schema({subject:str,body:str,request_key:str,confirmed:{type:'boolean'}},['subject','body','request_key','confirmed'])}
];
function validate(spec,args){
 if(!args||typeof args!=='object'||Array.isArray(args))throw Error('Arguments must be an object');
 for(const k of spec.required)if(!(k in args))throw Error(`Missing ${k}`);
 for(const [k,v] of Object.entries(args)){
  const s=spec.properties[k];if(!s)throw Error(`Unknown argument ${k}`);
  if(typeof v!==s.type)throw Error(`Invalid ${k}`);
  if(s.type==='string'&&(!v.trim()||v.length>2000))throw Error(`Invalid length for ${k}`);
 }
}
export async function callTool(name,args,context){
 const t=tools.find(t=>t.name===name);if(!t)throw Error('Unknown tool');validate(t.inputSchema,args);
 if(args.employee_id&&args.employee_id!==context.employeeId)throw Error('Employee access denied');
 const employee=employees.find(e=>e.id===context.employeeId);if(!employee)throw Error('Employee not found');
 switch(name){
  case 'search_policies':return {matches:index.search(args.query)};
  case 'get_employee':return employee;
  case 'get_pto_balance':return {employee_id:employee.id,remaining_days:employee.pto,unit:'working days',source:'Synthetic employee ledger v1'};
  case 'get_benefits':return {employee_id:employee.id,plan:employee.benefits,medical_limit_myr:2000,dental_limit_myr:500,remaining_claim_balance:null};
  case 'draft_email':return {subject:args.subject,body:args.body,status:'Draft only — not sent',recipient:'HR review team'};
  case 'create_hr_ticket':{
   if(!args.confirmed)throw Error('Explicit confirmation is required');
   if(!context.owner)throw Error('Authenticated identity required');
   if(!context.saveTicket)throw Error('Ticket storage unavailable; no request was saved');
   return context.saveTicket({id:crypto.randomUUID(),owner:context.owner,requestKey:`${context.owner}:${args.request_key}`,employee:employee.id,subject:args.subject,body:args.body,status:'Pending HR review',createdAt:new Date().toISOString()});
  }
 }
}
export async function handleRpc(message,context){
 if(!message||message.jsonrpc!=='2.0'||typeof message.method!=='string')return {jsonrpc:'2.0',id:message?.id??null,error:{code:-32600,message:'Invalid request'}};
 const {id,method,params={}}=message;let result;
 if(method==='notifications/initialized')return null;
 if(method==='server/discover')result={supportedVersions:['2026-07-28','2025-03-26'],capabilities:{tools:{}}};
 else if(method==='initialize')result={protocolVersion:'2025-03-26',capabilities:{tools:{}},serverInfo:{name:'hr-assistant',version:'1.0.0'}};
 else if(method==='tools/list')result={tools};
 else if(method==='tools/call'){
  try{result={content:[{type:'text',text:JSON.stringify(await callTool(params.name,params.arguments||{},context))}],isError:false};}
  catch(e){result={content:[{type:'text',text:e.message}],isError:true};}
 }else return {jsonrpc:'2.0',id:id??null,error:{code:-32601,message:'Method not found'}};
 return {jsonrpc:'2.0',id:id??null,result};
}
