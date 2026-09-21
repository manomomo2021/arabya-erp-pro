import { NextResponse } from 'next/server';
export async function GET(){return NextResponse.json({status:'ok',system:'Arabya ERP Pro',framework:'Next.js App Router',databaseEngine:'Microsoft SQL Server',timestamp:new Date().toISOString()});}
