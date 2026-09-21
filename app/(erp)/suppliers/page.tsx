import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"دليل الموردين"} subtitle={"دليل الموردين وفق المخطط الموثق."} tables={["Supplier", "SuppClassification", "City"]} columns={["SuppCode", "SuppName", "Telephone", "Mobile", "TaxId", "CommercialRegNo"]}/>}
