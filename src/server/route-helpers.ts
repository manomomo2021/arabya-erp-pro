import { NextResponse } from 'next/server';
import { getSession } from './auth/session';
import { audit } from './audit/store';
export async function authOr401(){const s=await getSession(); if(!s) return {response:NextResponse.json({error:'غير مصرح. يرجى تسجيل الدخول.'},{status:401})}; return {session:s};}
export function errorResponse(e:any){const status=e?.message==='FORBIDDEN'?403:e?.message==='UNAUTHENTICATED'?401:500;return NextResponse.json({error:e?.message||'حدث خطأ غير متوقع'},{status});}
export async function writeAudit(s:any,action:string,module:string,screen:string,key:string,details:string,status:'SUCCESS'|'FAILED'='SUCCESS'){await audit(action,module,screen,key,details,s?.userId||'UNKNOWN',status);}
