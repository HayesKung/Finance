# E2E_ACCEPTANCE_REPORT

总状态：PARTIAL。不是“全部完成”，也不是“生产安全”。生产没有在这一轮重新部署。

代码基线（本机，2026-10-29）：

- `main`：`b609a5f641e8a7181c91599f10df09a003d32441`
- PR #7 `fix/jsx-orders`：`0049b2a92f4c781d30b0a75e3e9c99f9f4ef387d`，仍是 OPEN
- 本轮实现在 `feat/e2e-002-security`，还没有合并，也没有部署

| 场景 | 结果 | 证据 |
|---|---|---|
| 未登录不能把内部页当公开页打开 | 路由 `beforeLoad` 转到 `/staff/login`。对外只留 `/`、`/ask`、`/sign` | `staff-gate.ts`、`gate.test.ts` |
| 直接改状态的请求要来自同一主机 | 来源和 Host 不一致就拒绝 | `session.server.ts`、`access.test.ts` |
| 支撑人员不能保存支付密钥，也不能核对实收 | 代码只允许 owner | `can()`、`ledger.test.ts` |
| 登录失败次数并发下只计一次 | 数据库行锁里计数。没有连生产库做并发压测 | `guard-db.ts`、`takeFailure` 测试 |
| 数据密钥缺失时不保存通道密钥 | 不再回退到会话密钥 | `resolveDataKey` |
| 未双方签署不能把订单改成执行中 | 服务器重放检查会拒绝 | `ledger.test.ts` |
| 实收不能被一次重复提交改小，也不能高于这一笔应收 | 同上。重复幂等键不会记成两笔 | `ledger.test.ts`、`journal.test.ts` |
| 客户说已付款、或在线回调，不能记实收 | 回调直接拒绝。声明转账不产生分录 | `journal.test.ts` |
| 编制人与复核人相同不能交付 | 同上 | `ledger.test.ts` |
| 确认链接过期或撤销后关闭 | 规则测试通过 | `access.test.ts` |
| 已签署的确认书不能被另一次保存改掉服务费 | 签署后商业条款保持原样 | `contract-share.test.ts` |
| 没授权、没保密或超出资质不能开工 | 规则测试拒绝 | `flow.test.ts`、`ledger.test.ts` |
| 没回单号不能把实收改大；没版本、客户确认和对账不能交付 | 规则测试拒绝 | `ledger.test.ts` |
| 没有诊断要点或资格判断不能报价建档 | 报价动作会停住 | `store.ts` |
| 持牌电子签、微信或支付宝扣款 | BLOCKED。没有服务商沙箱，页面也不宣称已接通 | `providerLive: false` |
| 用真实或合成客户从线索走到复盘 | 纯规则走通了门禁，没有在浏览器或生产库点完 | NOT_VERIFIED |
| 未授权访问生产接口 | 未对生产主机发包 | NOT_VERIFIED |
| HTTPS、HSTS、真实域名登录 | BLOCKED。域名还没有批准，生产未改 | NOT_VERIFIED |
| 备份恢复演练、生产库对账、`0004` 迁移 | 迁移文件已写。没有对生产备份做过 | NOT_VERIFIED |
| 真实收款、真实交付、续约 | 没有 | NOT_VERIFIED |

单元测试命令：`npm test`。它不连接生产数据库。生产发布仍要当次明确授权。
