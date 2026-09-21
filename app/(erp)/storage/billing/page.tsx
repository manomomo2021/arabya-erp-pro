import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"فوترة خدمة التخزين"} subtitle={"إصدار فاتورة خدمة التخزين عبر جداول Invoice الموجودة بعد اعتماد دورة الفاتورة."} tables={["Invoice", "Customer", "HoldFile"]} columns={["Customer", "PeriodFrom", "PeriodTo", "Days", "Rate", "Subtotal", "Tax", "NetPrice"]}/>}
