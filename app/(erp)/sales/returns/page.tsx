import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"مردودات المبيعات"} subtitle={"فواتير Invoice ذات نوع المردود حسب تعريف قاعدة البيانات."} tables={["Invoice", "Customer"]} columns={["BranchCode", "Year", "Serial", "TargetCode", "InvoiceDate", "NetPrice"]}/>}
