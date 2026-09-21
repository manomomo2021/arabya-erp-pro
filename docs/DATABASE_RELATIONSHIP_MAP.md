# خريطة العلاقات والروابط في قاعدة البيانات — DATABASE RELATIONSHIP MAP
========================================================================

تعتمد قاعدة بيانات `ArabyaDB` على روابط مفتاحية أساسية (Compound & Primary Foreign Keys) متكررة عبر مختلف الموديولات:

## 1. المفاتيح الهيكلية المشتركة (Structural Scope Keys)
- `BranchCode` (int, 4): مفتاح الفرع الرئيسي، يربط السجلات بالفرع الذي تمت فيه الحركة (Branches.BranchCode).
- `CurrencyCode` (int, 4): مفتاح العملة (Currency.CurrencyCode).
- `ExchangeRate` (float, 8): سعر الصرف المقابل للعملة الأساسية.
- `Year` (int, 4): السنة المالية للحركة.
- `Serial` (int, 4): الرقم المسلسل للحركة داخل الفرع والسنة ونوع الحركة.
- `UserId` (nvarchar, 100): كود المستخدم المنفذ للحركة.
- `CreateUserId` (nvarchar, 100): كود المستخدم المنشئ للسجل.
- `DateAndTime` / `CreateDateAndTime` (datetime, 8): طابع وقت الإنشاء والتعديل.

---

## 2. علاقات دورة المبيعات والعملاء (Sales & Customers)
- `Customer.CustCode` (PK)
  - -> `Invoice.TargetCode` (حيث Type يمثل مبيعات)
  - -> `QuotationH.TargetCode`
  - -> `OrderH.TargetCode`
  - -> `CustomerContactPersons.CustCode`
  - -> `CustomerCar.CustCode`
  - -> `CustBranchRestriction.CustCode`
  - -> `HoldFile` / `TrxH` (حيث TargetCode = كود العميل في بضاعة الأمانة والتخزين المبرد)
- `Invoice` (PK: BranchCode, Year, Serial, Type)
  - -> `InvoicePayment.InvoiceBranchCode, InvoiceYear, InvoiceSerial, InvoiceType`
  - -> `InvoiceExportInformationH.BranchCode, Year, Serial, Type`
  - -> `InvoiceExportInformationD.BranchCode, Year, Serial, Type, LineNum1, LineNum2`
  - -> ربط القيد المحاسبي التلقائي عبر: `GABranchDocSerial, GATrxYear, GAJournalCode, GATrxPeriod, GATrxSerial` -> `TrxHeaderGA`

---

## 3. علاقات دورة المشتريات والموردين (Purchases & Suppliers)
- `Supplier.SuppCode` (PK)
  - -> `Invoice.TargetCode` (حيث Type يمثل مشتريات أو مردود مشتريات)
  - -> `OrderH.TargetCode` (ProcessType = PO)
  - -> `ContractSupplierItems.SuppCode`
  - -> `SuppBranchRestriction.SuppCode`
- `OrderH` / `OrderD` (PK: BranchCode, ProcessType, Year, Serial, Type, LineNo)
  - -> ارتباط أوامر الشراء بفواتير استلام المشتريات أو أذون الإضافة المخزنية

---

## 4. علاقات المخازن وحركات المخزون والتخزين المبرد (Inventory & Storage)
- `Items.ItemCode` (nvarchar(40), PK)
  - -> `ItemStore.ItemCode` (FK مع StoreCode)
  - -> `ItemStoreLocation.ItemCode` (FK مع LocationCode)
  - -> `ItemSalesPrices.ItemCode`
  - -> `ItemPurchasePrice.ItemCode`
  - -> `TrxD.ItemCode`
  - -> `OrderD.ItemCode`
  - -> `StockTakingD.ItemCode`
  - -> `ProductionBOMDetail.FinishedGoodsCode / ItemCode`
  - -> `HoldFile.ItemCode`
- `StoreCode.StoreCode` (PK)
  - -> `StoreLocation.ParentStoreCode`
  - -> `ItemStore.StoreCode`
  - -> `TrxH.StoreCode`
  - -> `HoldFile.StoreCode`
  - -> `StockTakingH.StoreCode`
- `TrxH` / `TrxD` (حركات المخزن: إذن إضافة، إذن صرف، تحويل، استلام بضاعة عميل للتخزين المبرد):
  - المفتاح المركب: `BranchCode, Type, Year, Serial`
  - تفاصيل البنود `TrxD`: `BranchCode, Type, Year, Serial, LineNum1, LineNum2`
  - الربط مع اللوت وتاريخ الصلاحية: `LotNo, ExpireDate` -> `HoldFile`
  - الربط مع القيد المحاسبي التلقائي: `GABranchDocSerial, GATrxYear, GAJournalCode, GATrxPeriod, GATrxSerial`

---

## 5. علاقات الحسابات العامة واليومية (Accounting & General Ledger)
- `Accounts.AccCode` (nvarchar(30), PK)
  - -> `Accounts.ParentCode` (شجرة الحسابات الذاتية Hierarchy)
  - -> `AccountsLedger.AccCode`
  - -> `TrxDetail.AccountCode`
  - -> `SafeTrxD.AccCode`
  - -> `AutomaticAccountingInstructions` (OTC_*, PTP_*, SAFE_*, INV_*)
- `TrxHeaderGA` (PK: BranchDocSerial, TrxYear, JournalCode, TrxPeriod, TrxSerial, GL_SetupCode)
  - -> `TrxDetail` (نفس المفتاح + TrxLine)
  - -> `Journals.JorCode` = `TrxHeaderGA.JournalCode`
  - -> `Period.PeriodCode` = `TrxHeaderGA.TrxPeriod`

---

## 6. علاقات الخزائن والبنوك وأوراق القبض والدفع (Treasury & Cash/Banks)
- `SafeCode.SafeCode` (PK)
  - -> `SafeTrxH.SafeCode`
  - -> `Shifts.SupervisorSafe`
- `SafeTrxH` / `SafeTrxD` (PK: BranchCode, SafeTrxTypeCode, Year, Serial, TrxLine):
  - -> `SafeTrxType.SafeTrxTypeCode`
  - -> `BankCode.BankCode`
  - -> `chkstatus.ChkStatusCode` = `SafeTrxD.LastChkStatus`
  - -> `InvoicePayment.SafeBranchCode, SafeTrxTypeCode, SafeYear, SafeSerial, TrxLine`

---

## 7. علاقات الإنتاج والتصنيع (Production & BOM)
- `ProductionBOMHeader.FinishedGoodsCode, BOMVersion` (PK)
  - -> `ProductionBOMDetail.FinishedGoodsCode, BOMVersion, ProdLineNo`
  - -> `ProductionOrderH.FinishedGoodsCode, BOMVersion`
- `ProductionOrderH` / `ProductionOrderD` (PK: BranchCode, ProdOrderYear, ProdOrderSerial, ProdLineNo)
  - -> `ProductionCompletionH` / `ProductionCompletionD` (عبر ProdOrderYear, ProdOrderSerial)
