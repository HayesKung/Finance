# BASELINE_REPORT

任务：FINANCE-ULTIMATE-E2E-001  
审计对象：HayesKung/Finance `main`  
审计 SHA：`bd822a221a5dffbf76cb976f2c7b29c5333b9643`（PR #5 合并提交）  
审计日：2026-10-29  
状态：IN_PROGRESS。本文件只建立基线，不宣布生产安全，也不宣布端到端验收通过。

标记：VERIFIED = 本轮直接看到的仓库或 Drive 原文。INFERRED = 由已看到的代码推出、但未在运行中复测。NOT_VERIFIED = 本轮没有独立复查。BLOCKED = 缺授权或缺入口，不能继续取证。

## 1. 仓库

| 项 | 结论 | 标记 |
|---|---|---|
| `main` SHA | `bd822a2`，父提交含 `0c27c26` | VERIFIED（GitHub API） |
| 开放 PR | 审计当时为 0。本基线文档将另开 PR，不合并 | VERIFIED |
| CI | 仓库无 `.github/workflows` | VERIFIED（代码搜索 0 条） |
| 测试脚本 | `package.json` 只有 `dev` / `build` / `start` / `typecheck`，没有 `test` | VERIFIED |
| 最近生产相关变更 | `0c27c26` 增加合同链接与 `contract-api.ts`；`bd822a2` 补上 `src/lib/db.ts`、`pg`、systemd `EnvironmentFile` | VERIFIED |

## 2. 部署与运行

| 项 | 结论 | 标记 |
|---|---|---|
| 进程入口 | `listen.mjs` 固定 `127.0.0.1`，拒绝其他 `HOST`，并用 `/proc/net/tcp` 复核 | VERIFIED（`listen.mjs`） |
| systemd | `deploy/finance-desk.service` 用户 `finance`，`PORT=4173`，`EnvironmentFile=/etc/finance-desk.env`，注释写明鉴权落地前不要加 nginx vhost | VERIFIED |
| 实际运行 SHA | 合并前操作记录写的是 `0c27c26` 加服务器本地 db 修复。是否已拉到 `bd822a2`，本轮未登录服务器 | NOT_VERIFIED |
| 公网是否能打开 `/` `/sign` `/orders` `/ask` | 操作记录称曾返回 200。本轮未从外部复测，也未看反向代理配置 | NOT_VERIFIED |
| 因此不能由“单元文件写了回环”推出“公网不可达” | 若前面已有反向代理，回环进程仍可被转到公网 | INFERRED |

本轮没有登录生产机，没有读取 `/etc/finance-desk.env`，没有改端口、代理或服务。

## 3. 数据

| 项 | 结论 | 标记 |
|---|---|---|
| `main` 的 `src/lib/db.ts` | `pg.Pool`，`getSql().query()` 直接返回行数组；无 `DATABASE_URL` 时在调用时抛错 | VERIFIED |
| 表 | `migrations/0002_fin_contract.sql` 建 `fin_contract`、`fin_channel`。`getSql()` 不会自动跑迁移 | VERIFIED |
| 生产库是否已执行该迁移 | 操作记录称已在本机 Postgres 执行并做过写入后清理。本轮未连库复测 | NOT_VERIFIED |
| 浏览器台账 | Zustand `finpivot-os-v1` 存在 `localStorage`：线索、客户、订单、收款、交付勾选 | VERIFIED（`store.ts`） |
| 权威关系 | 合同正文与签名可写入 Postgres；订单、客户、名单仍以浏览器为准。两套数据会分叉 | VERIFIED |
| 备份与恢复演练 | 仓库和本轮都没有可复现的备份恢复记录 | NOT_VERIFIED |

沙箱里的 `src/lib/db.ts` 仍是 Neon/PGLite 且 `getSql()` 返回 Promise。那不是 `main` 上的文件，不能拿来部署。

## 4. 身份与合同接口

`contract-api.ts` 的这些服务函数没有会话、角色或资源归属检查：

- `publishContract`
- `readContract`（客户 token）
- `readStaffContract`（工作人员 token）
- `customerSign`
- `customerClaim`
- `channelStatus`
- `saveChannel`

| 项 | 结论 | 标记 |
|---|---|---|
| 能到达该进程的调用方是否可写支付密钥 | `saveChannel` 不校验调用者，密钥明文进 `fin_channel.secret` | VERIFIED |
| token | `crypto.randomUUID()`，格式校验为 UUID。无过期、撤销、限流、访问审计 | VERIFIED |
| 收款账户展示 | 双方都签完，客户视图才带出微信、支付宝、银行账户 | VERIFIED（`customerView`） |
| 签署效力 | 页面保存名字、笔迹图和时间，文案写明不是持牌电子签 | VERIFIED |
| 微信/支付宝扣款 | 只保存密钥和展示账号，没有调用微信或支付宝下单 | VERIFIED |
| `noindex` | `PUBLIC_SITE_LAUNCHED = false` 时由浏览器脚本写 meta。`main` 的 `public/` 没有 `robots.txt`。这不是访问控制 | VERIFIED |
| 工作台路由 | `/os` `/pipeline` `/clients` `/orders` `/playbook` `/templates` 与 `/` `/ask` `/sign` 没有服务端登录门 | VERIFIED |

AuthProvider 在单元注释里被明确写成透传，不是访问控制。VERIFIED（`finance-desk.service`、`listen.mjs`）。

## 5. 与 Drive 正本的差异

正本：Drive 文件 `1W1HoXgeM4CMTGLZvsXnfwjKhf8vb3nDC`，《MM-FINPIVOT-001_财务人员转型_服务单与获客方案_2026-10-28.pdf》。本轮读到第 1–10 节。

| 正本 | 当前程序 | 标记 |
|---|---|---|
| 三产品、免费诊断只给风险清单、不经手客户资金、不承诺退税和回款 | 文案与确认书有这些边界 | VERIFIED |
| 按单先收 50%，月度预收当月 | 收费门禁按此实现 | VERIFIED（既有 `flow` 规则） |
| 价格是起步建议价，不是已核实市价 | 页面仍写建议区间，未改成成交价 | VERIFIED |
| 品牌、域名、联系方式待填，网站未授权发布 | `manifest.json` 与页眉草案声明仍如此；`brand_invented` 为 false | VERIFIED |
| 100 家名单、20 家诊断、2 个试点 | 程序里没有可追溯的真实计数。浏览器里的演示记录不得算业绩 | VERIFIED（正本是目标；仓库无核验证据） |
| 代理记账须有许可或转给持证机构 | 确认书写明不做代理记账。没有执业资格核验表 | VERIFIED / 缺口 |
| 交付 SOP、底稿、复核人、客户确认版本 | 只有交付名称勾选，没有三条 SOP 的底稿与复核 | VERIFIED（缺） |

## 6. 本轮不做的事

未改业务代码，未合并本基线，未部署，未开放公网，未代填品牌或联系方式，未把任何密钥、口令或客户账户写入仓库。

## 7. 阶段结论

总状态：IN_PROGRESS。  
WP0：PARTIAL。代码侧 P0 已记录；生产暴露和运行 SHA 未独立复测，隔离动作未获授权。  
WP1–WP7：未开始。在 WP0 的 P0 有授权处置之前，不进入实现。
