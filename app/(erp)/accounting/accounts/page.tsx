import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"دليل الحسابات"} subtitle={"شجرة الحسابات العامة."} tables={["Accounts", "AccClassification", "AccNature"]} columns={["AccCode", "AccAraName", "ParentCode", "LevelCode", "Classification", "Nature", "NotActive"]}/>}
