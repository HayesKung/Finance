# PR #10 审查（不能当作独立审查通过）

- 精确 SHA：`dba2e1cec9a37c9353a2a1e525ed7acbb8b6edaf`
- CI：Actions run `41051225044`，`npm ci`、测试、typecheck、`build:www`、`npm run build` 均为 SUCCESS
- 审查身份：本报告由实施这次提交的本地 Agent 写出。它不是非实施者的独立审查，不能关闭合并门，也不能代替 Owner 批准。

## BLOCKER

1. 独立审查人尚未出具通过结论。实施者不能自审自批。
2. 这个 SHA 里的 `confirmOwnerReceipt` 只被测试调用，没有接到带工作人员 Session 的服务端入口。生产收款路径没有接通。
3. `migrations/0006_receipt.sql` 没有在生产 `finpivot` 执行。这是故意停住，不是已经入账。

## MAJOR

1. 这个 SHA 的 Webhook 防重放是进程内 `Set`。重启后 nonce 会丢。表 `fin_provider_nonce` 当时没有被写入。
2. CI 不设置 `FINPIVOT_PG_URL`，隔离 Postgres 测试在 CI 里被跳过。CI 全绿不等于数据库入账已验证。
3. 官网文件和 PR #11 / #12 重叠。若先合并本 PR 再按旧 www 发布，会覆盖已经上线的门户 `9919561` 和未上线的联系区改动。
4. 电子签 `createProviderEnvelope` 始终失败关闭。这是正确边界，但也表示正式签署没有完成。

## MINOR

1. `package-lock.json` 已包含 Node 22 需要的 `lru-cache@11.5.3`，`npm ci` 能通过。
2. 支撑人员不能确认到账、改价、冲正、退款或签发交付。这是规则测试，不是生产浏览器走单。

## 结论

PR #10 可以进入非实施者审查，但不能合并。合并权留给 Owner。集成分支 `integrate/final-convergence` 只做准备，不部署，不覆盖 OCI。
