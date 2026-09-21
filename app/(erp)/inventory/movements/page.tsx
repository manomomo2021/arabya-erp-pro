import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"حركة صنف"} subtitle={"كارت الصنف وتتبع الوارد والمنصرف."} tables={["TrxH", "TrxD", "Items", "StoreCode"]} columns={["Date", "Type", "Serial", "ItemCode", "Qty", "Price", "StoreCode", "Location"]}/>}
