# 分别部署：Oracle 官网与腾讯云 Finance

对外官网和内部 Finance 是两次独立发布。一次只换一边的发布目录，不把另一边的进程、Nginx 或数据库带上。

2026-11-02 的事实：

- 仓库 `main` 最新提交是 `fe5150d787df72f294d1c1d81ad7b7d34cf2fe78`，相对 `97d57a4` 只增加了 `sites/www`。
- Oracle 官网发布目录是 `2410d0ba3bdd4d9fe600205f9441d223f9e579c2a4a658e40adfc4632fdbb925`。
- 腾讯云 Finance 仍是 `4e38eefbde98d2ce7410a979abf74a5067313563`。这个提交比 `main` 的应用代码新。用当前 `main` 覆盖它，会退回 `97d57a4` 的内部应用。
- `migrations/0006_receipt.sql` 没有在生产库执行。部署代码时不要顺手跑迁移。

## 先判断这次改了哪一边

在要发布的提交上执行：

```powershell
git fetch origin
git diff --stat <正在运行的提交> <准备发布的提交>
```

- 只有 `sites/www/**`、`package.json` 的 `build:www`：只部署 Oracle。
- 有 `src/**`、`listen.mjs`、`migrations/**`：只在确认不会把腾讯云退到更旧提交之后，才部署腾讯云。
- 两边都有：分两次做。先完成一边的校验和回滚点，再做另一边。

工作树必须干净。未提交的本地修改先提交并推到远程，再打包。打包用的是提交里的文件，不是编辑器里没保存的内容。

## 两边都不要做

- 不改 Oracle 上的 `agentkind.org`、`viralscriptpro.com`、`subscribe`、sing-box、`8811`。
- 不改腾讯云上 `contract.red`、`huohua.xyz`、`huomiao.ltd` 的配置，不恢复 `youyou.pet`。
- 不改共享 PostgreSQL 的监听、`pg_hba`、角色，不重启 PostgreSQL，不碰 `finpivot` 以外的库。
- 不改 Cloudflare 的 MX、SPF、DKIM、DMARC、NS。
- 不把 `4173` 或 `8443` 公开到公网。
- 不把 `/etc/finance-desk.env`、私钥、备份密钥写进 Git 或发布包。
- 不在 Windows 上编出来的 `node_modules` 或 `.output` 拷到 Linux。原生模块对不上。

PowerShell 会吃掉双引号里的 `$()`。远程命令用单引号包住，或者把脚本写成 LF 文件再 `scp`。不要把含 `readlink`、`tr` 的脚本通过 PowerShell 双引号传进去。

## Oracle：只换官网静态文件

主机：`ubuntu@161.33.29.236`。密钥：`E:\Private\orcalssh\ssh-key-2026-07-30-2c12G.key`。现有站点根是 `/var/www/finanpivot/current`，Nginx 只认这个软链。证书已经在 `/etc/letsencrypt/live/finanpivot.com/`。不要重新申请，也不要改其他 vhost。

1. 在准备发布的提交上构建并测试：

```powershell
npm run build:www
node --test sites/www/artifact.test.mjs
```

2. 读 `dist/www/ARTIFACT_SHA256.txt`。下面用 `<HASH>` 表示这 64 位十六进制，不要自己编。

3. 打包目录内容，不要把 `dist/www` 这一层打进包：

```powershell
tar -cf "$env:TEMP\finanpivot-www-<HASH>.tar" -C dist\www .
```

4. 上传。Oracle 的 SSH 经常在第一次握手超时，失败就原命令重试：

```powershell
scp -i "E:\Private\orcalssh\ssh-key-2026-07-30-2c12G.key" -o ConnectTimeout=90 -o ServerAliveInterval=15 "$env:TEMP\finanpivot-www-<HASH>.tar" ubuntu@161.33.29.236:/tmp/finanpivot-www-<HASH>.tar
```

5. 在服务器上安装。先记下当前软链，校验包内哈希和文件一致，再切换。`nginx -t` 失败或 reload 失败时，把软链指回 `PREV`：

```bash
set -eu
HASH=<HASH>
PREV=$(readlink -f /var/www/finanpivot/current)
REL=/var/www/finanpivot/releases/$HASH
sudo -n mkdir -p "$REL"
sudo -n tar -xf /tmp/finanpivot-www-$HASH.tar -C "$REL"
sudo -n chmod -R a+rX "$REL"
REMOTE=$(sudo -n cat "$REL/ARTIFACT_SHA256.txt" | tr -d '[:space:]')
test "$REMOTE" = "$HASH"
sudo -n ln -sfn "$REL" /var/www/finanpivot/current
sudo -n nginx -t
sudo -n nginx -s reload
echo PREV=$PREV
readlink -f /var/www/finanpivot/current
```

`sudo nginx -s reload` 可用。`systemctl reload nginx` 在这台机器上可能因权限失败，不要改用它去修。

6. 从本机核对。首页、英文页和 sitemap 要是这次构建里的句子，不能只看 HTTP 200：

```powershell
curl.exe -sS -o NUL -w "apex %{http_code}`n" https://finanpivot.com/
curl.exe -sS -o NUL -w "en %{http_code}`n" https://finanpivot.com/en/
curl.exe -sS -o NUL -w "www %{http_code}`n" https://www.finanpivot.com/
curl.exe -sS -o NUL -w "agentkind %{http_code}`n" https://agentkind.org/
```

回滚只动 FinanPivot 软链：

```bash
sudo -n ln -sfn <PREV> /var/www/finanpivot/current
sudo -n nginx -t && sudo -n nginx -s reload
```

## 腾讯云：只换内部 Finance

主机：`root@1.13.183.52`。密钥：`C:\Users\hayee\.ssh\id_ed25519`。进程是 `finance-desk`，单元里的工作目录是 `/opt/finance-finpivot`，启动文件是 `listen.mjs`。环境变量只在 `/etc/finance-desk.env`，不要随代码替换。

发布前读线上标记。如果线上 SHA 比准备发布的提交包含更多 `src/` 变更，停止，不要覆盖：

```powershell
ssh -i "C:\Users\hayee\.ssh\id_ed25519" -o ConnectTimeout=20 root@1.13.183.52 "grep sha /opt/finance-finpivot/.deploy_tag; systemctl is-active finance-desk; node -v"
```

1. 在干净提交上打包源码。排除依赖和本机构建结果：

```powershell
tar --exclude node_modules --exclude .git --exclude dist --exclude .output -cf "$env:TEMP\finance-src-<SHORT>.tar" -C . .
scp -i "C:\Users\hayee\.ssh\id_ed25519" -o ConnectTimeout=30 "$env:TEMP\finance-src-<SHORT>.tar" root@1.13.183.52:/tmp/finance-src-<SHORT>.tar
```

`<SHORT>` 用完整 Git SHA 的前 12 位，避免和旧包重名。

2. 在服务器的新目录里构建。这一步不停止正在服务的旧目录：

```bash
set -eu
SHA=<完整 Git SHA>
REL=/opt/finance-releases/$SHA
mkdir -p "$REL"
tar -xf /tmp/finance-src-<SHORT>.tar -C "$REL"
cd "$REL"
npm ci
npm run build
test -f .output/server/index.mjs
test -f listen.mjs
printf '%s\n' "{\"sha\":\"$SHA\",\"deployed_at\":\"<UTC 时间>\",\"note\":\"code deploy only; migration not part of this step\"}" > "$REL/.deploy_tag"
chown -R finance:finance "$REL"
chmod -R a+rX "$REL"
```

服务器上的 Node 是 22。`npm ci` 和 `npm run build` 必须在这台 Linux 上执行。

3. 切换并立刻验证。登录页失败就换回旧目录：

```bash
set -eu
SHA=<完整 Git SHA>
REL=/opt/finance-releases/$SHA
PREV=/opt/finance-finpivot.<旧 SHA 前 7 位>
test ! -e "$PREV"
systemctl stop finance-desk
mv /opt/finance-finpivot "$PREV"
ln -sfn "$REL" /opt/finance-finpivot
systemctl start finance-desk
sleep 2
curl -sf -o /dev/null http://127.0.0.1:4173/staff/login
curl -sk -o /dev/null --resolve finance.internal:8443:127.0.0.1 https://finance.internal:8443/staff/login
```

通过时还应看到：

- `ss -ltn` 里 `4173` 只在 `127.0.0.1`。
- 登录页正文含「工作人员入口」。
- `FINANCE_COOKIE_SECURE=1` 仍在 `/etc/finance-desk.env`。不要为了这次发布改它。
- `youyou.pet` 仍是 403，`contract.red` 仍是原来的状态码。

失败时：

```bash
systemctl stop finance-desk
rm -f /opt/finance-finpivot
mv "$PREV" /opt/finance-finpivot
systemctl start finance-desk
```

回滚后的目录如果当时是软链，按切换前 `readlink -f` 的结果指回去，不要假设它一定是普通目录。

## 做完

工作树执行 `git status -sb`，应没有未提交修改。本次发布的 Git SHA、官网 `ARTIFACT_SHA256`、两边的上一版路径写进 Issue 或发布记录。HTTP 200 只说明进程或页面有响应，不能代替登录、入账和业务闭环。
