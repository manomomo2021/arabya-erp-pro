# فهرس الجداول الشامل — DATABASE TABLE CATALOG (ArabyaDB)
============================================================

توثيق الجداول الرئيسية والأقسام الكبرى في قاعدة بيانات `ArabyaDB` بموجب الجرد المعتمد:

## جدول التصنيف الرئيسي للأقسام (1220 جدول)

| النطاق / المجال (Domain) | عدد الجداول التقريبي | أمثلة الجداول الرئيسية | الوظيفة ودور الشاشات | إمكانية القراءة والكتابة |
|--------------------------|---------------------|------------------------|----------------------|---------------------------|
| **CORE** (النظام والشركات والفروع والسنوات) | 40+ | `Company`, `Branches`, `Period`, `Year`, `Currency`, `CurrencyRate`, `City`, `Zone`, `Language` | تعريف المؤسسة والفروع والسنة المالية المختارة في الهيدر العام | قراءة + كتابة متحكم بها |
| **SECURITY & PERMISSIONS** | 35+ | `UserLoginLog`, `UsersStoresPermessions`, `PointOfSaleUsers`, `PerAccounts`, `PerSafeCode`, `PerBankCode`, `BranchsProcessTypePermessions` | سجلات الدخول وصلاحيات المخازن والخزائن والحسابات | قراءة + إضافة سجلات دخول |
| **SALES & CRM** | 80+ | `Customer`, `CustomerClassification`, `CustomerContactPersons`, `Invoice`, `InvoiceExportInformationH/D`, `QuotationH/D`, `OrderH/D`, `CRM_*` | دورة المبيعات والعملاء وعروض الأسعار والفواتير والتحصيلات | قراءة + إضافة/تعديل فواتير وعملاء |
| **PURCHASES** | 45+ | `Supplier`, `SuppClassification`, `RequisitionH/D`, `ContractSupplierItems`, `M150_*` (LC/Customs) | دورة المشتريات والموردين والاعتمادات والتخليص | قراءة + إضافة/تعديل مشتريات |
| **INVENTORY & STORES** | 75+ | `Items`, `ItemStore`, `ItemStoreLocation`, `ItemSalesPrices`, `HoldFile`, `StoreCode`, `StoreLocation`, `TrxH`, `TrxD`, `StockTakingH/D` | بطاقات الأصناف، الأرصدة، أذون المخازن والجرد | قراءة + حركات مخزنية معتمدة |
| **COLD STORAGE** | 25+ | `HoldFile`, `StoreLocation`, `StoreCode`, `TrxH`, `TrxD`, `Customer`, `Invoice` | استلام وصرف بضاعة العملاء، حساب أيام التخزين والوزن، والفوترة | قراءة + أذون استلام/صرف وفوترة |
| **TREASURY & BANKS** | 50+ | `SafeCode`, `SafeTrxH`, `SafeTrxD`, `BankBuilding`, `BankCode`, `chkstatus`, `TrxChkStatus`, `M115_*` | المقبوضات والمدفوعات وأوراق القبض والشيكات | قراءة + سندات قبض وصرف وشيكات |
| **ACCOUNTING & GL** | 60+ | `Accounts`, `AccountsLedger`, `AccBranch`, `TrxHeaderGA`, `TrxDetail`, `Journals`, `JournalSetup`, `CostCenter`, `SubLdgCode` | شجرة الحسابات، قيود اليومية، ميزان المراجعة، ومراكز التكلفة | قراءة + قيود يومية معتمدة |
| **PRODUCTION & BOM** | 65+ | `ProductionBOMHeader`, `ProductionBOMDetail`, `ProductionOrderH/D`, `ProductionCompletionH/D`, `ProductionStandardCost` | بطاقات المنتجات BOM وأوامر التشغيل والإنتاج التام | قراءة + أوامر إنتاج وإثبات تام |
| **HR & PAYROLL** | 250+ | `Employee`, `Jobs`, `JobsGroup`, `M800_*` (FinalData, BasicSalary, Attendance, Vacations, Shifts) | شؤون العاملين، الحضور والانصراف، مسيرات الرواتب | قراءة + حركة موظفين |
| **INTEGRATION (ERP Bridges)** | 80+ | `M801_*` (Fusion, SAP, JDE, F0911Z1) | الربط والتصدير لأنظمة الشركات العالمية والـ AAIs | قراءة وتصدير |
| **SPECIALIZED SECTORS** | 300+ | `M500_*` (Contracting), `M506_*` (Auto Job Orders), `M510_*` (Real Estate), `M515_*` (Security Guards), `M516_*` (CIT & Armored), `M520_*` (Gas Stations), `M540_*` (Fleet/Transport), `M550_*` (Medical/Incubators), `M730_*` (Schools) | وحدات قطاعية متخصصة | قراءة وعرض متخصص |
| **DMS (Documents)** | 40+ | `M850_*` (Documents, DocType, BriefCase, Attributes) | الأرشفة الإلكترونية وإدارة الوثائق | قراءة وأرشفة |
| **BI & REPORTING** | 30+ | `M890_*`, `GlistDetail`, `Rpt*` | محرك التقارير الديناميكية واستخراج البيانات | قراءة وطباعة وتصدير |
