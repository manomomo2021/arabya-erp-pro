import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';
export default function Page(){return <GenericModuleScreen title={"شؤون الموظفين والرواتب"} subtitle={"سجلات الموظفين والبيانات الوظيفية."} tables={["Employee", "Jobs", "M800_Department"]} columns={["EmpCode", "EmpName", "EmpLatName", "PersonalMobile", "HireDate", "JobCode"]}/>}
