import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"مراكز التكلفة"} subtitle={"هيكل مراكز التكلفة."} tables={["CostCenter", "CostCenterGroup", "CostCenterType"]} columns={["CostCenterCode", "CostCenterName", "ParentCodeCost", "LevelCode"]}/>}
