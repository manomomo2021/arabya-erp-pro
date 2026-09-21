import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"بطاقة تركيب المنتج BOM"} subtitle={"مكونات التصنيع ونسب الهالك والتكلفة القياسية."} tables={["ProductionBOMHeader", "ProductionBOMDetail"]} columns={["FinishedGoodsCode", "BOMVersion", "ItemCode", "EstimatedRMQty", "WastePercentage"]}/>}
