import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"تسعير التخزين المبرد"} subtitle={"لائحة أسعار التخزين وفق الجداول الموجودة فقط."} tables={["ContractSetup", "Customer"]} columns={["CustCode", "ItemCode", "DailyStorageRate", "MinimumDays"]}/>}
