# OPERATIONS_RUNBOOK

本轮没有登录生产机，也没有重启服务。

在得到海哥授权、并且要让下一版运行之前，按这个顺序：

1. 备份 `finpivot` 库。
2. 对备份执行 `migrations/0003_access.sql`。确认 `fin_contract` 多了 `expires_at` 和 `revoked_at`。
3. 在 `/etc/finance-desk.env` 增加 `FINANCE_SESSION_SECRET`、`FINANCE_OWNER_PASSWORD`。支撑人员需要登录时再加 `FINANCE_SUPPORT_PASSWORD`。权限保持仅 root 可读。
4. 部署包含这些改动的提交，确认进程 SHA 与该提交一致。
5. 用负责人的口令打开 `/os`。错误口令不能打开台账。
6. 用一张测试确认书，而不是真实客户，走一遍签署。过期或撤销后，客户页应看不到正文。

恢复演练不要在生产库上试。把备份恢复到另一套空库后，对两边各做一次计数：订单笔数、收款笔数、实收合计、确认书笔数。四项必须相同。比较规则在 `reconcileSnapshot`。对不上就不要把应用指过去。

健康检查只对已登录的工作人员返回两件事：数据库是否应答，以及 `fin_contract.expires_at` 是否存在。不返回连接串、口令或客户内容。

停止条件：迁移失败、备份无法恢复、或者口令还没设置。这时不要重启到新版本。
