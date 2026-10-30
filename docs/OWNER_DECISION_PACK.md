# Owner 决策包

日期：2026-10-31。总 Gate：`PARTIAL_PASS_WITH_P0_BLOCKERS`。

本文件只列出需要 Owner 亲自处理的事项。其余技术检查已在集成分支做完，没有合并 PR，没有执行生产迁移，没有覆盖 OCI `9919561`，没有采购电子签。

## 1. PR #10 合并批准

- SHA：`dba2e1cec9a37c9353a2a1e525ed7acbb8b6edaf`
- CI 已全绿。实施者自查见 `docs/PR10_REVIEW.md`，这不是独立审查通过。
- 需要：另一名未参与实施的审查者给出 BLOCKER=0，然后由 Owner 书面批准合并。
- 未批准前不要合并。

## 2. 生产 finpivot 迁移批准

- 文件：`migrations/0006_receipt.sql`
- 内容：`fin_bank_receipt`（幂等键和银行回单号唯一）、`fin_provider_nonce`。
- 已在隔离 Postgres 上准备测试。没有对腾讯云 `finpivot` 执行。
- 需要：Owner 单独批准后，才可以对 `finpivot` 这一库执行。不改监听，不重启 PostgreSQL，不动另外七个库。

## 3. 电子签供应商、费用和合同

比较对象：e签宝、法大大、上上签、DocuSign、Adobe Acrobat Sign。全部未签约。代码保持 `PROVIDER_PENDING`，`legallyBinding` 为 false。

需要 Owner 选定供应商、签约主体、费用和数据存放地。未批准前不注册、不付款、不启用正式签署。

## 4. 浏览器登录口令

`FINANCE_COOKIE_SECURE=1` 已在 Finance 进程环境中。隧道登录页可以打开。Agent 不读取、不代填口令。

需要 Owner 在自己的浏览器打开 `https://finance.internal:18443/staff/login`，输入口令，确认 Cookie 为 Secure、HttpOnly、SameSite=Lax，并且刷新后会话仍在。

## 明确不做

- 不恢复 youyou.pet。
- 不恢复 viralscriptpro.com。
- 不把腾讯企点「该链接会唤起QQ」提示页写成加好友成功。
- 不把九张空表的恢复结果写成业务数据恢复通过。
