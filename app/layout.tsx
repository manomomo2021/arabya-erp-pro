import './globals.css';
import type { Metadata } from 'next';
export const metadata:Metadata={title:'Arabya ERP Pro',description:'نظام الإدارة المتكامل للشركة العربية'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}
