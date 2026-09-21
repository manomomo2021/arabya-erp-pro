import { Dashboard } from '@/src/components/Dashboard'; import { getSession } from '@/src/server/auth/session';
export default async function Page(){const s=await getSession();return <Dashboard session={s}/>}
