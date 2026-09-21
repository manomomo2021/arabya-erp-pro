import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"إنشاء فاتورة شراء"} subtitle={"شاشة إدخال منفصلة. الكتابة تحتاج اعتماد تفاصيل دورة Invoice + التفاصيل + المخزون قبل الإنتاج."} tables={["Invoice", "Supplier", "Items"]} columns={["BranchCode", "Year", "Serial", "TargetCode", "NetPrice", "DueDate"]}/>}
