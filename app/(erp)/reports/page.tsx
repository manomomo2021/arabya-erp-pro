import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"التقارير المركزية"} subtitle={"تقارير تعتمد على جداول ArabyaDB الموثقة ولا تنشئ جداول تقارير جديدة."} tables={["M890_*", "GlistDetail", "Rpt*"]} columns={["حسب التقرير المحدد"]}/>}
