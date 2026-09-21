import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"أرصدة المخازن"} subtitle={"أرصدة المخزون والمواقع واللوطات."} tables={["HoldFile", "Items", "StoreCode", "StoreLocation"]} columns={["StoreCode", "Location", "ItemCode", "LotNo", "ExpireDate", "BalanceQty", "CostPrice"]}/>}
