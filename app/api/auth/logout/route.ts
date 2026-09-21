import { NextResponse } from 'next/server'; import { clearSession,getSession } from '@/src/server/auth/session'; import { audit } from '@/src/server/audit/store';
export async function POST(){const s=await getSession();await clearSession();if(s)await audit('LOGOUT','SECURITY','تسجيل الخروج',s.userId,'تسجيل خروج',s.userId);return NextResponse.json({success:true});}
