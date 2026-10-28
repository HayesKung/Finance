# Finance 部署缺失与待确认清单

> 触发：2026-10-29 由运维侧执行「直接下载并部署到云端」任务。
> 目标机：`root@1.13.183.52`（Ubuntu 24.04 LTS，`VM-4-2-ubuntu`，4C/7.4G）。
> 结论：**仓库当前状态不可直接部署**。补齐后已上线于内网 `127.0.0.1:3300`（systemd: `finance-desk.service`）。
> 以下每项均需原作者 / 高级专家团队确认或接管，不要默认以补丁为最终口径。

## 0. 部署事实

| 项 | 值 |
| --- | --- |
| 部署路径 | `/opt/finance-finpivot` |
| 服务单元 | `/etc/systemd/system/finance-desk.service` |
| 监听 | `127.0.0.1:3300`（**未暴露公网**，见 §4） |
| 运行用户 | `finance`（nologin，无特权） |
| 构建命令 | `npm install && npm run build` → 产物 `dist/server/server.js` + `dist/client` |
| 启动命令 | `node server.mjs` |
| 验证结果 | 9 条路由全部 200，标题 `海外项目与出口财务` 正确渲染 |

```bash
# 云端复核
ssh root@1.13.183.52
systemctl status finance-desk
curl -o /dev/null -w '%{http_code}\n' http://127.0.0.1:3300/os
```

## 1. 阻断级缺失（无这些文件无法安装、无法构建）

| # | 缺失文件 | 影响 | 补齐方式 | 需专家确认 |
| --- | --- | --- | --- | --- |
| 1 | `package.json` | `npm install` 无从执行；依赖与脚本完全未知 | 新增。按源码 import 反推依赖 | 版本号与 lockfile 策略 |
| 2 | `vite.config.ts` | 无 TanStack Start 插件，构建报 `Cannot resolve entry module index.html` | 新增，挂 `tanstackStart()` + `@tailwindcss/vite` | 是否需要 SSR=true、是否会改为 SPA |
| 3 | `tsconfig.json` | `@/*` 路径别名无定义，`@tanstack/react-router` 全部导入不可解析 | 新增，`paths: {"@/*": ["./src/*"]}` | 是否要开 strict 全量通过（当前 `typecheck` 未纳入 CI） |
| 4 | `src/client.tsx` | Start 无客户端 hydration 入口，SSR 无法注水 | 新增 `StartClient` + `hydrateRoot` | 是否需要 devtools / analytics 挂载点 |
| 5 | `.gitignore` | `node_modules/`、`dist/`、`src/routeTree.gen.ts` 均无忽略规则 | 新增 | — |

**注：`src/routeTree.gen.ts` 由 `@tanstack/router-plugin` 在构建时生成，属产物，不应入库**；但它在仓库里既不存在也未列入忽略，导致初次 clone 后 IDE 与 CI 直接报 unresolved import。这是本仓库最容易误导后来者的一个点。

## 2. 源码引用了但仓库里不存在的文件（编译期硬失败）

以下 4 个模块被 `src/routes/__root.tsx`、`src/router.tsx` 引用，仓库中没有对应任何实现：

| # | 缺失模块 | 引用方 | 补齐方式（补丁） | 待确认要点 |
| --- | --- | --- | --- | --- |
| 6 | `@/lib/error-component`（`AppErrorComponent`） | `src/router.tsx` | 薄封装 TanStack 内置 `ErrorComponent` | 错误页文案、是否上报、是否要有回收抄送入出口 |
| 7 | `@/lib/auth/provider`（`AuthProvider`） | `src/routes/__root.tsx` | 纯透传容器，**未提供任何鉴权语义** | **这是最重要的开放项**：当前所有路由对所有人开放。是否需要登录？role（`META.owner` / `META.reviewer`）如何映射到真实权限？补丁里的 stub 严禁当作已实现的鉴权 |
| 8 | `@/components/preview-host-bridge`（`PreviewHostBridge`） | `src/routes/__root.tsx` | 仅向父窗口 postMessage 路由与高度 | 预览宿主的具体协议（事件名、字段名），需设计侧给真值 |
| 9 | `@/lib/preview-path-prefix`（`previewPathRewrite`） | `src/router.tsx` | 按 `VITE_PREVIEW_PATH_PREFIX` 剥离前缀 | `__root.tsx` 里资源挂 `/__grok/`（`manifest.webmanifest`、`icon-180.png`），但仓库**没有** `public/__grok/` 目录 → favicon 之外的 manifest 与 icon-180 实际 404，见 §3 |

## 3. 资源缺失（不阻断，但线上 404）

| 资源 | HTML 引用 | 仓库现状 |
| --- | --- | --- |
| `/__grok/manifest.webmanifest` | `__root.tsx` link rel=manifest | **无此文件** |
| `/__grok/icon-180.png` | `__root.tsx` apple-touch-icon | **无此文件** |
| `/favicon.svg` | `__root.tsx` | ✅ 存在（`public/favicon.svg`）；但若 `/__grok/` 前缀规则在生产生效，此路径同样会 404 |

另：`public/og.jpg` 存在但**未被 `__root.tsx` 的 `<meta>` 引用**，OG/Twitter 卡片元数据整体缺失。对外发布前必须补 `og:image`、`og:title`、`twitter:card`。

## 4. 部署形态待决策（运维侧已按最保守口径处理）

README 明确写着「品牌名和联系方式未确认，仓库里的页面是草案和内部作战台，**不是已授权的对外发布**」。因此本次：

- **只监听 `127.0.0.1:3300`，未开 ufw 端口、未加 nginx vhost、未绑域名**。
- 存量生产 nginx（`80/443`）反代链未做任何改动（该机上还有 `star-trade-*`、license server 等多个在跑服务，改动风险高）。

若后续确认可对外，需要专家拍板：

1. 域名与证书（当前无可用的 authoritative domain）；
2. 是否加 SSO / Basic Auth —— **在 §2 第 7 项落地真实鉴权之前，不应暴露到公网**；
3. `VITE_PREVIEW_PATH_PREFIX` 生产值（为空则裸露根路径）。

## 5. 仓库治理缺口

- 无 CI：仓库没有 `.github/workflows/*`，`src/lib/finpivot/flow.test.ts`（node:test）从未被自动执行。已补 `npm test` 脚本（Node 22 `--experimental-strip-types`），建议接入 CI。
- 无 README 部署章节：首次部署完全靠反推。
- 依赖版本无下限约束：`@tanstack/react-start@1.169` 要求 `vite>=8`，此约束是本次排错才发现的，应在 README 注明。

## 6. 本次补丁产物清单

```
package.json            # 新增
vite.config.ts          # 新增
tsconfig.json           # 新增
.gitignore              # 新增
server.mjs              # 新增：dist 产物的 HTTP 适配层
src/client.tsx          # 新增：Start hydration 入口
src/lib/error-component.tsx          # 补齐（stub）
src/lib/auth/provider.tsx            # 补齐（stub，无鉴权语义）
src/components/preview-host-bridge.tsx # 补齐（stub）
src/lib/preview-path-prefix.ts        # 补齐
Dockerfile              # 新增
systemd/finance-desk.service          # 新增
DEPLOY_GAPS.md          # 本文件
```

所有标 stub 的文件在文件头均带 `STUB` 注释，禁止就此视为已完成实现。

## 7. 优先级建议

1. **P0** §2-7 `AuthProvider`：任何对外部署的前置条件；当前是透传，等于无访问控制。
2. **P0** §2-9 / §3 `__grok` 前缀与静态资源：决定了构建产物路径是否成立。
3. **P1** §5 CI：把 `npm test` 与 `npm run build` 纳入 GitHub Actions，避免再次出现「clone 下来就编译不过」。
4. **P1** §4 部署形态：域名 / 鉴权 / 前缀三项拍板后才谈对外发布。
5. **P2** OG 元数据、`flow.test.ts` 覆盖率。
