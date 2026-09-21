export class DDLViolationError extends Error {}
export class UnauthorizedTableError extends Error {}

const FORBIDDEN = [
  /\bCREATE\s+(DATABASE|TABLE|VIEW|PROCEDURE|FUNCTION|TRIGGER|INDEX|SCHEMA|USER|LOGIN|ROLE)\b/i,
  /\bALTER\s+(DATABASE|TABLE|VIEW|PROCEDURE|FUNCTION|TRIGGER|INDEX|SCHEMA|USER|LOGIN|ROLE)\b/i,
  /\bDROP\s+(DATABASE|TABLE|VIEW|PROCEDURE|FUNCTION|TRIGGER|INDEX|SCHEMA|USER|LOGIN|ROLE)\b/i,
  /\bTRUNCATE\s+TABLE\b/i, /\bGRANT\b/i, /\bREVOKE\b/i, /\bDENY\b/i,
  /\bEXEC\s+(sp_|xp_)/i,
];

export const WRITE_PERMITTED_TABLES = new Set([
  'Customer','CustomerContactPersons','Supplier','Items','ItemStore','ItemStoreLocation','ItemSalesPrices','ItemPurchasePrice',
  'Invoice','InvoiceExportInformationH','InvoiceExportInformationD','InvoicePayment','HoldFile','TempHoldFile','TrxH','TrxD',
  'SafeTrxH','SafeTrxD','TrxChkStatus','TrxHeaderGA','TrxDetail','ProductionOrderH','ProductionOrderD','ProductionCompletionH',
  'ProductionCompletionD','StockTakingH','StockTakingD','Employee','UserLoginLog','UsersStoresPermessions'
]);

export function validateSQLSafety(text: string) {
  const clean = text.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
  for (const p of FORBIDDEN) if (p.test(clean)) throw new DDLViolationError('تم حظر أمر DDL/صلاحيات. ArabyaDB محمية من أي تغيير هيكلي.');
}
export function validateWriteTarget(table: string) {
  const clean = table.replace(/[\[\]\s]/g, '');
  if (!WRITE_PERMITTED_TABLES.has(clean)) throw new UnauthorizedTableError(`الكتابة على [${clean}] غير مسموحة من طبقة التطبيق.`);
}
