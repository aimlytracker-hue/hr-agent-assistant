import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '../../app/chatgpt-auth';
export async function makeContext(employeeId='E001'){
 const user=await getChatGPTUser();
 if(!user)throw Error('Sign in to use the assistant');
 const db=(env as any).DB;
 return {owner:user.userId,employeeId,saveTicket:async(t:any)=>{
  if(!db)throw Error('Ticket storage unavailable');
  await db.prepare('INSERT INTO tickets (id, owner, request_key, employee, subject, body, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(request_key) DO NOTHING').bind(t.id,t.owner,t.requestKey,t.employee,t.subject,t.body,t.status,t.createdAt).run();
  return db.prepare('SELECT id, employee, subject, body, status, created_at FROM tickets WHERE request_key = ? AND owner = ?').bind(t.requestKey,t.owner).first();
 }};
}
export async function listTickets(owner:string){
 const db=(env as any).DB;if(!db)throw Error('Ticket storage unavailable');
 return (await db.prepare('SELECT id, employee, subject, body, status, created_at FROM tickets WHERE owner = ? ORDER BY created_at DESC LIMIT 100').bind(owner).all()).results;
}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return !origin||origin===new URL(request.url).origin;}
