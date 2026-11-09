import {handleRpc} from '../../lib/hr/mcp-server.mjs';
import {makeContext,sameOrigin} from '../../lib/hr/context';
export async function POST(request:Request){
 try{
  if(!sameOrigin(request))return Response.json({error:'Origin denied'},{status:403});
  const raw=await request.text();if(raw.length>12000)return Response.json({error:'Request too large'},{status:413});
  const message=JSON.parse(raw),ctx=await makeContext(request.headers.get('x-demo-employee')||'E001');
  const result=await handleRpc(message,ctx);return result?Response.json(result):new Response(null,{status:202});
 }catch(e:any){return Response.json({jsonrpc:'2.0',id:null,error:{code:-32000,message:e.message}},{status:400});}
}
export async function GET(){return new Response(null,{status:405,headers:{Allow:'POST'}});}
