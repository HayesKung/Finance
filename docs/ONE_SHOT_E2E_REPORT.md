# ONE_SHOT_E2E_REPORT

日期：2026-10-30。总判定：**PARTIAL_PASS**。不是整体 PASS。

## 已完成

- 本地备份 `E:\Private\database\finpivot-20261030T0742Z.dump.enc` 的 SHA-256 与服务器密文一致：`3d78d78f4d34565a6d1c2bacda59e0640d3e4ab9a145cb751439151ed83986bf`，23200 字节。密钥文件在 `E:\Private\finance-backup-keys\`，没有写入仓库。
- 隔离的 PostgreSQL 16 容器完成 `pg_restore`。九张表都在，行数都是 0。容器和明文 dump 已删除。没有动生产库。
- 腾讯云 `finance-direct.conf` 已移出 `conf.d`，备份在 `/root/nginx-backups/`。`Host: 1.13.183.52` 现在返回 403，正文不再包含 Finance 标题。`youyou.pet`、`contract.red`、`huohua.xyz`、`huomiao.ltd` 仍有响应。
- 公开官网是独立静态构建，产物 SHA-256 `86386e762d3630c298224cc2ce26f66d1ae85a48be97fa015a67d6ac3400013f`。页面没有表单，也没有 Finance 密钥字样。
- Oracle 已增加只匹配 `finanpivot.com` / `www.finanpivot.com` 的站点。`https://finanpivot.com/` 和 `https://www.finanpivot.com/` 返回 200。`https://agentkind.org/` 仍返回 200。证书到期 2027-01-28。
- 电子签正式通道在代码里保持关闭。银行到账确认只有负责人能做，同一幂等键不会记两次。这是单元测试，不是真实付款。
- 隧道客户端脚本已放进 `scripts/finance-tunnel/`。浏览器已打开 `https://finance.internal:18443/staff/login`，页面标题是「工作人员入口」。没有代填口令，因此 Session Cookie 全流程未测。

## 未完成

- `youyou.pet` 的 `/` 仍转发到 Finance `4173`。按“不改其他网站”停止，因此 Finance 仍有一条公网入口。
- 因为这条入口还在，没有把 `FINANCE_COOKIE_SECURE` 改成 1。否则该站的 HTTP 登录 Cookie 会存不住。
- 浏览器里的真实登录、注销和 Cookie 属性没有由本代理完成。
- 没有签约电子签服务商，没有 Sandbox 供应商账号，没有真实银行到账。
- 生产 Finance 进程仍是标签 `97d57a4`。这次的代码还没有部署到腾讯云。
- 没有 CI 运行结果。工作流文件已加入仓库，要等推送后的检查。
- Nginx 重载时仍有既有的 `viralscriptpro.com` 重名警告，这次新增的站点配置没有改那个文件。

回滚官网：删掉 `/etc/nginx/sites-enabled/finanpivot.com.conf` 后执行 `nginx -s reload`。回滚 IP 入口：把备份的 `finance-direct.conf` 放回 `conf.d` 再 reload。
