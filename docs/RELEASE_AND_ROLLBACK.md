# RELEASE_AND_ROLLBACK

发布单位是 Git 提交。生产是否等于仓库 `main`，在部署后用 SHA 核对。本文件写就时，生产 SHA 未经本轮复测。

向前：

1. 备份数据库。
2. 执行 `migrations/0003_access.sql`。它只加列和表。
3. 配置登录环境变量：`FINANCE_SESSION_SECRET`、`FINANCE_OWNER_PASSWORD`、`FINANCE_SUPPORT_PASSWORD`、`FINANCE_DATA_KEY`。四项都不要写进仓库。`FINANCE_DATA_KEY` 至少 32 位，并且不要复用会话密钥。
4. 构建并重启 `finance-desk`。`listen.mjs` 若发现不是回环监听，会自己退出。
5. 只有在 HTTPS 已经覆盖登录入口之后，才把 `FINANCE_COOKIE_SECURE=1`。不要在纯 HTTP 上开 HSTS。

`migrations/0004_journal.sql` 增加 `fin_journal` 和 `fin_period`。它只加表。实收有变动时，新代码会写分录；表不存在时这笔保存会失败并回滚。`migrations/0005_inquiry.sql` 增加 `fin_inquiry`。表不存在时，访客提交会失败，工作人员看到“还没有迁移”。

回滚应用：把进程指回升级前的提交并重启。不要在新代码还在跑时删掉 `expires_at` 或 `fin_journal`，否则确认书查询或实收保存会失败。

回滚数据库，只在已经停在旧代码之后进行：

```sql
alter table fin_contract drop column if exists expires_at;
alter table fin_contract drop column if exists revoked_at;
drop table if exists fin_journal;
drop table if exists fin_period;
drop table if exists fin_inquiry;
drop table if exists fin_idem;
drop table if exists fin_desk;
drop table if exists fin_rate;
drop table if exists fin_audit;
```

回滚前再次备份。`fin_desk` 里如果已经有要保留的台账，先把 `body` 导出。
