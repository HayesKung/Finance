# EVIDENCE_INDEX

任务：FINANCE-ULTIMATE-E2E-001  
审计 SHA：`bd822a221a5dffbf76cb976f2c7b29c5333b9643`  
本索引只列本轮实际打开过的材料。不引用口令、密钥、客户账户或商户号。

| ID | 材料 | 用来支撑 | 标记 |
|---|---|---|---|
| E-01 | GitHub `main` 树，SHA `bd822a2` | 仓库基线 | VERIFIED |
| E-02 | [PR #5](https://github.com/HayesKung/Finance/pull/5) 已合并，head `e3a904bc2a971cc9d76282c18a92f34a29164d15` | `src/lib/db.ts`、`pg`、`EnvironmentFile` 的来源 | VERIFIED |
| E-03 | `listen.mjs` @ `bd822a2` | 只监听 `127.0.0.1` | VERIFIED |
| E-04 | `deploy/finance-desk.service` @ `bd822a2` | 回环、4173、凭据文件路径约定、禁止擅自加 vhost | VERIFIED |
| E-05 | `package.json` @ `bd822a2` | 无 `test` 脚本；依赖含 `pg` | VERIFIED |
| E-06 | `src/lib/db.ts` @ `bd822a2` | `query` 返回行数组；调用期才要求 `DATABASE_URL` | VERIFIED |
| E-07 | `migrations/0002_fin_contract.sql` | `fin_contract`、`fin_channel` | VERIFIED |
| E-08 | `src/lib/finpivot/contract-api.ts` | 七个服务函数无身份检查；`saveChannel` 写明文密钥 | VERIFIED |
| E-09 | `src/lib/finpivot/contract-share.ts` 的 `tokenOk`、`customerView` | UUID 格式；未双方签署不返回账户 | VERIFIED |
| E-10 | `src/lib/finpivot/store.ts` 持久化名 `finpivot-os-v1` | 台账在浏览器 | VERIFIED |
| E-11 | `src/lib/finpivot/inquiry.ts` `PUBLIC_SITE_LAUNCHED = false`；`frame.tsx` 用脚本写 robots meta | `noindex` 不是访问控制 | VERIFIED |
| E-12 | `public/` @ `bd822a2` 仅有 `favicon.svg`、`og.jpg`、`fin/` | 没有 `robots.txt` | VERIFIED |
| E-13 | 代码搜索 `repo:HayesKung/Finance path:.github` 结果 0 | 无 CI 配置 | VERIFIED |
| E-14 | Drive `1W1HoXgeM4CMTGLZvsXnfwjKhf8vb3nDC` PDF 正文前部 | 产品、红线、价格口径、获客目标 | VERIFIED |
| E-15 | `docs/manifest.json` @ `bd822a2` | 仍写 database none、未对外发布；`github_commit` 已过期 | VERIFIED |
| E-16 | PR #5 正文中的生产写入与公网 200 描述 | 只作操作者自述 | NOT_VERIFIED |
| E-17 | `/etc/finance-desk.env`、systemd 实际单元、反向代理 | 本轮未登录主机 | BLOCKED |
| E-18 | 沙箱内另一份 Neon/PGLite `src/lib/db.ts` | 与 `main` 不一致，不能当生产源 | VERIFIED（仅本地对照） |

未执行：生产 HTTP 复测、数据库查询、备份恢复、越权调用实验。原因是任务禁止未经授权的生产变更，且本环境没有该主机的登录入口。
