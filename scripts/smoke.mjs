import fs from 'node:fs/promises';
const base=process.env.TEST_BASE_URL||'http://127.0.0.1:4173';
const headers={'Content-Type':'application/json','oai-authenticated-user-id':'smoke-reviewer','oai-authenticated-user-email':'smoke@example.test'};
const health=await fetch(base+'/health');if(!health.ok)throw Error('Health check failed');
const rpc=await fetch(base+'/mcp',{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',id:1,method:'tools/list'})});const b=await rpc.json();if(b.result?.tools?.length!==6)throw Error('MCP discovery failed');
const call=await fetch(base+'/mcp',{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',id:2,method:'tools/call',params:{name:'get_pto_balance',arguments:{employee_id:'E001'}}})});const c=await call.json();if(JSON.parse(c.result.content[0].text).remaining_days!==12)throw Error('MCP balance failed');
const report={timestamp:new Date().toISOString(),health:await health.json(),mcp_discovery:true,mcp_tool_call:true};await fs.mkdir('evaluation',{recursive:true});await fs.writeFile('evaluation/http-smoke.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
