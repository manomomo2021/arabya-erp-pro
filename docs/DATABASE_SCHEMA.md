# وثيقة مواصفات وعقد قاعدة البيانات — ArabyaDB Database Schema Contract
========================================================================

## 1. ملخص النظام وقاعدة البيانات (System & Database Overview)
- **اسم النظام:** Arabya ERP Pro — نظام الإدارة المتكامل للشركة العربية
- **خادم قاعدة البيانات المستهدف:** SERVER1
- **اسم قاعدة البيانات الحالية:** ArabyaDB
- **طبيعة البيئة:** قاعدة بيانات إنتاج حقيقية ومباشرة (Live Enterprise Production Database)
- **محرك البيانات:** Microsoft SQL Server
- **سائق الاتصال:** mssql (Tedious-based official enterprise Node.js driver) مع Connection Pooling
- **عدد الجداول الإجمالي:** أكثر من 1220 جدول تشمل كافة دورات العمل المحاسبية، المخزنية، التجارية، الصناعية، والقطاعية.

---

## 2. ميثاق الحماية وعقد الحصانة الصارم (Database Immutability Contract)
يخضع التعامل مع قاعدة بيانات `ArabyaDB` للقيود التشغيلية الصارمة التالية:

1. **حظر أي تعديل على هيكل البيانات (Strict DDL Prohibition):**
   يُحظر منعاً باتاً من مستوى التطبيق ومحرك الاستعلامات تنفيذ أي أمر من الأوامر التالية:
   - `CREATE DATABASE`, `ALTER DATABASE`, `DROP DATABASE`
   - `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`, `TRUNCATE TABLE`
   - `CREATE COLUMN`, `ALTER COLUMN`, `DROP COLUMN`
   - `CREATE INDEX`, `ALTER INDEX`, `DROP INDEX`
   - `CREATE VIEW`, `ALTER VIEW`, `DROP VIEW`
   - `CREATE PROCEDURE`, `ALTER PROCEDURE`, `DROP PROCEDURE`
   - `CREATE FUNCTION`, `ALTER FUNCTION`, `DROP FUNCTION`
   - `CREATE TRIGGER`, `ALTER TRIGGER`, `DROP TRIGGER`
   - `CREATE SCHEMA`, `ALTER SCHEMA`, `DROP SCHEMA`
   - `CREATE LOGIN`, `ALTER LOGIN`, `DROP LOGIN`, `CREATE USER`, `ALTER USER`, `DROP USER`
   - `GRANT`, `REVOKE`, `DENY`

2. **منع المزامنة التلقائية والـ Migrations:**
   - يُمنع منعاً باتاً تفعيل `Prisma migrate`, `Prisma db push`, `Drizzle migration`, أو أي تقنية توليد هيكلي (Code-First / Schema Sync).
   - هيكل قاعدة بيانات `ArabyaDB` الحالية هو المصدر الوحيد للحقيقة (Single Source of Truth).

3. **قواعد عمليات الكتابة (CRUD Write Policy):**
   - العمليات المسموحة حصراً هي: `INSERT`, `UPDATE`, `DELETE` محكومة ومحصورة على الجداول الحالية فقط (`EXISTING TABLES ONLY`).
   - لا يُضاف أي عمود جديد أو جدول مساند داخل `ArabyaDB`.
   - في حال الحاجة إلى حفظ بيانات تخص النظام المستقل لا مكان لها في `ArabyaDB`، تُحفظ في قاعدة بيانات التطبيق المنفصلة `ArabyaERP_AppDB`.
   - كل عملية كتابة يجب أن تمر عبر:
     1. التحقق من الصلاحيات (Authorization Check).
     2. التحقق من صحة المدخلات بـ Zod Schema.
     3. التحقق من القيود والعلاقات وقفل المستندات المرحلة.
     4. التأكيد المسبق من المستخدم (Confirmation Dialog) يعرض تفاصيل التغيير.
     5. معاملة قاعدة بيانات ذرية (Atomic Transaction with Rollback on error).
     6. استعلامات برمجية ذات معاملات (Strictly Parameterized Queries).
     7. تسجيل حركة المراجعة والتدقيق (Audit Logging).

4. **سياسة الحذف والإلغاء (Deletion & Cancellation Policy):**
   - يُمنع الحذف الفعلي للقيود المحاسبية أو حركات المخزون أو الفواتير بعد ترحيلها (`Posted`).
   - يتم الاعتماد على الإلغاء الدفتري وعكس القيود والحركات (Reversal / Cancellation) وفق ضوابط النظام.

5. **أمان بيانات الاعتماد (Security of Credentials):**
   - لا يتم كشف اسم المستخدم أو كلمة مرور قاعدة البيانات للمتصفح.
   - يتم قراءة الاتصال من متغيرات البيئة السرية بالخادم حصراً (`process.env`).
