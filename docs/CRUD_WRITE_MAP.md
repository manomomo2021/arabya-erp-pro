# خريطة عمليات الكتابة وقواعد الأمان — CRUD WRITE MAP
======================================================

تخضع جميع عمليات الإدخال والتعديل والحذف (`INSERT`, `UPDATE`, `DELETE`) للشروط الصارمة التالية:

1. **قائمة الجداول المسموح بالكتابة عليها (Write Allowlist):**
   الكتابة محصورة حصراً على الجداول المعرفة في هذا الملحق وعبر دوال Repository معتمدة فقط:
   - `Invoice` / `InvoiceExportInformation*` / `InvoicePayment` (المبيعات والمشتريات وخدمات التخزين)
   - `Customer` / `CustomerContactPersons` (بيانات العملاء)
   - `Supplier` (بيانات الموردين)
   - `Items` / `ItemStore` / `ItemStoreLocation` / `ItemSalesPrices` / `ItemPurchasePrice` (بيانات الأصناف)
   - `TrxH` / `TrxD` (حركات المخازن، استلام وتسليم بضائع التخزين المبرد)
   - `HoldFile` / `TempHoldFile` (تحديث أرصدة اللوت وتواريخ الصلاحية والوزن)
   - `SafeTrxH` / `SafeTrxD` / `TrxChkStatus` (حركات الخزينة وأوراق القبض)
   - `TrxHeaderGA` / `TrxDetail` (قيود اليومية العامة)
   - `ProductionOrderH` / `ProductionOrderD` / `ProductionCompletionH` / `ProductionCompletionD` (أوامر الإنتاج وإثبات التام)
   - `StockTakingH` / `StockTakingD` (الجرد المخزني الفعلي)
   - `Employee` (بيانات الموظفين)
   - `UserLoginLog` / `UsersStoresPermessions` (تسجيل الدخول وصلاحيات المخازن)

2. **قواعد الأمان ومنع حقن SQL (SQL Injection & Parameterization):**
   - يُمنع استقبال أي عبارة SQL أو شرط WHERE خام (`Raw Query`) من المتصفح أو الـ Client.
   - كافة الاستعلامات تستخدم معاملات مسمّاة حصراً (`@BranchCode`, `@CustCode`, `@NetPrice`, etc.).
   - استخدام محددات الأنواع الصريحة في سائق `mssql` (`sql.Int`, `sql.NVarChar`, `sql.Float`, `sql.DateTime`).

3. **المعاملات الذرية والتراجع الفوري (Transactions & Rollback):**
   - أي عملية كتابة متعددة الجداول (مثل: إضافة فاتورة + تحديث رصيد + توليد القيد المحاسبي) تُنفذ داخل Transaction واحد.
   - في حال حدوث أي خطأ، يتم تنفيذ `ROLLBACK TRANSACTION` فوراً وإرجاع رسالة خطأ عربية واضحة للمستخدم دون إظهار أسرار قاعدة البيانات.

4. **حوار التأكيد التفاعلي (Confirmation Modal Dialog):**
   - قبل تنفيذ أي إضافة أو تعديل أو حذف أو ترحيل، يُعرض نافذة تأكيد للمستخدم تحتوي على:
     - نوع الإجراء (إضافة / تعديل / حذف / ترحيل / إلغاء).
     - اسم الوحدة والشاشة.
     - المفتاح التعريفي للسجل (رقم الفاتورة، كود الصنف، رقم السند).
     - ملخص القيم التي ستتغير.
     - المستخدم وتاريخ ووقت العملية.
   - زر التأكيد النهائي باللون التحذيري المناسب مع طلب تأكيد إضافي في حالة الحذف.

5. **سياسة عدم الحذف العشوائي (Logical Cancellation Over Physical Deletion):**
   - الفواتير المرحلة (`GAPosted = 1` أو `Printed = 1`) لا تُحذف مادياً.
   - يتم تفعيل خيار إلغاء المستند أو عكس القيد (`Reversal Voucher / Credit Note`).
   - في حال كان السجل غير مرحل، يتم التحقق أولاً من عدم وجود حركات تابعة (Dependent FK Checks) قبل السماح بالحذف.
