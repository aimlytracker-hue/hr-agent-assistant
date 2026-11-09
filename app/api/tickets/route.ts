import {makeContext,listTickets,sameOrigin} from '../../../lib/hr/context';
import {McpClient} from '../../../lib/hr/mcp-client.mjs';
import {handleRpc} from '../../../lib/hr/mcp-server.mjs';
export async function GET(){try{const c=await makeContext();return Response.json({tickets:await listTickets(c.owner)});}catch(e:any){return Response.json({error:e.message},{status:400});}}
export async function POST(request:Request){
 try{
  if(!sameOrigin(request))return Response.json({error:'Origin denied'},{status:403});
  const raw=await request.text();if(raw.length>8000)return Response.json({error:'Request too large'},{status:413});
  const b=JSON.parse(raw),ctx=await makeContext(b.employee_id);const client=new McpClient((m:any)=>handleRpc(m,ctx));await client.discover();
  const ticket=await client.call('create_hr_ticket',{subject:b.subject,body:b.body,request_key:b.request_key,confirmed:b.confirmed});
  return Response.json({ticket,trace:client.trace});
 }catch(e:any){return Response.json({error:e.message},{status:400});}
}
