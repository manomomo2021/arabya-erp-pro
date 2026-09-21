import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"فواتير المشتريات"} subtitle={"قراءة فواتير الموردين من Invoice وفق نوع المشتريات."} tables={["Invoice", "Supplier"]} columns={["BranchCode", "Year", "Serial", "TargetCode", "InvoiceDate", "TotalPrice", "NetPrice"]}/>}
