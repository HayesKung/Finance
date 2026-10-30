# TUNNEL_SECURITY_CHECKLIST

日期：2026-10-30。对象：`newapi-tunnel-open.cmd` 的只读审查，以及尚未实施的 Finance 隧道设计。

## 现有脚本

| 检查 | 结果 | 说明 |
|---|---|---|
| 机制是本地转发，不是远程转发或 SOCKS | 通过 | 只有 `ssh -N -L` |
| 远端目标明确 | 通过 | 远端 loopback 的 3100，不是 4173 |
| 本地端口明确 | 通过 | 3100 |
| 本地绑定地址写死为 loopback | 不通过 | 没写 `127.0.0.1:`，依赖客户端默认 `GatewayPorts no` |
| 关闭 Host Key 校验 | 未发现 | 没有 `StrictHostKeyChecking=no` 或 `accept-new` |
| 硬编码口令、Token、私钥 | 未发现 | 失败提示只提到可能要交互输入 |
| 指定私钥并限制只使用这一把 | 不通过 | 没有 `-i`，也没有 `IdentitiesOnly` |
| 使用最小权限账号 | 不通过 | 账号是 `root` |
| 转发失败时退出 | 不通过 | 没有 `ExitOnForwardFailure=yes` |
| 端口冲突处理 | 不通过 | 只等 3 秒并用 HTTP 200 判断，可能误判 |
| 断线自动重连 | 未提供 | 三次保活失败后进程结束，没有重启循环 |
| 退出方式明确 | 部分通过 | 要另关隧道窗口；关启动器不会带走隧道 |
| 远程端口暴露 | 未发现 | 没有 `-R` |
| 日志含秘密 | 未发现 | 没有把认证材料写进文件；临时文件只存状态码 |

现有脚本没有触发 FP-000 的硬停止项：没有明文秘密，没有关闭 Host Key 校验，没有远程转发，端口映射也清楚。它仍然不适合直接改端口后给 Finance 使用。

## Finance 方案实施前必须满足

- 本地监听写成 `127.0.0.1` 的专用端口，不绑 `0.0.0.0`，不占用本机 4173。
- 远端目标只允许一台主机上的 `127.0.0.1:8443`，并且该端口只给 Finance 的 loopback TLS。
- 每名员工独立账号和独立密钥；禁用口令登录、root、远程转发、agent forwarding 和 TTY。
- `StrictHostKeyChecking=yes`，`ExitOnForwardFailure=yes`，`IdentitiesOnly=yes`。
- 浏览器使用 HTTPS，证书名称和 Host、Origin 一致，从而 Secure Cookie 和同源检查都能通过。
- 不修改公网 Nginx 上已有站点，不用 HTTP 200 代替转发成功判断。
- 私钥和主机密钥不进入 Git、Issue 或聊天。
- 撤销时只删除对应公钥，并确认转发权限消失。

这些条目本轮都还没有实施。
