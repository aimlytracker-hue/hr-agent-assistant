// The client serializes every request and discovers the server schema before calls.
// A transport can be HTTP or an in-process JSON-RPC transport in the same Worker.
export class McpClient{
 constructor(transport){this.transport=transport;this.trace=[];this.sequence=0;this.names=new Set();}
 async request(method,params={}){
  const start=performance.now(),request={jsonrpc:'2.0',id:++this.sequence,method,params};
  try{
   const response=await this.transport(JSON.parse(JSON.stringify(request)));
   if(response?.error)throw Error(response.error.message);
   if(!response?.result)throw Error('Invalid MCP response');
   if(response.result.isError)throw Error(response.result.content?.[0]?.text||'Tool failed');
   this.trace.push({method,tool:params.name||null,arguments:params.arguments||{},duration_ms:Math.round(performance.now()-start),status:'success'});
   return response.result;
  }catch(e){this.trace.push({method,tool:params.name||null,duration_ms:Math.round(performance.now()-start),status:'error',error:e.message});throw e;}
 }
 async discover(){await this.request('server/discover');const r=await this.request('tools/list');this.names=new Set(r.tools.map(t=>t.name));return r.tools;}
 async call(name,args){if(!this.names.has(name))throw Error('Tool was not discovered');const r=await this.request('tools/call',{name,arguments:args});return JSON.parse(r.content[0].text);}
}
