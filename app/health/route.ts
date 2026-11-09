import {McpClient} from '../../lib/hr/mcp-client.mjs';
import {handleRpc} from '../../lib/hr/mcp-server.mjs';
import {index} from '../../lib/hr/rag.mjs';
import {env} from 'cloudflare:workers';
export async function GET(){let storage=false;try{await (env as any).DB.prepare('SELECT count(*) AS n FROM tickets').first();storage=true;}catch{}
 const client=new McpClient((m:any)=>handleRpc(m,{employeeId:'E001'}));const catalog=await client.discover();
 return Response.json({mcp:{connected:catalog.length===6,tools:catalog.length},status:storage?'ok':'degraded',version:'1.0.0',policy_chunks:index.count,storage,model:(env as any).OPENAI_API_KEY?((env as any).OPENAI_MODEL||'gpt-6-luna'):'rules',synthetic_data:true},{status:storage?200:503});}
