import { getSession } from './session';
export async function requireSession(){const s=await getSession();if(!s)throw new Error('UNAUTHENTICATED');return s;}
export async function requirePermission(permission:string){const s=await requireSession();if(!s.permissions?.includes(permission))throw new Error('FORBIDDEN');return s;}
