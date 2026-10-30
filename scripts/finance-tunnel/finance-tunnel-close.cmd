@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0finance-tunnel.ps1" -Action close
if errorlevel 1 pause
exit /b %ERRORLEVEL%
