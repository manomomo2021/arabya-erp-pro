import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"الجرد المخزني"} subtitle={"الجرد الفعلي ومقارنته بالدفتري."} tables={["StockTakingH", "StockTakingD", "Items"]} columns={["Year", "Serial", "Date", "StoreCode", "ItemCode", "ActualStockQty", "OriginalStockQty", "TotalQtyDifference"]}/>}
