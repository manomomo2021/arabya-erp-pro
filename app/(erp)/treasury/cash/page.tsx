import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"الخزينة النقدية"} subtitle={"المقبوضات والمدفوعات والتحويلات."} tables={["SafeTrxH", "SafeTrxD", "SafeCode"]} columns={["SafeCode", "TrxDate", "Debit", "Credit", "Recip", "CurrencyCode", "Notes"]}/>}
