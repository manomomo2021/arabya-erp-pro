# جدول ربط الشاشات بالجداول والأعمدة — SCREEN TABLE COLUMN MAP
================================================================

توضح هذه الوثيقة التفاصيل الدقيقة لكل شاشة ومسار في نظام Arabya ERP Pro والجداول والأعمدة المستخدمة:

| م | اسم الشاشة (Screen) | المسار (Route) | الغرض الفني والوظيفي | الجداول المصدرية (Source Tables) | الأعمدة المعروضة والمستخدمة |
|---|--------------------|----------------|----------------------|-----------------------------------|------------------------------|
| 1 | لوحة المؤشرات المركزية | `/dashboard` | عرض مؤشرات الأداء الحية، المبيعات، المشتريات، أرصدة الخزائن والمخازن | `Invoice`, `TrxH`, `Customer`, `Supplier`, `Items`, `SafeTrxH`, `HoldFile` | TotalPrice, NetPrice, OpenInvoiceAmount, InvoiceDate, Type, BalanceQty |
| 2 | اتصال قاعدة البيانات | `/database` | فحص وحالة الاتصال بـ ArabyaDB و SERVER1 وPool | Server Diagnostics, Settings | Server, Database, Pool Status, Latency, Version, Last Success, Error |
| 3 | فواتير المبيعات | `/sales/invoices` | قائمة فواتير المبيعات مع ترقيم الخادم والتصفية | `Invoice`, `Customer`, `Currency` | BranchCode, Year, Serial, Type, InvoiceDate, TargetCode, NetPrice, tafqeet, GAPosted, tafqeet |
| 4 | إنشاء فاتورة مبيعات | `/sales/invoices/new` | إنشاء فاتورة جديدة مع التحقق والتأكيد | `Invoice`, `Customer`, `Items`, `HoldFile` | BranchCode, Year, Serial, InvoiceDate, TargetCode, TotalPrice, NetPrice, VATTax, PayType |
| 5 | تفاصيل فاتورة المبيعات | `/sales/invoices/[id]` | عرض تفاصيل الفاتورة وطباعتها وتصديرها | `Invoice`, `Customer`, `InvoicePayment` | BranchCode, Year, Serial, Type, DueDate, TotalPrice, VATTax, OtherDisc, NetPrice |
| 6 | مردودات المبيعات | `/sales/returns` | فواتير مردودات المبيعات | `Invoice` (Type=Return), `Customer` | BranchCode, Year, Serial, TargetCode, InvoiceDate, NetPrice |
| 7 | فواتير المشتريات | `/purchases/invoices` | استعراض فواتير مشتريات الموردين | `Invoice` (Type=Purchase), `Supplier` | BranchCode, Year, Serial, TargetCode, InvoiceDate, TotalPrice, NetPrice |
| 8 | إنشاء فاتورة مشتريات | `/purchases/invoices/new`| إضافة فاتورة شراء مع البضاعة المستلمة | `Invoice`, `Supplier`, `Items` | BranchCode, Year, Serial, TargetCode, InvoiceDate, NetPrice, DueDate |
| 9 | دليل العملاء | `/customers` | إدارة بيانات العملاء وأرصدتهم وحدود الائتمان | `Customer`, `CustomerClassification`, `City` | CustCode, CustName, CustLatName, Telephone, Mobile, Email, CreditLimit, TaxId |
| 10 | كشف حساب عميل | `/customers/statement`| كشف حساب تفصيلي بالحركات والأرصدة | `Invoice`, `SafeTrxD`, `Customer` | InvoiceDate, Debit, Credit, Balance, Notes, Descr |
| 11 | دليل الموردين | `/suppliers` | إدارة بيانات الموردين وأرصدتهم المستحقة | `Supplier`, `SuppClassification`, `City` | SuppCode, SuppName, Telephone, Mobile, TaxId, CommercialRegNo |
| 12 | كشف حساب مورد | `/suppliers/statement`| كشف تفصيلي لحساب المورد والمستحقات | `Invoice`, `SafeTrxD`, `Supplier` | InvoiceDate, Debit, Credit, Balance, DocNo |
| 13 | دليل الأصناف | `/inventory/items` | إدارة بطاقات الأصناف والوحدات والأسعار | `Items`, `GroupMain`, `GroupSub`, `BrandCode`, `UnitCode` | ItemCode, ItemName, ItemLatName, SalesPrice, StandardCostYN, WeightItemYN |
| 14 | أرصدة المخازن | `/inventory/balances` | استعراض أرصدة المخزون لكل مخزن وموقع | `HoldFile`, `Items`, `StoreCode`, `StoreLocation` | StoreCode, Location, ItemCode, LotNo, ExpireDate, BalanceQty, CostPrice |
| 15 | حركة صنف | `/inventory/movements`| كارت الصنف التفصيلي وتتبع الوارد والمنصرف | `TrxH`, `TrxD`, `Items`, `StoreCode` | Date, Type, Serial, ItemCode, Qty, Price, StoreCode, Location |
| 16 | أذون المخازن (إضافة/صرف/تحويل)| `/inventory/transactions`| تسجيل واستعراض أذون الاستلام والصرف | `TrxH`, `TrxD`, `StoreCode` | BranchCode, Type, Year, Serial, Date, StoreCode, TotalPrice, NetPrice |
| 17 | الجرد المخزني | `/inventory/stock-taking` | إدخال الجرد الفعلي ومقارنته بالدفتري | `StockTakingH`, `StockTakingD`, `Items` | Year, Serial, Date, StoreCode, ItemCode, ActualStockQty, OriginalStockQty, TotalQtyDifference |
| 18 | التخزين المبرد — لوحة المؤشرات | `/storage` | إحصائيات بضائع العملاء، العنابر المشغولة والمتاحة | `HoldFile`, `StoreCode`, `Customer`, `TrxH` | StoreCode, Customer, ItemCode, BalanceQty, TotalWeight, ReceiptDate |
| 19 | استلام بضاعة عميل | `/storage/receipts` | إذن استلام بضاعة للتخزين وتحديد العنبر واللوت | `TrxH`, `TrxD`, `HoldFile`, `Customer` | BranchCode, Year, Serial, TargetCode, StoreCode, Location, LotNo, Qty, TotalWeight |
| 20 | صرف / تسليم بضاعة عميل | `/storage/releases` | إذن تسليم بضاعة للعميل وحساب مدة التخزين | `TrxH`, `TrxD`, `HoldFile` | ReleaseDate, ReceiptDate, Days, BillableWeight, DailyRate |
| 21 | تسعير التخزين المبرد | `/storage/pricing` | لائحة أسعار تخزين الطن/البالتة اليومية | `ContractSetup`, `Customer` | CustCode, ItemCode, DailyStorageRate, MinimumDays |
| 22 | فوترة خدمة التخزين | `/storage/billing` | إصدار فاتورة مبيعات خدمة التخزين المبرد | `Invoice`, `Customer`, `HoldFile` | Customer, PeriodFrom, PeriodTo, Days, Rate, Subtotal, Tax, NetPrice |
| 23 | تقرير مخزون التخزين وأعمار البضاعة | `/storage/reports` | تقارير مدد التخزين والتخزين غير المفوتر | `HoldFile`, `Customer`, `Items`, `StoreLocation` | CustName, ItemName, LotNo, ReceiptDate, DaysInStore, BalanceQty |
| 24 | الخزينة النقدية (المقبوضات والمدفوعات) | `/treasury/cash` | سندات القبض والصرف النقدي والتحويلات | `SafeTrxH`, `SafeTrxD`, `SafeCode` | SafeCode, TrxDate, Debit, Credit, Recip, CurrencyCode, Notes |
| 25 | البنوك وحساباتها | `/banks` | دليل الحسابات البنكية وإيداعات وسحوبات البنوك | `BankCode`, `BankBuilding`, `SafeTrxD` | BankCode, BankAraName, BankAccountNo, IBANCode, BankSwiftCode |
| 26 | حافظة الشيكات (قبض ودفع) | `/treasury/checks` | متابعة أوراق القبض والدفع والتحصيل والارتداد | `SafeTrxD`, `chkstatus`, `TrxChkStatus` | CheckNo, DueDate, BankName, Amount, LastChkStatus, LastChkStatusDate |
| 27 | دليل الحسابات (شجرة الحسابات) | `/accounting/accounts` | استعراض وإدارة دليل الحسابات العام الشجري | `Accounts`, `AccClassification`, `AccNature` | AccCode, AccAraName, ParentCode, LevelCode, Classification, Nature, NotActive |
| 28 | قيود اليومية العامة | `/accounting/journal` | تسجيل واستعراض وترحيل قيود اليومية | `TrxHeaderGA`, `TrxDetail`, `Journals` | BranchDocSerial, TrxYear, JournalCode, TrxDate, Debit, Credit, AccountCode, Notes |
| 29 | ميزان المراجعة | `/accounting/trial-balance` | ميزان المراجعة بالأرصدة والمجاميع | `TrxDetail`, `Accounts` | AccCode, AccAraName, TotalDebit, TotalCredit, BalanceDebit, BalanceCredit |
| 30 | الأستاذ العام | `/accounting/general-ledger` | كشف حساب الأستاذ العام لكل حساب | `TrxDetail`, `Accounts`, `TrxHeaderGA` | TrxDate, DocSerial, Description, Debit, Credit, Balance |
| 31 | مراكز التكلفة | `/accounting/cost-centers` | هيكل مراكز التكلفة والأرباح والخسائر للمركز | `CostCenter`, `CostCenterGroup`, `CostCenterType` | CostCenterCode, CostCenterName, ParentCodeCost, LevelCode |
| 32 | بطاقة تركيب المنتج (BOM) | `/production/bom` | مكونات التصنيع ونسب الهالك وتكاليف المواد | `ProductionBOMHeader`, `ProductionBOMDetail` | FinishedGoodsCode, BOMVersion, ItemCode, EstimatedRMQty, WastePercentage |
| 33 | أوامر الإنتاج والتصنيع | `/production/orders` | خطة التصنيع ومتابعة التشغيل وطلبات الخامات | `ProductionOrderH`, `ProductionOrderD` | ProdOrderYear, ProdOrderSerial, FinishedGoodsCode, PlannedFGQty, ActualRMQty |
| 34 | إثبات الإنتاج التام | `/production/completion` | استلام المنتج التام بالمخزن واحتساب التكلفة | `ProductionCompletionH`, `ProductionCompletionD` | ProdCompYear, ProdCompSerial, FinishedGoodsCode, ActualFGQty, ActualUnitCost |
| 35 | شؤون الموظفين والرواتب | `/hr/employees` | سجلات الموظفين والبيانات الوظيفية والمالية | `Employee`, `Jobs`, `M800_Department` | EmpCode, EmpName, EmpLatName, PersonalMobile, HireDate, JobCode |
| 36 | المستخدمون والصلاحيات | `/users` | إدارة المستخدمين وتعيين الصلاحيات والفروع والمخازن | `UserLoginLog`, `UsersStoresPermessions`, `PointOfSaleUsers`, `ArabyaERP_AppDB` | UserId, UserName, BranchCode, StoreCode, Roles, Status |
| 37 | سجل التدقيق والرقابة | `/audit` | تتبع كافة عمليات الدخول والكتابة والتعديل | `UserLoginLog`, `ArabyaERP_AppDB.AuditLog` | Timestamp, UserId, Action, Module, RecordKey, IPAddress, Result |
