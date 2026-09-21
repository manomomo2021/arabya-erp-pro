import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"الأستاذ العام"} subtitle={"كشف حساب الأستاذ العام."} tables={["TrxDetail", "Accounts", "TrxHeaderGA"]} columns={["TrxDate", "DocSerial", "Description", "Debit", "Credit", "Balance"]}/>}
