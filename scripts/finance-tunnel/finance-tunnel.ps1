param(
    [ValidateSet("open", "close")]
    [string]$Action = "open"
)

$ErrorActionPreference = "Stop"
$StateDir = Join-Path $env:LOCALAPPDATA "FinanceTunnel"
$StateFile = Join-Path $StateDir "tunnel.json"
$LogFile = Join-Path $StateDir "tunnel.log"
$KeyFile = Join-Path $env:USERPROFILE ".ssh\finance_tunnel_ed25519"
$KnownFile = Join-Path $env:USERPROFILE ".ssh\finance_tunnel_known_hosts"
$SshExe = Join-Path $env:SystemRoot "System32\OpenSSH\ssh.exe"
$HostsPath = Join-Path $env:SystemRoot "System32\drivers\etc\hosts"
$Url = "https://finance.internal:18443/staff/login"
$Forward = "127.0.0.1:18443:127.0.0.1:8443"
$HostKey = "SHA256:obVALHEs28scS1Dl7oZzdAUgIAgOVli37jqG6x3it1s"
$CaThumb = "B40DA386D7EE850162A009333518997DBB259648"
$PageMark = "工作人员入口"

function Write-Log {
    param([string]$Message)
    if (-not (Test-Path $StateDir)) {
        New-Item -ItemType Directory -Path $StateDir | Out-Null
    }
    $line = "{0} {1}" -f (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"), $Message
    Add-Content -LiteralPath $LogFile -Value $line -Encoding UTF8
}

function Fail {
    param([string]$Code, [string]$Message)
    Write-Log "FAIL $Code $Message"
    Write-Host $Message
    exit 1
}

function Test-HostsLine {
    $text = [IO.File]::ReadAllText($HostsPath)
    return $text -match '(?m)^\s*127\.0\.0\.1\s+finance\.internal(\s|$)'
}

function Add-HostsLine {
    if (Test-HostsLine) { return }
    $helper = Join-Path $StateDir "add-hosts.ps1"
    $script = @'
$p = Join-Path $env:SystemRoot "System32\drivers\etc\hosts"
$bak = "$p.bak-finance-tunnel"
Copy-Item -LiteralPath $p -Destination $bak -Force
$text = [IO.File]::ReadAllText($p)
if ($text -notmatch '(?m)^\s*127\.0\.0\.1\s+finance\.internal(\s|$)') {
    if (-not $text.EndsWith("`n") -and -not $text.EndsWith("`r`n")) { $text += "`r`n" }
    $text += "127.0.0.1 finance.internal`r`n"
    [IO.File]::WriteAllText($p, $text)
}
'@
    Set-Content -LiteralPath $helper -Value $script -Encoding UTF8
    $proc = Start-Process -FilePath "powershell.exe" -Verb RunAs -Wait -PassThru -ArgumentList @(
        "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", $helper
    )
    if ($proc.ExitCode -ne 0 -or -not (Test-HostsLine)) {
        Fail "LOCAL_HOSTS_ERROR" "未能写入 hosts。若弹出了权限确认，需要允许这一次。没有改动其他行。"
    }
}

function Update-ProxyBypass {
    $path = "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings"
    $item = Get-ItemProperty -Path $path
    if ($item.ProxyEnable -ne 1) { return $false }
    $current = [string]$item.ProxyOverride
    if ($current -match '(?i)(^|;)finance\.internal(;|$)') { return $false }
    $next = if ([string]::IsNullOrWhiteSpace($current)) { "finance.internal" } else { $current.TrimEnd(";") + ";finance.internal" }
    Set-ItemProperty -Path $path -Name ProxyOverride -Value $next
    Write-Log "proxy bypass added finance.internal"
    return $true
}

function Get-CommandLine {
    param([int]$ProcessId)
    $row = Get-CimInstance Win32_Process -Filter "ProcessId=$ProcessId"
    if ($row) { return [string]$row.CommandLine }
    return ""
}

function Test-OurTunnel {
    param([int]$ProcessId)
    $cmd = Get-CommandLine $ProcessId
    return $cmd -like "*$Forward*" -and $cmd -like "*finance-tunnel@1.13.183.52*"
}

function Get-PortOwners {
    @(Get-NetTCPConnection -LocalPort 18443 -State Listen -ErrorAction SilentlyContinue)
}

function Stop-OurTunnel {
    if (-not (Test-Path $StateFile)) { return $false }
    $state = Get-Content -Raw -LiteralPath $StateFile | ConvertFrom-Json
    $procId = [int]$state.pid
    if ($procId -le 0) { return $false }
    $alive = Get-Process -Id $procId -ErrorAction SilentlyContinue
    if (-not $alive) {
        Remove-Item -LiteralPath $StateFile -Force -ErrorAction SilentlyContinue
        return $false
    }
    if (-not (Test-OurTunnel $procId)) {
        Fail "LOCAL_PORT_CONFLICT" "状态文件里的进程不是本次 Finance 隧道，已保留该进程。"
    }
    Stop-Process -Id $procId -Force
    $deadline = (Get-Date).AddSeconds(8)
    do {
        $still = Get-PortOwners | Where-Object { $_.OwningProcess -eq $procId }
        if (-not $still) { break }
        Start-Sleep -Milliseconds 200
    } while ((Get-Date) -lt $deadline)
    Remove-Item -LiteralPath $StateFile -Force -ErrorAction SilentlyContinue
    return $true
}

function Assert-HostKey {
    if (-not (Test-Path $KnownFile)) { Fail "SSH_HOSTKEY_MISMATCH" "缺少专用 known_hosts，不能自动接受主机密钥。" }
    $found = (& ssh-keygen -F 1.13.183.52 -f $KnownFile -l 2>$null | Out-String)
    if ($found -notlike "*$HostKey*") {
        Fail "SSH_HOSTKEY_MISMATCH" "主机密钥指纹和已信任的记录不一致。"
    }
}

function Assert-Ca {
    $cert = Get-ChildItem Cert:\CurrentUser\Root | Where-Object { $_.Thumbprint -eq $CaThumb }
    if (-not $cert) { Fail "TLS_CERTIFICATE_INVALID" "当前用户的受信任根里没有 FinanPivot 隧道 CA。" }
    if ($cert.NotAfter -lt (Get-Date)) { Fail "TLS_CERTIFICATE_INVALID" "隧道 CA 已过期。" }
    if ($cert.Subject -notlike "*FinanPivot Internal Tunnel CA*") {
        Fail "TLS_CERTIFICATE_INVALID" "CA 主题和预期不一致。"
    }
}

function Wait-Listener {
    param([int]$ProcessId)
    $deadline = (Get-Date).AddSeconds(12)
    do {
        $rows = @(Get-PortOwners | Where-Object { $_.OwningProcess -eq $ProcessId -and $_.LocalAddress -eq "127.0.0.1" })
        $wide = @(Get-NetTCPConnection -LocalPort 18443 -State Listen -ErrorAction SilentlyContinue | Where-Object { $_.LocalAddress -ne "127.0.0.1" })
        if ($wide.Count -gt 0) { throw "18443 出现了非本机地址的监听。" }
        if ($rows.Count -gt 0) { return }
        if (-not (Get-Process -Id $ProcessId -ErrorAction SilentlyContinue)) { break }
        Start-Sleep -Milliseconds 200
    } while ((Get-Date) -lt $deadline)
    throw "SSH 没有在 127.0.0.1:18443 上监听。"
}

function Test-LoginPage {
    $tcp = [Net.Sockets.TcpClient]::new()
    $tcp.Connect("127.0.0.1", 18443)
    $ssl = [Net.Security.SslStream]::new($tcp.GetStream(), $false)
    try {
        $ssl.AuthenticateAsClient("finance.internal")
        $cert = [Security.Cryptography.X509Certificates.X509Certificate2]::new($ssl.RemoteCertificate)
        $san = $cert.Extensions | Where-Object { $_.Oid.Value -eq "2.5.29.17" }
        if (-not $san -or $san.Format($false) -notlike "*finance.internal*") {
            throw "证书 SAN 不含 finance.internal。"
        }
        $payload = [Text.Encoding]::ASCII.GetBytes("GET /staff/login HTTP/1.1`r`nHost: finance.internal:18443`r`nConnection: close`r`n`r`n")
        $ssl.Write($payload, 0, $payload.Length)
        $reader = [IO.StreamReader]::new($ssl)
        $text = $reader.ReadToEnd()
        if ($text -notmatch "HTTP/1\.[01] 200" -or $text -notlike "*$PageMark*") {
            throw "登录页没有返回预期内容。"
        }
    } finally {
        $ssl.Dispose()
        $tcp.Dispose()
    }
}

function Start-Tunnel {
    $psi = [Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = $SshExe
    $psi.Arguments = "-E `"$StateDir\ssh.log`" -N -T -i `"$KeyFile`" -o BatchMode=yes -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3 -o StrictHostKeyChecking=yes -o IdentitiesOnly=yes -o UserKnownHostsFile=`"$KnownFile`" -L $Forward finance-tunnel@1.13.183.52"
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $proc = [Diagnostics.Process]::Start($psi)
    @{ pid = $proc.Id; startedAt = (Get-Date).ToUniversalTime().ToString("o"); forward = $Forward } | ConvertTo-Json | Set-Content -LiteralPath $StateFile -Encoding UTF8
    return $proc.Id
}

if ($Action -eq "close") {
    $stopped = Stop-OurTunnel
    $left = @(Get-PortOwners)
    if ($left.Count -gt 0) { Fail "LOCAL_PORT_CONFLICT" "关闭后 18443 仍被其他进程占用，未处理该进程。" }
    if ($stopped) { Write-Host "Finance 隧道已关闭。" } else { Write-Host "没有正在运行的 Finance 隧道。" }
    exit 0
}

if (-not (Test-Path $SshExe)) { Fail "SSH_CLIENT_MISSING" "没有找到 Windows OpenSSH 客户端。" }
if (-not (Test-Path $KeyFile)) { Fail "SSH_AUTH_FAILED" "没有找到 Finance 隧道私钥。" }
Add-HostsLine
Update-ProxyBypass | Out-Null
Assert-HostKey
Assert-Ca

$owners = @(Get-PortOwners)
if ($owners.Count -gt 0) {
    $ownerId = [int]$owners[0].OwningProcess
    if (Test-OurTunnel $ownerId) {
        @{ pid = $ownerId; startedAt = (Get-Date).ToUniversalTime().ToString("o"); forward = $Forward } | ConvertTo-Json | Set-Content -LiteralPath $StateFile -Encoding UTF8
    } else {
        $name = (Get-Process -Id $ownerId -ErrorAction SilentlyContinue).ProcessName
        Fail "LOCAL_PORT_CONFLICT" "127.0.0.1:18443 已被其他程序占用：$name PID $ownerId。没有结束它。"
    }
} else {
    $started = Start-Tunnel
    try { Wait-Listener $started } catch {
        Stop-OurTunnel | Out-Null
        Fail "SSH_FORWARD_DENIED" $_.Exception.Message
    }
}

try {
    Test-LoginPage
} catch {
    $detail = $_.Exception.Message
    if ($_.Exception.InnerException) { $detail = $_.Exception.InnerException.Message }
    if ($script:tlsError) { $detail = "$detail TLS=$($script:tlsError)" }
    Stop-OurTunnel | Out-Null
    Fail "FINANCE_LOGIN_ROUTE_FAILED" $detail
}
Write-Log "OK login page"
Start-Process $Url
Write-Host "已打开 $Url"
exit 0
