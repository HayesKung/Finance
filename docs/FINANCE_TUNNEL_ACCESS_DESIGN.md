# FINANCE_TUNNEL_ACCESS_DESIGN

日期：2026-10-30。这是设计，不是实施。没有创建脚本，没有连接服务器，没有改 Nginx、SSH 或应用配置。

## 1. 目标

两名员工从自己的 Windows 电脑，用 SSH 本地端口转发访问腾讯云上的 Finance。不新增面向公众的 Finance 域名，不把整机 80/443 改成内网，不改 `youyou.pet`、`contract.red`、`huohua.xyz`、`huomiao.ltd` 的站点。

现有 New API 脚本只证明本地转发这个机制可用。Finance 不复用它的 `root` 账号、3100 端口和“HTTP 200 即成功”的判断。

## 2. 推荐拓扑

```text
浏览器 https://finance.internal:8443
    -> 本机 127.0.0.1:8443
    -> SSH Local Forward
    -> 腾讯云 loopback 127.0.0.1:8443 上的 Finance 专用 TLS
    -> 127.0.0.1:4173 的 Finance 进程
```

`finance.internal` 只写在员工电脑的 hosts 文件里，指向 `127.0.0.1`。不创建公网 DNS。

服务器上的 8443 只绑定 `127.0.0.1`，不进公网安全组和 Nginx 的公网 server 块。这需要以后单独授权才能加。本轮不改 Nginx。

不推荐把浏览器直接指到 `http://127.0.0.1:4173` 作为正式入口。那样互联网路径虽然有 SSH，但 Cookie 的 Secure 标志、证书名称和 HTTPS 都对不齐。当前代码在 `FINANCE_COOKIE_SECURE=0` 时会在 HTTP 上发 Cookie；改成 1 之后，这个 HTTP 入口的登录态会丢。

## 3. 转发参数

以后的脚本应明确写成：

- 本地只绑定 `127.0.0.1:8443`
- 远端目标只写 `127.0.0.1:8443`
- `-N`
- 不使用 `-R`、`-D`、`GatewayPorts=yes`
- `ExitOnForwardFailure=yes`
- `StrictHostKeyChecking=yes`
- `IdentitiesOnly=yes`，并且只指定一把员工专用私钥
- 保活可以保留，但断线后由员工重新运行，不在本设计里自动无限重连
- 账号不是 `root`。每名员工一把密钥、一个受限账号

`PermitOpen` 只允许 `127.0.0.1:8443`。不允许转发到 22、54321、3100 或其他业务端口。`AllowTcpForwarding` 只允许 local。关闭 TTY、agent forwarding、X11 和远程转发。

本地不要占用 4173。开发机上的 Finance 开发服务会使用这个端口，和隧道绑在同一个端口会冲突。

## 4. HTTPS、Host、Origin、CSRF、Cookie

当前代码里的规则：

- 会话 Cookie 名是 `fin_staff`，HttpOnly，SameSite=lax，路径 `/`，约 12 小时。
- `FINANCE_COOKIE_SECURE=1` 时 Cookie 带 Secure；`=0` 时不带。生产标签目前是 0。未设置时，生产进程默认按 Secure 处理。
- 写操作要求 `Origin` 的 host 和请求的 Host 完全一致，包含非默认端口。缺一就拒绝。
- 代码里没有 WebSocket 或 SSE。上传不依赖这条隧道的特殊转发。

因此浏览器地址、证书名称、Host 头和 Origin 必须是同一组：

| 浏览器地址 | Host / Origin host | Cookie |
|---|---|---|
| `https://finance.internal:8443` | `finance.internal:8443` | Secure 可以保存 |
| `http://127.0.0.1:4173` | `127.0.0.1:4173` | 只有 Secure 关闭时能保存 |

证书要包含 `finance.internal`。不要让员工忽略证书错误。不要用公网证书去配一个只存在于 hosts 里的名字，除非这张证书真有这个 SAN，并且私钥不离开服务器。

如果前面还有反向代理，并且打开了 `FINANCE_TRUST_PROXY=1`，代理改写的 Host 必须仍等于浏览器 Origin 的 host。直接把未知 Host 送到默认站点，会进到别的业务，不能当作 Finance 入口。

SSH 登录成功不等于 Finance 登录成功。工作台仍要员工口令和现有角色检查。隧道断开后，本机 8443 不再有服务，页面打不开。已经发出的 Cookie 仍要靠 12 小时过期和退出登录失效；隧道本身撤不回已经落在浏览器里的 Cookie。

## 5. 断线、退出、冲突和撤销

- 转发失败必须让 SSH 退出，不能留着一个“连上了但没转发”的会话。
- 成功与否看转发端口是否由这次 SSH 听着，不能只看 HTTP 200。现有脚本的 200 判断会把别的本地服务误认成隧道。
- 退出就是结束该 SSH 进程。不要用一个关不掉的隐藏窗口作为唯一办法。
- 本机 8443 已被占用时，脚本应停下来说明冲突，不杀掉无关进程，也不改绑到 `0.0.0.0`。
- 撤销一名员工：从服务器去掉该公钥，并确认该账号不能再转发。不旋转另一名员工的密钥。
- 不把私钥、口令或已知主机密钥写进仓库。主机指纹在第一次连接时由员工核对，不在脚本里关闭检查。

## 6. 本轮明确不做

不新增 Nginx 的 loopback TLS，不改 `finance-direct.conf` 和 `youyou.pet.conf`，不改防火墙、DNS、数据库和 sing-box。`youyou.pet` 的 `/` 目前也转到 `127.0.0.1:4173`。隧道设计避开它，不把收紧公网入口和隧道混成同一次变更。
