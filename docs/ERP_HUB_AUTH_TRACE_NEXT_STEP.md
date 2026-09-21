# خطوة توثيق مصادقة ERP HUB

مشروع Arabya ERP Pro الآن يستخدم Adapter للقراءة فقط من نموذج مستخدمي ERP HUB. لا يتم إنشاء View أو Table أو Column داخل ArabyaDB من التطبيق.

## المطلوب قبل تفعيل Login الإنتاجي
1. شغّل SQL Server Profiler على نفس SQL Server الذي يظهر فيه `ApplicationName = ERP_HUB`.
2. Filter: `ApplicationName = ERP_HUB` و `DatabaseName = ArabyaDB`.
3. نفّذ Login في ERP HUB للمستخدم المطلوب.
4. في الصف الذي يحتوي على `Create View Users AS ...` أو استعلام التحقق من المستخدم، انسخ **النص الكامل** من لوحة TextData السفلية.
5. لا ترسل أي Password أو secret. أخفِ القيم السرية فقط؛ نحتاج أسماء الجداول والأعمدة وطريقة التحقق.

## متغيرات البيئة
بعد التحقق من Trace اضبط:
- `ERP_AUTH_TABLE`
- `ERP_AUTH_USER_COLUMN`
- `ERP_AUTH_PASSWORD_COLUMN`
- `ERP_AUTH_STATUS_COLUMN` (اختياري)
- `ERP_AUTH_BRANCH_COLUMN` (اختياري)
- `ERP_AUTH_PASSWORD_MODE=plaintext` فقط إذا أثبت الـTrace أن المقارنة نصية.

إذا كانت ERP HUB تستخدم hashing/encryption أو Stored Procedure، لا تستخدم mapping نصي. عدّل الـAdapter وفق الآلية المثبتة في الـTrace.
