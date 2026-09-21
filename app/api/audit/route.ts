import { NextResponse } from 'next/server'; import { getAudit } from '@/src/server/audit/store'; import { authOr401 } from '@/src/server/route-helpers';
export async function GET(){const a=await authOr401();if('response' in a)return a.response;return NextResponse.json(await getAudit());}
