# ARABYA ERP PRO — DATABASE CAPABILITY MAP
============================================================

## ملخص تنفيذي
- **قاعدة البيانات:** ArabyaDB
- **إجمالي الجداول:** 1220+ جدول
- **محرك البيانات:** Microsoft SQL Server
- **حالة النظام:** Production Database (Live Enterprise)

## تحذيرات أمنية حرجة
⚠️ **ممنوع تعديل Schema** - لا CREATE/ALTER/DROP لأي TABLE, COLUMN, INDEX, VIEW, PROCEDURE
⚠️ **لا Migrations تلقائية** - الهيكل الحالي هو Source of Truth
⚠️ **الكتابة محكومة** - INSERT/UPDATE/DELETE فقط على الجداول الموجودة
⚠️ **Parameterized Queries فقط** - منع SQL Injection

---

## 1. CORE MODULE — النظام الأساسي

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `Company` | CompanyCode | CompanyAraName, CompanyLatName, TaxId, CommercialReg, LogoPath | ✅ | ❌ | ⚠️ | ❌ | بيانات الشركة - قراءة فقط |
| `Branches` | BranchCode | BranchAraName, BranchEngName, NotActive | ✅ | ❌ | ⚠️ | ❌ | الفروع - نادر التعديل |
| `Period` | PeriodCode | Year, PeriodDate1, PeriodDate2, Available_GA, Available_AR | ✅ | ❌ | ✅ | ❌ | السنوات المالية |
| `Currency` | CurrencyCode | CurrencyAraName, CurrencyLatName, DecimalPlaces | ✅ | ❌ | ⚠️ | ❌ | العملات |
| `CurrencyRate` | Composite | CurrencyCode, DateAndTime, ExchangeRate | ✅ | ✅ | ❌ | ❌ | أسعار الصرف اليومية |
| `City` | CityCode | CityAraName, CityLatName | ✅ | ❌ | ⚠️ | ❌ | المدن |
| `Zone` | ZoneCode | ZoneAraName, ZoneLatName, CityCode | ✅ | ❌ | ⚠️ | ❌ | المناطق |

### Business Logic:
- BranchCode يربط جميع المعاملات بالفرع
- PeriodCode يتحكم في الفترات المالية المفتوحة للإقفال
- CurrencyRate ضروري للفواتير متعددة العملات

---

## 2. SALES & CRM MODULE — المبيعات والعملاء

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `Customer` | CustCode | CustAraName, CustLatName, CreditLimit, TaxId, Mobile, Email, Address | ✅ | ✅ | ✅ | ❌ | دليل العملاء |
| `CustomerClassification` | ClassCode | ClassAraName, ClassLatName | ✅ | ❌ | ⚠️ | ❌ | تصنيفات العملاء |
| `CustomerContactPersons` | Composite | CustCode, ContactPersonCode, ContactName, Mobile | ✅ | ✅ | ✅ | ✅ | جهات الاتصال |
| `Invoice` | BranchCode,Year,Serial,Type | TargetCode, InvoiceDate, TotalPrice, VATTax, NetPrice, OpenInvoiceAmount, GAPosted, tafqeet | ✅ | ✅ | ⚠️ | ❌ | فواتير المبيعات/المشتريات |
| `InvoicePayment` | Composite | InvoiceBranchCode, InvoiceYear, InvoiceSerial, SafeBranchCode, SafeTrxTypeCode | ✅ | ✅ | ❌ | ❌ | سداد الفواتير |
| `QuotationH` | BranchCode,Year,Serial | TargetCode, QuotationDate, TotalPrice, ValidUntil | ✅ | ✅ | ✅ | ❌ | عروض الأسعار |
| `QuotationD` | Composite | LineNo, ItemCode, Qty, UnitPrice, Discount | ✅ | ✅ | ✅ | ✅ | تفاصيل العروض |
| `OrderH` | BranchCode,Year,Serial,Type | TargetCode, OrderDate, ProcessType | ✅ | ✅ | ✅ | ❌ | أوامر المبيعات/الشراء |
| `OrderD` | Composite | LineNo, ItemCode, Qty, UnitPrice | ✅ | ✅ | ✅ | ✅ | تفاصيل الطلبات |
| `CRM_Prospect` | ProspectCode | ProspectName, SourceCode, Status | ✅ | ✅ | ✅ | ✅ | العملاء المحتملين |
| `CRMCallLog` | CallId | ProspectCode, CallDate, Notes | ✅ | ✅ | ❌ | ❌ | سجل المكالمات |

### Relationships:
- `Customer.CustCode` → `Invoice.TargetCode` (فواتير المبيعات)
- `Invoice` PK → `InvoicePayment` FK (سداد الفواتير)
- `QuotationH` PK → `QuotationD` FK (تفاصيل العرض)

### Screens Supported:
✅ `/sales/invoices` - قائمة الفواتير
✅ `/sales/invoices/new` - فاتورة جديدة
✅ `/sales/returns` - مردودات المبيعات
✅ `/customers` - دليل العملاء
✅ `/customers/statement` - كشف حساب عميل

---

## 3. PURCHASES MODULE — المشتريات والموردين

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `Supplier` | SuppCode | SuppAraName, SuppLatName, TaxId, CommercialRegNo, Mobile, Email | ✅ | ✅ | ✅ | ❌ | دليل الموردين |
| `SuppClassification` | ClassCode | ClassAraName, ClassLatName | ✅ | ❌ | ⚠️ | ❌ | تصنيفات الموردين |
| `Invoice` (Type=Purchase) | BranchCode,Year,Serial,Type | TargetCode(SuppCode), InvoiceDate, TotalPrice, NetPrice | ✅ | ✅ | ⚠️ | ❌ | فواتير المشتريات |
| `RequisitionH` | BranchCode,Year,Serial | ReqDate, DepartmentCode, TotalPrice | ✅ | ✅ | ✅ | ❌ | طلبات الشراء |
| `RequisitionD` | Composite | LineNo, ItemCode, Qty, UnitPrice | ✅ | ✅ | ✅ | ✅ | تفاصيل الطلبات |
| `ContractSupplierItems` | Composite | SuppCode, ItemCode, ContractPrice, ValidFrom, ValidTo | ✅ | ✅ | ✅ | ✅ | عقود الموردين |

### Relationships:
- `Supplier.SuppCode` → `Invoice.TargetCode` (فواتير المشتريات)
- `RequisitionH` PK → `RequisitionD` FK

### Screens Supported:
✅ `/purchases/invoices` - فواتير المشتريات
✅ `/purchases/invoices/new` - فاتورة شراء جديدة
✅ `/suppliers` - دليل الموردين
✅ `/suppliers/statement` - كشف حساب مورد

---

## 4. INVENTORY & STORES MODULE — المخازن والأصناف

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `Items` | ItemCode | ItemAraName, ItemLatName, GroupMainCode, GroupSubCode, UOMCode, SalesPrice, StandardCostYN | ✅ | ✅ | ✅ | ❌ | دليل الأصناف |
| `ItemStore` | Composite | ItemCode, StoreCode, MinQty, MaxQty, VATPercent | ✅ | ✅ | ✅ | ✅ | ربط الأصناف بالمخازن |
| `ItemStoreLocation` | Composite | ItemCode, LocationCode, BalanceQty | ✅ | ✅ | ✅ | ✅ | مواقع التخزين |
| `StoreCode` | StoreCode | StoreAraName, StoreLatName, StoreType, BranchCode | ✅ | ❌ | ⚠️ | ❌ | دليل المخازن |
| `StoreLocation` | LocationCode | LocationAraName, ParentStoreCode, LocationType | ✅ | ❌ | ⚠️ | ❌ | مواقع داخل المخازن |
| `TrxH` | BranchCode,Type,Year,Serial | StoreCode, TrxDate, TotalPrice, Notes, GAPosted | ✅ | ✅ | ⚠️ | ❌ | رؤوس الحركات المخزنية |
| `TrxD` | Composite | LineNum1, LineNum2, ItemCode, Qty, UnitPrice, LotNo, ExpireDate | ✅ | ✅ | ✅ | ✅ | تفاصيل الحركات |
| `HoldFile` | Composite | StoreCode, LocationCode, ItemCode, LotNo, ExpireDate, BalanceQty, CostPrice | ✅ | ✅ | ✅ | ✅ | أرصدة المخزن باللوت |
| `StockTakingH` | BranchCode,Year,Serial | StoreCode, StockTakeDate, Status | ✅ | ✅ | ✅ | ❌ | رؤوس الجرد |
| `StockTakingD` | Composite | ItemCode, ActualQty, OriginalQty, DifferenceQty | ✅ | ✅ | ✅ | ✅ | تفاصيل الجرد |
| `GroupMain` | GroupCode | GroupAraName, GroupLatName | ✅ | ❌ | ⚠️ | ❌ | المجموعات الرئيسية |
| `GroupSub` | GroupCode | GroupAraName, ParentGroupCode | ✅ | ❌ | ⚠️ | ❌ | المجموعات الفرعية |
| `BrandCode` | BrandCode | BrandAraName, BrandLatName | ✅ | ❌ | ⚠️ | ❌ | الماركات |
| `UnitCode` | UOMCode | UOMAraName, UOMLatName | ✅ | ❌ | ⚠️ | ❌ | وحدات القياس |

### Relationships:
- `Items.ItemCode` → `TrxD.ItemCode`, `HoldFile.ItemCode`
- `StoreCode.StoreCode` → `TrxH.StoreCode`, `HoldFile.StoreCode`
- `TrxH` PK → `TrxD` FK
- `HoldFile` يتتبع LotNo و ExpireDate

### Screens Supported:
✅ `/inventory/items` - دليل الأصناف
✅ `/inventory/balances` - أرصدة المخازن
✅ `/inventory/movements` - حركة صنف
✅ `/inventory/transactions` - أذون المخازن
✅ `/inventory/stock-taking` - الجرد المخزني

---

## 5. COLD STORAGE MODULE — التبريد والتخزين

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `HoldFile` (Bضاعة أمانة) | Composite | StoreCode, ItemCode, LotNo, TargetCode(Customer), BalanceQty, TotalWeight, ReceiptDate | ✅ | ✅ | ✅ | ✅ | تتبع بضاعة العملاء |
| `TrxH` (Type=استلام تخزين) | BranchCode,Type,Year,Serial | TargetCode, StoreCode, TrxDate | ✅ | ✅ | ⚠️ | ❌ | استلام بضاعة عميل |
| `TrxD` | Composite | ItemCode, Qty, TotalWeight, LotNo, ExpireDate | ✅ | ✅ | ✅ | ✅ | تفاصيل الاستلام/الصرف |
| `StoreCode` (StoreType=ثلاجة) | StoreCode | StoreAraName, StoreType(Cold/Freezer) | ✅ | ❌ | ⚠️ | ❌ | الثلاجات والعنابر |
| `StoreLocation` (Cold Rooms) | LocationCode | LocationAraName, ParentStoreCode, Capacity | ✅ | ❌ | ⚠️ | ❌ | غرف التبريد |
| `Customer` | CustCode | CustAraName, CreditLimit | ✅ | ✅ | ✅ | ❌ | العملاء المودعين |
| `Invoice` (Service) | BranchCode,Year,Serial,Type | TargetCode, ServiceItemCode, StorageDays, DailyRate, TotalPrice | ✅ | ✅ | ⚠️ | ❌ | فوترة التخزين |

### Business Logic:
- أيام التخزين = ExitDate - ReceiptDate
- تكلفة التخزين = BalanceQty × DailyRate × Days
- الفوترة تصدر كـ Invoice Type=Service

### Screens Supported:
✅ `/storage` - لوحة مؤشرات التخزين
✅ `/storage/receipts` - استلام بضاعة عميل
✅ `/storage/releases` - صرف بضاعة عميل
✅ `/storage/pricing` - تسعير التخزين
✅ `/storage/billing` - فوترة خدمة التخزين
✅ `/storage/reports` - تقارير التخزين وأعمار البضاعة

---

## 6. TREASURY & BANKS MODULE — الخزينة والبنوك

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `SafeCode` | SafeCode | SafeAraName, SafeLatName, BranchCode, CurrencyCode | ✅ | ❌ | ⚠️ | ❌ | دليل الخزائن |
| `SafeTrxH` | BranchCode,SafeTrxTypeCode,Year,Serial | SafeCode, TrxDate, TotalDebit, TotalCredit, Notes | ✅ | ✅ | ⚠️ | ❌ | رؤوس حركات الخزينة |
| `SafeTrxD` | Composite | TrxLine, AccCode, Debit, Credit, BankCode, ChkNo, DueDate | ✅ | ✅ | ✅ | ✅ | تفاصيل الحركات |
| `SafeTrxType` | SafeTrxTypeCode | TypeAraName, TypeLatName, AutoAccountingYN | ✅ | ❌ | ⚠️ | ❌ | أنواع الحركات |
| `BankCode` | BankCode | BankAraName, BankAccountNo, IBANCode, SwiftCode | ✅ | ❌ | ⚠️ | ❌ | البنوك |
| `BankBuilding` | BuildingCode | BankCode, BranchAraName, Address | ✅ | ❌ | ⚠️ | ❌ | فروع البنوك |
| `chkstatus` | ChkStatusCode | StatusAraName(Received, Deposited, Collected, Returned) | ✅ | ❌ | ⚠️ | ❌ | حالات الشيكات |
| `TrxChkStatus` | Composite | ChkNo, FromStatus, ToStatus, StatusDate, UserId | ✅ | ✅ | ❌ | ❌ | تتبع حالات الشيكات |

### Relationships:
- `SafeCode.SafeCode` → `SafeTrxH.SafeCode`
- `SafeTrxH` PK → `SafeTrxD` FK
- `BankCode.BankCode` → `SafeTrxD.BankCode`
- `chkstatus.ChkStatusCode` → `SafeTrxD.LastChkStatus`

### Screens Supported:
✅ `/treasury/cash` - المقبوضات والمدفوعات
✅ `/banks` - دليل البنوك
✅ `/treasury/checks` - حافظة الشيكات

---

## 7. ACCOUNTING & GL MODULE — الحسابات العامة

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `Accounts` | AccCode | AccAraName, ParentCode, LevelCode, AccKind, Classification, Nature, CurrencyCode | ✅ | ✅ | ✅ | ❌ | شجرة الحسابات |
| `AccountsLedger` | Composite | AccCode, BranchCode, Year, BalanceDebit, BalanceCredit | ✅ | ✅ | ✅ | ✅ | أرصدة الحسابات بالفروع |
| `TrxHeaderGA` | BranchDocSerial,TrxYear,JournalCode,TrxPeriod,TrxSerial | TrxDate, Description, ReferenceNo, PostedYN | ✅ | ✅ | ⚠️ | ❌ | رؤوس قيود اليومية |
| `TrxDetail` | Composite | TrxLine, AccountCode, Debit, Credit, CostCenterCode, Notes | ✅ | ✅ | ✅ | ✅ | تفاصيل القيود |
| `Journals` | JorCode | JorAraName, JorLatName, JournalType(GA,Cash,Bank,Sales,Purchase) | ✅ | ❌ | ⚠️ | ❌ | دفاتر اليومية |
| `JournalSetup` | Composite | JorCode, AccountCode, Side(Dr/Cr) | ✅ | ❌ | ⚠️ | ❌ | إعدادات القيود التلقائية |
| `CostCenter` | CostCenterCode | CostCenterAraName, ParentCodeCost, LevelCode, TypeCode | ✅ | ✅ | ✅ | ❌ | مراكز التكلفة |
| `CostCenterGroup` | GroupCode | GroupAraName, GroupLatName | ✅ | ❌ | ⚠️ | ❌ | مجموعات مراكز التكلفة |
| `SubLdgCode` | SubLdgCode | SubLdgAraName, SubLdgTypeCode | ✅ | ✅ | ✅ | ❌ | الأساتذة المساعدة |
| `AutomaticAccountingInstructions` | InstructionCode | ProcessType, AccountCode, Description | ✅ | ❌ | ⚠️ | ❌ | التوجيه المحاسبي التلقائي |

### Relationships:
- `Accounts.AccCode` → `TrxDetail.AccountCode`
- `TrxHeaderGA` PK → `TrxDetail` FK
- `Journals.JorCode` → `TrxHeaderGA.JournalCode`
- `CostCenter.CostCenterCode` → `TrxDetail.CostCenterCode`

### Screens Supported:
✅ `/accounting/accounts` - دليل الحسابات
✅ `/accounting/journal` - قيود اليومية
✅ `/accounting/trial-balance` - ميزان المراجعة
✅ `/accounting/general-ledger` - الأستاذ العام
✅ `/accounting/cost-centers` - مراكز التكلفة

---

## 8. PRODUCTION & MANUFACTURING MODULE — الإنتاج والتصنيع

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `ProductionBOMHeader` | FinishedGoodsCode,BOMVersion | BOMAraName, Status, EffectiveDate | ✅ | ✅ | ✅ | ❌ | بطاقات التركيب |
| `ProductionBOMDetail` | Composite | ProdLineNo, ItemCode(RawMaterial), EstimatedRMQty, WastePercentage | ✅ | ✅ | ✅ | ✅ | مكونات BOM |
| `ProductionOrderH` | BranchCode,ProdOrderYear,ProdOrderSerial | FinishedGoodsCode, BOMVersion, PlannedFGQty, PlanStartDate, PlanEndDate, Status | ✅ | ✅ | ✅ | ❌ | أوامر الإنتاج |
| `ProductionOrderD` | Composite | ProdLineNo, ItemCode, PlannedRMQty, ActualRMQty | ✅ | ✅ | ✅ | ✅ | صرف الخامات |
| `ProductionCompletionH` | BranchCode,ProdCompYear,ProdCompSerial | ProdOrderYear, ProdOrderSerial, CompletionDate, TotalActualCost | ✅ | ✅ | ⚠️ | ❌ | إثبات الإنتاج التام |
| `ProductionCompletionD` | Composite | ItemCode(FinishedGood), ActualFGQty, ActualUnitCost, StoreCode | ✅ | ✅ | ✅ | ✅ | تفاصيل الإثبات |
| `ProductionStandardCost` | Composite | FinishedGoodsCode, CostElementCode, StandardCost | ✅ | ✅ | ✅ | ✅ | التكاليف المعيارية |
| `RawMaterialRequestH` | BranchCode,Year,Serial | ProdOrderYear, ProdOrderSerial, RequestDate | ✅ | ✅ | ✅ | ❌ | طلبات الخامات |
| `RawMaterialRequestD` | Composite | ItemCode, RequestedQty, IssuedQty | ✅ | ✅ | ✅ | ✅ | تفاصيل الطلبات |

### Relationships:
- `ProductionBOMHeader` PK → `ProductionBOMDetail` FK
- `ProductionOrderH` PK → `ProductionOrderD` FK
- `ProductionOrderH` → `ProductionCompletionH` (عبر ProdOrderYear, ProdOrderSerial)

### Screens Supported:
✅ `/production/bom` - بطاقة تركيب المنتج
✅ `/production/orders` - أوامر الإنتاج
✅ `/production/completion` - إثبات الإنتاج التام

---

## 9. HR & PAYROLL MODULE — الموارد البشرية والرواتب

### Tables المتاحة:
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `Employee` | EmpCode | EmpAraName, EmpLatName, PersonalMobile, HireDate, JobCode, DepartmentCode, BasicSalary | ✅ | ✅ | ✅ | ❌ | سجلات الموظفين |
| `Jobs` | JobCode | JobAraName, JobLatName, JobLevel | ✅ | ❌ | ⚠️ | ❌ | الوظائف |
| `JobsGroup` | GroupCode | GroupAraName, GroupLatName | ✅ | ❌ | ⚠️ | ❌ | مجموعات الوظائف |
| `M800_Department` | DepartmentCode | DeptAraName, DeptLatName, ParentDeptCode | ✅ | ❌ | ⚠️ | ❌ | الأقسام الإدارية |
| `M800_FinalData` | Composite | EmpCode, Year, Month, BasicSalary, AllowancesTotal, DeductionsTotal, NetSalary | ✅ | ✅ | ✅ | ❌ | مسيرات الرواتب |
| `M800_TimeAttendance` | Composite | EmpCode, DateAndTime, InOutFlag, DeviceId | ✅ | ✅ | ❌ | ❌ | الحضور والانصراف |
| `M800_VacationBalances` | Composite | EmpCode, VacationTypeCode, BalanceDays, UsedDays | ✅ | ✅ | ✅ | ✅ | رصيد الإجازات |
| `M800_Loans` | LoanId | EmpCode, LoanAmount, RemainingAmount, InstallmentsCount | ✅ | ✅ | ✅ | ❌ | قروض الموظفين |

### Screens Supported:
✅ `/hr/employees` - شؤون الموظفين
✅ `/hr/attendance` - الحضور والانصراف
✅ `/hr/payroll` - مسيرات الرواتب

---

## 10. SECURITY & PERMISSIONS MODULE — الأمن والصلاحيات

### Tables المتاحة (ArabyaSC + ArabyaDB):
| الجدول | PK | الأعمدة الرئيسية | Read | Insert | Update | Delete | ملاحظات |
|--------|-----|------------------|------|--------|--------|--------|---------|
| `ArabyaSC.dbo.Users` | UserId | UserPass, Active, UserArabicName, UserLatinName, Admin, IsIT | ✅ | ❌ | ✅ | ❌ | المستخدمون |
| `ArabyaSC.dbo.BranchesPer` | Composite | UserID, BranchID, SysId(207) | ✅ | ✅ | ✅ | ✅ | صلاحيات الفروع |
| `UserLoginLog` | LogId | UserId, BranchCode, LoginDateAndTime, LogOutDateAndTime, IPAddress | ✅ | ✅ | ❌ | ❌ | سجل الدخول |
| `UsersStoresPermessions` | Composite | UserIdentification, StoreCode, DeactivateTransactionInYN, DeactivateTransactionOutYN | ✅ | ✅ | ✅ | ✅ | صلاحيات المخازن |
| `PointOfSaleUsers` | PosUserId | DiscountYN, ClearScreenYN, DeleteRowYN, ModifierYN | ✅ | ✅ | ✅ | ✅ | صلاحيات نقاط البيع |
| `PerAccounts` | Composite | UserID, AccCode, Access | ✅ | ✅ | ✅ | ✅ | صلاحيات الحسابات |
| `PerSafeCode` | Composite | TheUser, BranchCode, SafeCode, Active | ✅ | ✅ | ✅ | ✅ | صلاحيات الخزائن |
| `PerBankCode` | Composite | TheUser, BranchCode, BankCode, NotActiveYN | ✅ | ✅ | ✅ | ✅ | صلاحيات البنوك |
| `PerJournals` | Composite | TheUser, JorCode | ✅ | ✅ | ✅ | ✅ | صلاحيات دفاتر اليومية |

### Authentication Flow:
1. Login → `ArabyaSC.dbo.Users` (UserId, UserPass MD5)
2. Branch Permissions → `ArabyaSC.dbo.BranchesPer` (UserID, BranchID, SysId=207)
3. Branch Details → `ArabyaDB.dbo.Branches` (BranchCode)
4. Financial Period → `ArabyaDB.dbo.Period` (PeriodCode)

### Screens Supported:
✅ `/users` - إدارة المستخدمين
✅ `/permissions` - الصلاحيات
✅ `/audit` - سجل التدقيق

---

## 11. REPORTS MODULE — التقارير

### Reports المدعومة حسب الجداول المتاحة:

#### Accounting Reports:
- ✅ General Ledger → `TrxHeaderGA`, `TrxDetail`, `Accounts`
- ✅ Trial Balance → `TrxDetail`, `Accounts`
- ✅ Account Statement → `TrxDetail`, `Accounts`
- ✅ Cost Center Analysis → `TrxDetail`, `CostCenter`

#### Sales Reports:
- ✅ Sales Register → `Invoice` (Type=Sales)
- ✅ Sales by Customer → `Invoice`, `Customer`
- ✅ Sales by Item → `Invoice`, `InvoiceDetails`
- ✅ Customer Outstanding → `Invoice`, `Customer`

#### Purchase Reports:
- ✅ Purchase Register → `Invoice` (Type=Purchase)
- ✅ Purchase by Supplier → `Invoice`, `Supplier`
- ✅ Supplier Outstanding → `Invoice`, `Supplier`

#### Inventory Reports:
- ✅ Stock Balance → `HoldFile`, `Items`, `StoreCode`
- ✅ Stock Movement → `TrxH`, `TrxD`, `Items`
- ✅ Stock Aging → `HoldFile`, `Items`
- ✅ Batch Report → `HoldFile` (LotNo, ExpireDate)

#### Production Reports:
- ✅ Production Register → `ProductionOrderH`, `ProductionOrderD`
- ✅ BOM Cost → `ProductionBOMHeader`, `ProductionBOMDetail`
- ✅ Production Order Cost → `ProductionCompletionH`, `ProductionCompletionD`

#### Cold Storage Reports:
- ✅ Storage Transactions → `TrxH`, `TrxD`, `Customer`
- ✅ Storage Aging → `HoldFile`, `Customer`, `Items`
- ✅ Storage Utilization → `HoldFile`, `StoreLocation`

---

## 12. APP DATABASE — ArabyaERP_AppDB

### Tables المقترحة للتطبيق فقط (لا تكرر بيانات ArabyaDB):
| الجدول | الغرض | ملاحظات |
|--------|-------|---------|
| `AuditLog` | تسجيل عمليات التطبيق | UserId, Action, Module, Timestamp, IPAddress, Result |
| `UserPreferences` | تفضيلات الواجهة | UserId, Theme, Language, DashboardLayout |
| `SavedReports` | التقارير المحفوظة | UserId, ReportConfig, Filters, Columns |
| `NotificationQueue` | الإشعارات | UserId, Message, Type, ReadAt |
| `SessionMetadata` | بيانات الجلسات | SessionId, UserId, ExpiresAt, IPAddress |

---

## 13. MODULE ACTIVATION MAP

| Module | Data Support | Status | Priority |
|--------|--------------|--------|----------|
| Core | ✅ Full | Activated | P0 |
| Sales | ✅ Full | Activated | P0 |
| Purchases | ✅ Full | Activated | P0 |
| Inventory | ✅ Full | Activated | P0 |
| Cold Storage | ✅ Full | Activated | P0 |
| Treasury | ✅ Full | Activated | P1 |
| Accounting | ✅ Full | Activated | P1 |
| Production | ✅ Full | Activated | P1 |
| HR | ✅ Partial | Activated | P2 |
| Quality | ⚠️ Limited | Not Activated | P3 |
| Assets | ⚠️ Limited | Not Activated | P3 |
| Expenses | ⚠️ Via Accounting | Partial | P2 |

---

## 14. CRUD OPERATION RULES

### Create (INSERT):
- ✅ Parameterized Queries فقط
- ✅ Validation عبر Zod Schema
- ✅ Permission Check قبل التنفيذ
- ✅ Confirmation Dialog للعمليات الحرجة
- ✅ Audit Logging بعد النجاح

### Read (SELECT):
- ✅ Pagination إلزامي للنتائج الكبيرة
- ✅ Server-side Filtering
- ✅ Server-side Sorting
- ✅ Branch Filtering تلقائي
- ✅ Financial Year Filtering

### Update (UPDATE):
- ✅ Document Lock إذا كان Posted
- ✅ Version Check لمنع Overwrite
- ✅ Audit Old/New Values
- ✅ Permission Check

### Delete (DELETE):
- ❌ ممنوع للحسابات والفواتير المرتحلة
- ✅ Soft Delete عبر Flag (NotActive, Cancelled)
- ✅ Reversal Entries بدلاً من الحذف
- ✅ Confirmation Dialog إلزامي

---

## 15. API ENDPOINTS MAP

| Endpoint | Method | Module | Description |
|----------|--------|--------|-------------|
| `/api/auth/login` | POST | Auth | تسجيل الدخول عبر ERP HUB |
| `/api/auth/logout` | POST | Auth | تسجيل الخروج |
| `/api/dashboard` | GET | Dashboard | مؤشرات الأداء |
| `/api/customers` | GET/POST | Sales | إدارة العملاء |
| `/api/suppliers` | GET/POST | Purchases | إدارة الموردين |
| `/api/invoices` | GET/POST | Sales/Purchases | الفواتير |
| `/api/items` | GET/POST | Inventory | الأصناف |
| `/api/inventory/balances` | GET | Inventory | أرصدة المخازن |
| `/api/inventory/transactions` | GET/POST | Inventory | الحركات المخزنية |
| `/api/storage/receipts` | GET/POST | Cold Storage | استلام بضاعة عميل |
| `/api/storage/releases` | GET/POST | Cold Storage | صرف بضاعة عميل |
| `/api/treasury/cash` | GET/POST | Treasury | حركات الخزينة |
| `/api/accounting/journal` | GET/POST | Accounting | قيود اليومية |
| `/api/production/orders` | GET/POST | Production | أوامر الإنتاج |
| `/api/reports/*` | GET | Reports | التقارير |

---

## 16. IMPLEMENTATION PHASES

### Phase 1 (P0) - Core & Authentication:
- ✅ Database Discovery
- ✅ Capability Map
- ✅ ERP HUB Authentication
- ✅ Global Layout RTL
- ✅ Dashboard

### Phase 2 (P0) - Master Data:
- Customers
- Suppliers
- Items
- Stores & Locations

### Phase 3 (P0) - Transactions:
- Sales Invoices
- Purchase Invoices
- Inventory Transactions
- Cold Storage Receipts/Releases

### Phase 4 (P1) - Financial:
- Treasury (Cash/Banks/Checks)
- General Ledger
- Trial Balance
- Account Statements

### Phase 5 (P1) - Production:
- BOM Management
- Production Orders
- Production Completion

### Phase 6 (P2) - Reports:
- All Standard Reports
- Excel Export
- PDF Print
- Custom Report Builder

### Phase 7 (P2) - Advanced:
- User Preferences
- Saved Reports
- Notifications
- Audit Trail

---

## 17. SECURITY CHECKLIST

- [ ] No hardcoded credentials
- [ ] Parameterized queries only
- [ ] Branch filtering enforced
- [ ] Financial period validation
- [ ] Permission matrix implemented
- [ ] Audit logging active
- [ ] SQL injection prevented
- [ ] XSS prevention headers
- [ ] CSRF tokens
- [ ] Session timeout configured
- [ ] Password hashing (MD5 for legacy)
- [ ] HTTPS enforced in production

---

## 18. PERFORMANCE GUIDELINES

- Max 100 rows per page (default 25)
- Server-side pagination mandatory
- Index existing columns only (no new indexes on ArabyaDB)
- Use views for complex joins if available
- Cache master data (Customers, Items, etc.)
- Lazy load details on demand
- Debounce search inputs (300ms)
- Virtual scrolling for large tables

---

## 19. ERROR HANDLING STRATEGY

### User-Friendly Messages:
```typescript
// Instead of SQL error:
❌ "Invalid object name 'NonExistentTable'"

// Show:
✅ "حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة مرة أخرى."

// Log details server-side:
logger.error('Invoice creation failed', { userId, error, stack });
```

### Error Types:
- `ValidationError` → 400 Bad Request
- `PermissionError` → 403 Forbidden
- `NotFoundError` → 404 Not Found
- `DatabaseError` → 500 Internal Server Error
- `ConflictError` → 409 Conflict (document locked)

---

## 20. NEXT STEPS

1. ✅ Database Discovery Complete
2. ✅ Capability Map Created
3. ⏳ Implement Global Layout (RTL, Header, Sidebar)
4. ⏳ Build Dashboard with real KPIs
5. ⏳ Create reusable DataTable component
6. ⏳ Implement CRUD for Master Data
7. ⏳ Build Transaction screens
8. ⏳ Develop Report Center
9. ⏳ Add Export/Print functionality
10. ⏳ Testing & Performance optimization

---

**Document Version:** 1.0
**Last Updated:** 2025
**Status:** Ready for Implementation
**Approved By:** ERP Solution Architect
