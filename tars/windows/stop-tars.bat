@echo off
chcp 65001 >nul

REM ============================================================
REM  TARS – zastaveni beziciho serveru (Windows)
REM  Ukonci pouze ten node, ktery bezi jako TARS (server.js),
REM  ostatnich node procesu se nedotkne.
REM ============================================================

echo.
echo   Zastavuji bezici TARS server...

powershell -NoProfile -Command ^
  "Get-CimInstance Win32_Process | Where-Object { $_.Name -eq 'node.exe' -and $_.CommandLine -like '*server.js*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"

echo   Hotovo.
echo.
pause
