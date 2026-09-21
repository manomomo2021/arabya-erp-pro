import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"صرف / تسليم بضاعة عميل"} subtitle={"حساب مدة التخزين من تاريخ الاستلام حتى تاريخ التسليم."} tables={["TrxH", "TrxD", "HoldFile"]} columns={["ReleaseDate", "ReceiptDate", "Days", "BillableWeight", "DailyRate"]}/>}
