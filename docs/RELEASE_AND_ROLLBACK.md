# RELEASE_AND_ROLLBACK

发布单位是 Git 提交。生产是否等于仓库 `main`，在部署后用 SHA 核对。本文件写就时，生产 SHA 未经本轮复测。

向前：

1. 备份数据库。
2. 执行 `migrations/0003_access.sql`。它只加列和表。
3. 配置登录环境变量。
4. 构建并重启 `finance-desk`。`listen.mjs` 若发现不是回环监听，会自己退出。

回滚应用：把进程指回升级前的提交并重启。不要在新代码还在跑时删掉 `expires_at`，否则确认书查询会失败。

回滚数据库，只在已经停在旧代码之后进行：

```sql
alter table fin_contract drop column if exists expires_at;
alter table fin_contract drop column if exists revoked_at;
drop table if exists fin_idem;
drop table if exists fin_desk;
drop table if exists fin_rate;
drop table if exists fin_audit;
```

回滚前再次备份。`fin_desk` 里如果已经有要保留的台账，先把 `body` 导出。
