import { ScreenHeader } from '@/src/components/ScreenHeader';
import { DataTable } from '@/src/components/DataTable';
import { GenericModuleScreen } from '@/src/components/GenericModuleScreen';

export default function Page() {
  return (
    <>
      <ScreenHeader
        title="البنوك وحساباتها"
        subtitle="دليل الحسابات البنكية وحركاتها."
      />
      <GenericModuleScreen
        title="البنوك وحساباتها"
        subtitle="دليل الحسابات البنكية وحركاتها."
        tables={["BankCode", "BankBuilding", "SafeTrxD"]}
        columns={["BankCode", "BankAraName", "BankAccountNo", "IBANCode", "BankSwiftCode"]}
      />
      <DataTable
        endpoint="/api/banks"
        title="البنوك"
        columns={["BankCode", "BankAraName", "BankAccountNo", "IBANCode", "BankSwiftCode"]}
      />
    </>
  );
}
