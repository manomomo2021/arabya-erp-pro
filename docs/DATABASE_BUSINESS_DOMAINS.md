# تصنيف قطاعات الأعمال والجداول — DATABASE BUSINESS DOMAINS
===========================================================

تم تصنيف جداول قاعدة البيانات (1220 جدول) إلى قطاعات ومجالات أعمال رئيسية:

## 1. CORE — النظام والشركات والفروع والسنوات
- **الجداول الأساسية:**
  - `Company`: بيانات الشركة الأم، الاسم العربي واللاتيني، العملة الأساسية، الرقم الضريبي، السجل التجاري، الشعار.
  - `Branches`: فروع الشركة، كود الفرع، الاسم العربي والإنجليزي، حسابات الوسيط بين الفروع، أوقات العمل.
  - `Period`: السنوات والفترات المالية (PeriodCode, PeriodDate1, PeriodDate2, Available_GA, Available_AR, Available_AP, Available_Cashier, etc.).
  - `Year`, `YearsDates`: السنوات والتواريخ.
  - `Currency`, `CurrencyRate`: العملات وأسعار الصرف اليومية والتاريخية.
  - `City`, `Zone`: المدن والمناطق الجغرافية.
  - `Naltionality`, `Religion`, `Gender`: الثوابت الأساسية.
  - `Levels`: المستويات الإدارية والهيكلية.

## 2. SECURITY, AUTHENTICATION & DMS
- **المستخدمون والصلاحيات في قاعدة البيانات القائمة:**
  - `UserLoginLog`: سجل تسجيل دخول وخروج المستخدمين (BranchCode, UserId, LoginDateAndTime, LogOutDateAndTime).
  - `UsersStoresPermessions`: صلاحيات المستخدمين على المخازن وحركات الإدخال والإخراج (UserIdentification, StoreCode, DeactivateTransactionInYN, DeactivateTransactionOutYN).
  - `PointOfSaleUsers`: إعدادات وصلاحيات مستخدمي نقاط البيع والمبيعات (PosUserId, DiscountYN, ClearScreenYN, DeleteRowYN, ModifierYN, etc.).
  - `PerAccounts`: صلاحيات المستخدمين على الحسابات المالية (UserID, AccCode, Access).
  - `PerSafeCode`: صلاحيات الخزائن (TheUser, BranchCode, SafeCode, Active).
  - `PerBankCode`: صلاحيات البنوك (TheUser, BranchCode, BankCode, NotActiveYN).
  - `PerJournals`: صلاحيات دفاتر اليومية (TheUser, JorCode).
  - `BranchsProcessTypePermessions`: الصلاحيات حسب نوع العملية والفرع (Branch, ProcessType).
  - `M800_ElementsPermissions`: صلاحيات بنود المرتبات للمستخدمين.
  - `M850_DMSUserPer`, `M850_DMSUserDocRevised`: صلاحيات الأرشيف الإلكتروني وإدارة الوثائق.
  - `ArabyaERP_AppDB`: قاعدة بيانات التطبيق الإضافية المستخدمة للأدوار الموسعة (RBAC) وسجلات التدقيق المتقدمة في حال عدم كفاية جداول ArabyaDB دون تعديل هيكلها.

## 3. SALES & CRM — المبيعات وإدارة علاقات العملاء
- **الجداول:**
  - `Customer`: دليل العملاء، الكود، الاسم العربي والإنجليزي، الهواتف، العناوين، التصنيف، الحد الائتماني، شروط الدفع، مندوب المبيعات، الرقم الضريبي، والفرع.
  - `CustomerClassification`, `CustomerContactPersons`, `CustomerStatus`: تصنيفات العملاء وجهات الاتصال.
  - `Invoice`: جدول فواتير المبيعات ورأس الفاتورة الرئيسي (BranchCode, Year, Serial, Type, TargetCode, CurrencyCode, ExchangeRate, InvoiceDate, NetPrice, OpenInvoiceAmount, GAPosted, tafqeet, etc.).
  - `InvoiceExportInformationH`, `InvoiceExportInformationD`: فواتير التصدير والشحن الدولي.
  - `InvoicePayment`: ربط سداد الفواتير بحركات الخزينة وسندات القبض.
  - `InvoiceSerial`, `InvoiceType`: تسلسلات وأنواع الفواتير.
  - `QuotationH`, `QuotationD`: عروض الأسعار ورؤوس وتفاصيل العروض.
  - `OrderH`, `OrderD`: أوامر المبيعات وعقود التوريد.
  - `ContractH`, `ContractD`, `ContractSetup`: عقود البيع والشراء.
  - `SalesRep`, `SalesSupervisor`: مناديب المبيعات والمشرفين وعمولاتهم.
  - `CRM_Prospect`, `CRMCallLog`, `CRMCallLogD`: إدارة العملاء المحتملين وسجل المكالمات والزيارات.

## 4. PURCHASES — المشتريات والموردين
- **الجداول:**
  - `Supplier`, `SuppClassification`, `SuppBranchRestriction`: دليل الموردين، التصنيفات، والبيانات الضريبية والتجارية.
  - `Invoice` (Type = Purchase / Purchase Return): فواتير المشتريات ومردوداتها.
  - `OrderH`, `OrderD` (ProcessType = PO / Purchase Order): أوامر الشراء.
  - `RequisitionH`, `RequisitionD`: طلبات الشراء واحتياجات الأقسام.
  - `ContractSupplierItems`: أسعار وتوريدات عقود الموردين.
  - `M150_*`: الاعتمادات المستندية، الشحنات الجمركية، التسليمات وتخصيص المصاريف على الواردات.

## 5. INVENTORY & STORES — المخزون والمخازن
- **الجداول:**
  - `Items`: دليل الأصناف (ItemCode, ItemName, ItemLatName, BrandCode, GroupMainCode, GroupSubCode, UOMCode, SalesPrice, StandardCostYN, WeightItemYN, etc.).
  - `ItemStore`: ربط الأصناف بالمخازن المسموحة ونسب الضرائب.
  - `ItemStoreLocation`: أماكن التخزين التفصيلية داخل المخزن للصنف (Store Location/Bin/Rack).
  - `StoreCode`: دليل المخازن (المخزن الرئيسي، الفرعي، ثلاجة التبريد، مخزن الخامات، مخزن التام).
  - `StoreLocation`: المواقع والتقسيمات داخل المخازن.
  - `TrxH`, `TrxD`: جدول الحركات المخزنية الرئيسي لجميع أنواع الحركات (إذن استلام، إذن صرف، تحويل بين المخازن، تسوية بالزيادة، تسوية بالعجز، بضاعة أمانة).
  - `StockTakingH`, `StockTakingD`: الجرد المخزني الفعلي، الأرصدة الدفترية والفروق والتسويات.
  - `UnitCode`, `UnitConv`: وحدات القياس ومعاملات التحويل بين الوحدات.
  - `GroupMain`, `GroupSub`, `BrandCode`, `ProductTypes`: شجرة التصنيف المخزني والمجموعات والماركات.
  - `HoldFile`, `TempHoldFile`: ملف الأرصدة والكميات المحجوزة والتواريخ وتتبع الباتشات واللوت (LotNo, ExpireDate, BalanceQty).

## 6. COLD STORAGE — التخزين المبرد وبضاعة العملاء
- **الجداول وآلية العمل:**
  - `StoreCode` (حيث StoreType يمثل ثلاجة تبريد / تجميد / عنابر).
  - `StoreLocation`: عنابر التبريد، الغرف، والصفات (Cold rooms, Racks).
  - `TrxH`, `TrxD` (حركات استلام بضاعة عميل أمانة / استلام تخزين / صرف تخزين).
  - `HoldFile`: تتبع لوتات التخزين، كميات العملاء، تواريخ الدخول، تواريخ الانتهاء، والوزن القائم والصافي.
  - `Customer`: العميل المودع للبضاعة.
  - `Items`: كود صنف التخزين أو خدمة التخزين المبرد.
  - `Invoice`: إصدار فاتورة مبيعات خدمة التخزين المبرد المعتمدة على معادلة أيام التخزين ومعدل الأجر اليومي دون تعديل بنية الجداول.

## 7. TREASURY & BANKS — الخزينة والبنوك والشيكات
- **الجداول:**
  - `SafeCode`: دليل الخزائن النقدية.
  - `SafeTrxH`, `SafeTrxD`: رأس وتفاصيل حركات الخزينة (سندات القبض، سندات الصرف، التحويل بين الخزائن، إيداعات البنوك، التحصيل بالفيزا).
  - `SafeTrxType`: أنواع حركات الخزينة والقيود المحاسبية التلقائية المرتبطة بها.
  - `BankBuilding`, `BankCode`: البنوك وفروعها وأرقام الحسابات وIBAN.
  - `SafeChkType`, `chkstatus`, `TrxChkStatus`: إدارة ومتابعة دورة حياة أوراق القبض وأوراق الدفع (استلام، إيداع للتحصيل، تحصيل، ارتداد، إلغاء).
  - `M115_CheckRegister`, `M115_CheckDesignH`, `M115_CheckDesignD`: دفاتر وتصميم الشيكات البنكية.

## 8. GENERAL LEDGER & ACCOUNTING — الحسابات العامة والأستاذ
- **الجداول:**
  - `Accounts`: شجرة ودليل الحسابات (AccCode, AccAraName, ParentCode, LevelCode, AccKind, Classification, Nature, CurrencyCode, NotActive).
  - `AccountsLedger`, `AccBranch`, `AccountBranchRestriction`: ارتباطات وقيود الحسابات بالفروع.
  - `TrxHeaderGA`, `TrxDetail`: قيود اليومية العامة (رأس وتفاصيل القيد: مدين، دائن، رقم اليومية، الفترة المالية، مركز التكلفة، حساب الأستاذ المساعد، حالة الترحيل).
  - `Journals`, `JournalSetup`: دفاتر اليومية (اليومية العامة، المقبوضات، المدفوعات، المبيعات، المشتريات، التسويات).
  - `CostCenter`, `CostCenterGroup`, `CostCenterType`: مراكز التكلفة والهيكل التوزيعي لمراكز الإنتاج والخدمات والإدارة.
  - `SubLdgType`, `SubLdgCode`: الأساتذة المساعدة (Sub-Ledgers).
  - `AutomaticAccountingInstructions`, `AutomaticAccountingInstructions2`: التوجيه المحاسبي التلقائي لجميع حركات الفواتير والمخازن والخزائن.

## 9. PRODUCTION & MANUFACTURING — الإنتاج والتكاليف والتصنيع
- **الجداول:**
  - `ProductionBOMHeader`, `ProductionBOMDetail`: شجرة وبطاقة تركيب المنتج ونسب المواد المعيارية والهوالك (Bill of Materials).
  - `ProductionOrderH`, `ProductionOrderD`: أوامر الإنتاج التشغيلية ومتابعة الخامات المصروفة والمخططة.
  - `ProductionCompletionH`, `ProductionCompletionD`: إثبات إنتاج تام وإرجاع هدر وإثبات المنتج الثانوي.
  - `ProductionStandardCost`, `ProductionRawMaterialCost`, `ProductionServiceCost`: تكاليف الخامات المعيارية والخدمات والتكاليف غير المباشرة.
  - `RawMaterialRequestH`, `RawMaterialRequestD`: طلبات خامات التشغيل.

## 10. HR & PAYROLL — الموارد البشرية والرواتب
- **الجداول:**
  - `Employee`: السجل الشامل للموظف، البيانات الشخصية والتعاقدية والمالية.
  - `Jobs`, `JobsGroup`, `M800_Department`, `M800_DepartmentSub`: الهيكل الوظيفي والإداري.
  - `M800_FinalData`, `M800_FinalDataBasicSalary`, `M800_FinalDataAllowences`, `M800_FinalDataDeductions`: مسيرات الرواتب الشهرية والسنوية.
  - `M800_TimeAttendance`, `M800_TimeAttendanceShifts`: الحضور والانصراف والورديات وأجهزة البصمة.
  - `M800_VacationBalances`, `M800_RequestVacation`: رصيد وحركات الإجازات.
  - `M800_Loans`, `M800_LoansCalculationsTrx`: السلف والقروض وأقساطها.
  - `M800_SystemParametersTaxLayers`: شرائح ضريبة كسب العمل والتأمينات الاجتماعية.
