import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"كشف حساب مورد"} subtitle={"كشف تفصيلي لحساب المورد."} tables={["Invoice", "SafeTrxD", "Supplier"]} columns={["InvoiceDate", "Debit", "Credit", "Balance", "DocNo"]}/>}
