import { query, queryOne, sql } from './query';
import { withTransaction, txQuery } from './transaction';

export async function customers(branch?: number) {
  let text=`SELECT TOP (500) CustCode,CustName,CustLatName,Telephone,Mobile,Email,CreditLimit,PaymentTerm,DiscountPercent,TaxId,Branch,ISNULL(Balance,0) Balance,ISNULL(NotActive,0) NotActive,ISNULL(StorageCustomerYN,0) StorageCustomerYN FROM Customer WHERE ISNULL(NotActive,0)=0`;
  const p:any[]=[]; if(branch){text+=` AND Branch=@branch`;p.push({name:'branch',type:sql.Int,value:branch});} text+=` ORDER BY CustCode`;
  return (await query(text,p)).recordset;
}
export async function createCustomer(d:any) {
  return withTransaction(async tx => { await txQuery(tx,'Customer',`INSERT INTO Customer (CustCode,CustName,CustLatName,Telephone,Mobile,Email,StreetArea,PersonToConnect,CreditLimit,TaxId,Branch,NotActive,Balance,StorageCustomerYN)
    VALUES(@code,@name,@lat,@tel,@mobile,@email,@street,@contact,@limit,@tax,@branch,0,0,@storage)`,[
      {name:'code',type:sql.Int,value:Number(d.CustCode)}, {name:'name',type:sql.NVarChar(200),value:d.CustName}, {name:'lat',type:sql.VarChar(200),value:d.CustLatName||null},
      {name:'tel',type:sql.VarChar(50),value:d.Telephone||null},{name:'mobile',type:sql.VarChar(50),value:d.Mobile||null},{name:'email',type:sql.VarChar(100),value:d.Email||null},
      {name:'street',type:sql.NVarChar(250),value:d.StreetArea||null},{name:'contact',type:sql.NVarChar(150),value:d.PersonToConnect||null},{name:'limit',type:sql.Float,value:Number(d.CreditLimit||0)},
      {name:'tax',type:sql.VarChar(50),value:d.TaxId||null},{name:'branch',type:sql.Int,value:Number(d.Branch||1)},{name:'storage',type:sql.Bit,value:d.StorageCustomerYN?1:0}
    ]); });
}
export async function updateCustomer(id:number,d:any) { return withTransaction(async tx => txQuery(tx,'Customer',`UPDATE Customer SET CustName=@name,Telephone=@tel,Mobile=@mobile,Email=@email,CreditLimit=@limit,TaxId=@tax,StreetArea=@street WHERE CustCode=@id`,[
  {name:'id',type:sql.Int,value:id},{name:'name',type:sql.NVarChar(200),value:d.CustName},{name:'tel',type:sql.VarChar(50),value:d.Telephone||null},{name:'mobile',type:sql.VarChar(50),value:d.Mobile||null},{name:'email',type:sql.VarChar(100),value:d.Email||null},{name:'limit',type:sql.Float,value:Number(d.CreditLimit||0)},{name:'tax',type:sql.VarChar(50),value:d.TaxId||null},{name:'street',type:sql.NVarChar(250),value:d.StreetArea||null} ])); }
export async function invoices(year:number,branch?:number,type=1) { let text=`SELECT TOP (500) BranchCode,Year,Serial,Type,TargetCode,CurrencyCode,ExchangeRate,CONVERT(varchar(10),InvoiceDate,120) InvoiceDate,PayType,CONVERT(varchar(10),DueDate,120) DueDate,TotalPrice,TotalDiscAmount,VATTax,OtherDisc,NetPrice,OpenInvoiceAmount,GAPosted,UserId,CONVERT(varchar(19),DateAndTime,120) DateAndTime FROM Invoice WHERE Year=@year AND Type=@type`; const p:any[]=[{name:'year',type:sql.Int,value:year},{name:'type',type:sql.Int,value:type}]; if(branch){text+=` AND BranchCode=@branch`;p.push({name:'branch',type:sql.Int,value:branch});} text+=` ORDER BY Serial DESC`; return (await query(text,p)).recordset; }
export async function storageBatches(store?:number) { let text=`SELECT TOP (500) h.BranchCode,h.ItemCode,h.StoreCode,h.Location,CONVERT(varchar(10),h.ExpireDate,120) ExpireDate,h.LotNo,ISNULL(h.OriginalQty,0) OriginalQty,ISNULL(h.BalanceQty,0) BalanceQty,CONVERT(varchar(10),h.Date,120) ReceiptDate,ISNULL(h.TotalWeightKg,0) TotalWeightKg,ISNULL(h.DailyRate,0) DailyRate,h.CustCode,c.CustName,i.ItemName,DATEDIFF(day,h.Date,GETDATE()) StorageDays FROM HoldFile h LEFT JOIN Customer c ON c.CustCode=h.CustCode LEFT JOIN Items i ON i.ItemCode=h.ItemCode WHERE ISNULL(h.BalanceQty,0)>0`; const p:any[]=[]; if(store){text+=` AND h.StoreCode=@store`;p.push({name:'store',type:sql.Int,value:store});} text+=` ORDER BY h.Date`; return (await query(text,p)).recordset; }
export async function dbStats() { return queryOne<any>(`SELECT (SELECT COUNT(*) FROM sys.tables) TotalTables,(SELECT COUNT(*) FROM sys.columns) TotalColumns,(SELECT COUNT(*) FROM sys.views) TotalViews`); }
export async function discoverUsers() { return (await query<any>(`SELECT TOP (500) UserId,MAX(LoginDateAndTime) LastLogin,COUNT(*) LoginCount FROM UserLoginLog WHERE NULLIF(LTRIM(RTRIM(UserId)),'') IS NOT NULL GROUP BY UserId ORDER BY MAX(LoginDateAndTime) DESC`)).recordset; }

export async function userExists(userId:string) {
  const r=await queryOne<any>(`SELECT TOP 1 UserId FROM UserLoginLog WHERE UserId=@u`,[{name:'u',type:sql.NVarChar(100),value:userId}]);
  return !!r;
}
export async function userStores(userId:string) {
  const permDb = process.env.ERP_BRANCH_PERMISSION_DATABASE;
  const permSchema = process.env.ERP_BRANCH_PERMISSION_SCHEMA || 'dbo';
  const table = permDb ? `[${permDb}].${permSchema}.[UsersStoresPermessions]` : 'UsersStoresPermessions';
  return (await query<any>(`SELECT BranchCode,UserIdentification,StoreCode,DeactivateTransactionInYN,DeactivateTransactionOutYN,ISNULL(NotActive,0) NotActive FROM ${table} WHERE UserIdentification=@u AND ISNULL(NotActive,0)=0`,[{name:'u',type:sql.NVarChar(100),value:userId}])).recordset;
}
export async function logLogin(userId:string,branch:number) { return withTransaction(async tx => txQuery(tx,'UserLoginLog',`INSERT INTO UserLoginLog(BranchCode,UserId,LoginDateAndTime) VALUES(@b,@u,GETDATE())`,[{name:'b',type:sql.Int,value:branch},{name:'u',type:sql.NVarChar(100),value:userId}])); }
