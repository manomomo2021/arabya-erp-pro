import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"أوامر الإنتاج والتصنيع"} subtitle={"خطة التصنيع ومتابعة التشغيل."} tables={["ProductionOrderH", "ProductionOrderD"]} columns={["ProdOrderYear", "ProdOrderSerial", "FinishedGoodsCode", "PlannedFGQty", "ActualRMQty"]}/>}
