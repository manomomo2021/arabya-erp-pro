import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"دليل الأصناف"} subtitle={"بطاقات الأصناف والأسعار والوحدات."} tables={["Items", "GroupMain", "GroupSub", "BrandCode", "UnitCode"]} columns={["ItemCode", "ItemName", "ItemLatName", "SalesPrice", "StandardCostYN", "WeightItemYN"]}/>}
