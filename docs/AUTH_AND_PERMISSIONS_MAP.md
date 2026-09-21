# خريطة التحقق والمصادقة والصلاحيات — AUTH & PERMISSIONS MAP
============================================================

## 1. تحليل نظام المستخدمين في قاعدة بيانات ArabyaDB القائمة
من خلال فحص الجداول الموجودة في `ArabyaDB`:
- `UserLoginLog`: يحتوي على أعمدة:
  - `BranchCode` (int)
  - `UserId` (nvarchar(100))
  - `LoginDateAndTime` (datetime)
  - `LogOutDateAndTime` (datetime)
- `UsersStoresPermessions`: يحتوي على:
  - `BranchCode` (int)
  - `UserIdentification` (nvarchar(100))
  - `StoreCode` (int)
  - `DeactivateTransactionInYN` (bit)
  - `DeactivateTransactionOutYN` (bit)
  - `NotActive` (bit)
- `PointOfSaleUsers`: يحتوي على إعدادات وصلاحيات مستخدمي المبيعات ونقاط البيع.
- `PerAccounts`, `PerSafeCode`, `PerBankCode`, `PerJournals`: تحدد وصول المستخدمين لحسابات وخزائن وبنوك ودفاتر معينة.
- `BranchsProcessTypePermessions`: تحدد صلاحيات المستخدمين حسب نوع الحركة بالفرع.

## 2. استراتيجية المصادقة والصلاحيات للنظام الجديد
1. **المستخدمون الحاليون (Existing Database Users):**
   - يدعم النظام قراءة المستخدمين الموجودين في `UserLoginLog` و `PointOfSaleUsers` و `Employee` (حيث EmpUserId).
   - تسجيل عمليات الدخول والخروج فورياً في `UserLoginLog`.

2. **قاعدة بيانات التطبيق الموازية (ArabyaERP_AppDB):**
   - وفق العقد الصارم: ممنوع إضافة أي جدول أو عمود إلى `ArabyaDB`.
   - لذلك، تُحفظ بيانات الأدوار المتقدمة (Roles)، شاشات الصلاحيات التفصيلية (Screen & Action Permissions)، وتشفير الجلسات الآمن داخل قاعدة بيانات التطبيق الملحقة `ArabyaERP_AppDB`.
   - لا تتأثر قاعدة `ArabyaDB` الإنتاجية بأي تعديل هيكلي إطلاقاً.

3. **مستويات الصلاحيات المطبقة (Granular Permissions):**
   - **صلاحيات الإجراءات (Action Permissions):**
     - عرض (View)
     - إضافة (Add)
     - تعديل (Edit)
     - حذف (Delete)
     - طباعة (Print)
     - تصدير Excel/PDF (Export)
     - اعتماد / ترحيل (Approve / Post)
     - إلغاء / عكس (Cancel / Reverse)
   - **صلاحيات النطاق الجغرافي والإداري (Scope Permissions):**
     - الفروع المصرح بها (Allowed Branches)
     - المخازن وثلاجات التبريد المصرح بها (Allowed Stores & Cold Storage)
     - الخزائن المصرح بها (Allowed Safes)
     - السنة المالية النشطة المختارة في الهيدر العام (Active Financial Year)
