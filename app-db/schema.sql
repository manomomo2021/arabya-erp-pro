/* OPTIONAL ONLY — execute against ArabyaERP_AppDB, NEVER ArabyaDB. */
IF DB_NAME() = 'ArabyaDB' THROW 51000, 'STOP: app-db schema must never run against ArabyaDB.', 1;
GO
CREATE TABLE AppUserPolicy (
  UserId nvarchar(100) NOT NULL PRIMARY KEY,
  RoleName nvarchar(100) NOT NULL,
  PermissionsCsv nvarchar(1000) NOT NULL,
  IsActive bit NOT NULL DEFAULT 1,
  UpdatedAt datetime2 NOT NULL DEFAULT SYSUTCDATETIME()
);
GO
CREATE TABLE AppAuditLog (
  AuditId bigint IDENTITY(1,1) NOT NULL PRIMARY KEY,
  Timestamp datetime2 NOT NULL DEFAULT SYSUTCDATETIME(),
  UserId nvarchar(100) NULL,
  Action nvarchar(50) NOT NULL,
  Module nvarchar(100) NOT NULL,
  Screen nvarchar(200) NOT NULL,
  RecordKey nvarchar(200) NULL,
  Details nvarchar(2000) NULL,
  IPAddress nvarchar(64) NULL,
  Status nvarchar(20) NOT NULL
);
GO
