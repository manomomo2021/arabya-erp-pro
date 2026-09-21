import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"إثبات الإنتاج التام"} subtitle={"استلام المنتج التام واحتساب التكلفة."} tables={["ProductionCompletionH", "ProductionCompletionD"]} columns={["ProdCompYear", "ProdCompSerial", "FinishedGoodsCode", "ActualFGQty", "ActualUnitCost"]}/>}
