@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0finance-tunnel.ps1" -Action open
if errorlevel 1 (
  echo.
  echo Finance 隧道没有打开浏览器。上面是原因。
  pause
)
exit /b %ERRORLEVEL%
