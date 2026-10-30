# LOCAL_CHANGELOG

2026-10-30

- 根因：系统代理 `127.0.0.1:10808` 没有绕过 `finance.internal`。
- 变更：当前用户的 `ProxyOverride` 末尾追加 `;finance.internal`。代理本身仍然开着。
- 回滚代理：把 `Internet Settings` 的 `ProxyOverride` 去掉末尾的 `;finance.internal`。
- 替换 `E:\Private\finance-tunnel\finance-tunnel-open.cmd` 和 `finance-tunnel-close.cmd`，新增 `finance-tunnel.ps1`。
- hosts 里已有 `127.0.0.1 finance.internal`，这次没有改 hosts。脚本仍会在缺失时先备份再追加。
- 没有改腾讯云 Nginx、SSHD、证书、环境变量、防火墙、PostgreSQL、DNS、Oracle 或其他网站。
