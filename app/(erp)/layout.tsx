import { getSession } from '@/src/server/auth/session';
import { ErpShell } from '@/src/components/ErpShell';
import { redirect } from 'next/navigation';
export default async function ErpLayout({children}:{children:React.ReactNode}){const session=await getSession();if(!session)redirect('/login');return <ErpShell session={session}>{children}</ErpShell>}
