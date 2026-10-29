# E2E_ACCEPTANCE_REPORT

总状态：PARTIAL。不是“全部完成”，也不是“生产安全”。

| 场景 | 结果 | 证据 |
|---|---|---|
| 未登录不能把内部页当公开页打开 | 代码拒绝渲染，服务函数拒绝写密钥 | `frame.tsx`、`access.test.ts` |
| 支撑人员不能保存支付密钥 | 代码只允许 owner | `can()` 测试 |
| 未双方签署不能把订单改成执行中 | 服务器重放检查会拒绝 | `ledger.test.ts` |
| 实收不能被一次重复提交改小 | 同上 | `ledger.test.ts` |
| 编制人与复核人相同不能交付 | 同上 | `ledger.test.ts` |
| 确认链接过期或撤销后关闭 | 规则测试通过 | `access.test.ts` |
| 用真实或合成客户从线索走到复盘 | 未在浏览器或生产库跑通 | NOT_VERIFIED |
| 未授权访问生产接口 | 未对生产主机发包 | NOT_VERIFIED |
| 备份恢复、部署回滚 | 只写下步骤，没有演练 | NOT_VERIFIED |
| 真实收款、真实交付、续约 | 没有 | NOT_VERIFIED |

单元测试命令：`npm test`。它不连接生产数据库。
