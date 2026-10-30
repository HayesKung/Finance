# FINANCE_TUNNEL_CONNECTION_DIAGNOSTIC

时间：2026-10-30。没有改 PostgreSQL、DNS、Oracle、sing-box 或其他网站。

## 分类

`BROWSER_PROXY_BYPASS_MISSING`

浏览器访问 `https://finance.internal:18443` 被系统代理转到 `127.0.0.1:10808`。`finance.internal` 含有点，Windows 的 `<local>` 绕过不包括它。代理把连接重置，Chrome 显示 `ERR_CONNECTION_RESET`。这不是 Finance Cookie，也不是 8443 对公网开放。

## 证据

- hosts 已有 `127.0.0.1 finance.internal`，解析结果是 `127.0.0.1`。
- 系统代理启用。绕过列表原来没有 `finance.internal`。
- 直接连 `127.0.0.1:18443` 时，TLS 链和登录页可以通过。走系统代理的 `curl.exe` 会得到连接重置。
- 当前用户受信任根里有 FinanPivot 隧道 CA，指纹 `B40DA386D7EE850162A009333518997DBB259648`，到期 2036-10-27。
- 专用主机密钥指纹仍是 `SHA256:obVALHEs28scS1Dl7oZzdAUgIAgOVli37jqG6x3it1s`。

## 修复

在原有代理绕过列表末尾追加 `finance.internal`，没有关闭代理，没有删除原有条目。健康检查改为直连 `127.0.0.1:18443`，不经过代理。
