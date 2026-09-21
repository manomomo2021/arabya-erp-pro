import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"حافظة الشيكات"} subtitle={"متابعة أوراق القبض والدفع والتحصيل والارتداد."} tables={["SafeTrxD", "chkstatus", "TrxChkStatus"]} columns={["CheckNo", "DueDate", "BankName", "Amount", "LastChkStatus", "LastChkStatusDate"]}/>}
