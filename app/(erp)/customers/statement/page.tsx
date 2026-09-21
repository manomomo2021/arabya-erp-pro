import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"كشف حساب عميل"} subtitle={"كشف حركة العميل من الفواتير والحركات المالية."} tables={["Invoice", "SafeTrxD", "Customer"]} columns={["InvoiceDate", "Debit", "Credit", "Balance", "Notes", "Descr"]}/>}
