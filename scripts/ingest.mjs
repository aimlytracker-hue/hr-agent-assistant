import fs from 'node:fs';
import path from 'node:path';
import {buildStore} from '../lib/hr/rag.mjs';
export function parseDocument(text,source){
 const cleaned=text.replace(/\r\n/g,'\n').replace(/\u0000/g,'');
 const sections=cleaned.split(/^(?:##|SECTION) /m).slice(1);
 return sections.map(section=>{
  const [heading,meta,...body]=section.trim().split('\n');
  const [id,title]=heading.split(' | ');if(!/^\w+-\d+$/.test(id)||!meta.startsWith('META '))throw Error('Malformed section in '+source);
  const text=body.join('\n').trim(),rule=text.split('\n\n')[0];
  return {id,title,...JSON.parse(meta.slice(5)),rule,text,source,document_id:path.basename(source,path.extname(source)),snippet:rule};
 });
}
const records=fs.readdirSync('corpus').filter(f=>/\.(md|txt)$/.test(f)).sort().flatMap(f=>parseDocument(fs.readFileSync('corpus/'+f,'utf8'),'corpus/'+f)).sort((a,b)=>a.page-b.page);
if(records.length!==30||new Set(records.map(p=>p.id)).size!==30)throw Error('Expected 30 unique rule sections');
const outputs={'lib/hr/generated/policies.json':records,'lib/hr/generated/vector-store.json':buildStore(records)};
for(const [file,data] of Object.entries(outputs)){
 const content=JSON.stringify(data,null,2)+'\n';
 if(process.argv.includes('--check')){if(fs.readFileSync(file,'utf8')!==content)throw Error('Stale ingestion output: '+file);}else fs.writeFileSync(file,content);
}
console.log(JSON.stringify({documents:6,formats:['markdown','text'],chunks:records.length,model:'local-tfidf-v1',persisted:true}));
