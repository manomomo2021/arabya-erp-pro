import { query, sql } from '../db/query';
export async function dashboardStats(year:number,branch:number){
  const [sales,customers,storage,items]=await Promise.all([
    queryOne(`SELECT ISNULL(SUM(NetPrice),0) TotalSales,COUNT(*) InvoiceCount FROM Invoice WHERE Year=@y AND BranchCode=@b AND Type=1`,[{name:'y',type:sql.Int,value:year},{name:'b',type:sql.Int,value:branch}]),
    queryOne(`SELECT COUNT(*) Count FROM Customer WHERE ISNULL(NotActive,0)=0 AND (Branch=@b OR @b=0)`,[{name:'b',type:sql.Int,value:branch}]),
    queryOne(`SELECT COUNT(*) Lots,ISNULL(SUM(BalanceQty),0) Qty,ISNULL(SUM(TotalWeightKg),0) Weight FROM HoldFile WHERE ISNULL(BalanceQty,0)>0 AND (BranchCode=@b OR @b=0)`,[{name:'b',type:sql.Int,value:branch}]),
    queryOne(`SELECT COUNT(*) Count FROM Items WHERE ISNULL(NotActive,0)=0`,[])
  ]); return {sales,customers,storage,items};
}
async function queryOne<T=any>(text:string,params:any[]){const r=await query<T>(text,params);return r.recordset[0]??null;}
