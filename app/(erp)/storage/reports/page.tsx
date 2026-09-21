import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"تقارير التخزين"} subtitle={"أعمار البضاعة والتخزين غير المفوتر."} tables={["HoldFile", "Customer", "Items", "StoreLocation"]} columns={["CustName", "ItemName", "LotNo", "ReceiptDate", "DaysInStore", "BalanceQty"]}/>}
