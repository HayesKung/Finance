# OPERATIONS_RUNBOOK

本轮没有登录生产机，也没有重启服务。

在得到海哥授权、并且要让下一版运行之前，按这个顺序：

1. 备份 `finpivot` 库。
2. 对备份执行 `migrations/0003_access.sql`。确认 `fin_contract` 多了 `expires_at` 和 `revoked_at`。
3. 在 `/etc/finance-desk.env` 增加 `FINANCE_SESSION_SECRET`、`FINANCE_OWNER_PASSWORD`。支撑人员需要登录时再加 `FINANCE_SUPPORT_PASSWORD`。权限保持仅 root 可读。
4. 部署包含这些改动的提交，确认进程 SHA 与该提交一致。
5. 用负责人的口令打开 `/os`。错误口令不能打开台账。
6. 用一张测试确认书，而不是真实客户，走一遍签署。过期或撤销后，客户页应看不到正文。

健康检查目前只是进程监听 `127.0.0.1:4173`。没有单独的告警。日志不要打印 env 文件。

停止条件：迁移失败、备份无法恢复、或者口令还没设置。这时不要重启到新版本。
