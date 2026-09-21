import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"أذون المخازن"} subtitle={"إضافة وصرف وتحويل وفق TrxH/TrxD."} tables={["TrxH", "TrxD", "StoreCode"]} columns={["BranchCode", "Type", "Year", "Serial", "Date", "StoreCode", "TotalPrice", "NetPrice"]}/>}
