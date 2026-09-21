import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"قيود اليومية العامة"} subtitle={"استعراض وتسجيل القيود وفق TrxHeaderGA/TrxDetail."} tables={["TrxHeaderGA", "TrxDetail", "Journals"]} columns={["BranchDocSerial", "TrxYear", "JournalCode", "TrxDate", "Debit", "Credit", "AccountCode", "Notes"]}/>}
