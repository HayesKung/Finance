# FINANCE_TUNNEL_USER_GUIDE

双击 `E:\Private\finance-tunnel\finance-tunnel-open.cmd`。

脚本会检查 OpenSSH、hosts、代理绕过、主机密钥和 CA，然后建立只绑定 `127.0.0.1:18443` 的隧道。登录页检查通过后，打开默认浏览器到 `https://finance.internal:18443/staff/login`。密码只在浏览器里输入。

如果 hosts 里还没有这一行，会弹出一次 Windows 权限确认，只追加 `127.0.0.1 finance.internal`。拒绝权限确认时，脚本停止，不打开浏览器。

双击 `E:\Private\finance-tunnel\finance-tunnel-close.cmd` 只关闭本次 Finance 隧道。hosts 和 CA 会保留。

如果 `18443` 被别的程序占用，脚本会报出进程名和 PID，不会结束那个程序。
