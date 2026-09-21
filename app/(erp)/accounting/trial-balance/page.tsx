import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"ميزان المراجعة"} subtitle={"ميزان المراجعة بالمجاميع والأرصدة."} tables={["TrxDetail", "Accounts"]} columns={["AccCode", "AccAraName", "TotalDebit", "TotalCredit", "BalanceDebit", "BalanceCredit"]}/>}
