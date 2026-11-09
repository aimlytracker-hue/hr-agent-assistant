import {runAgent} from '../../../lib/hr/agent.mjs';
import {makeContext,sameOrigin} from '../../../lib/hr/context';
import {createProvider} from '../../../lib/hr/provider.mjs';
import {env} from 'cloudflare:workers';
export async function POST(request:Request){
 try{
  if(!sameOrigin(request))return Response.json({error:'Origin denied'},{status:403});
  const raw=await request.text();if(raw.length>4000)return Response.json({error:'Question too long'},{status:413});
  const input=JSON.parse(raw),ctx=await makeContext(input.employee_id);
  const result=await runAgent(input,ctx,createProvider(env));
  console.log(JSON.stringify({event:'hr_workflow',intent:result.intent,latency_ms:result.latency_ms,mode:result.mode,error:!!result.error,tools:result.trace.length}));
  return Response.json(result);
 }catch(e:any){return Response.json({error:e.message},{status:400});}
}
