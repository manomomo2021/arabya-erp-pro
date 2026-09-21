import { NextResponse } from 'next/server'; import { testDBConnection } from '@/src/server/db/connection'; import { authOr401 } from '@/src/server/route-helpers';
export async function GET(){const a=await authOr401();if('response' in a)return a.response;return NextResponse.json(await testDBConnection());}
