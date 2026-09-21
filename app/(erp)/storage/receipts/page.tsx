import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"استلام بضاعة عميل"} subtitle={"استلام مستقل للتخزين المبرد وربطه باللوط والموقع."} tables={["TrxH", "TrxD", "HoldFile", "Customer"]} columns={["BranchCode", "Year", "Serial", "TargetCode", "StoreCode", "Location", "LotNo", "Qty", "TotalWeight"]}/>}
