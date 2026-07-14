@echo off
chcp 65001 >nul
setlocal

REM ============================================================
REM  TARS – zapnuti automatickeho startu (Windows)
REM  Vytvori ulohu v Planovaci uloh, ktera pri prihlaseni
REM  spusti server skryte na pozadi. Staci spustit jednou.
REM ============================================================

set "VBS=%~dp0start-tars.vbs"

echo.
echo   Zapinam automaticky start TARS...
echo.

schtasks /Create /TN "TARS" /SC ONLOGON /TR "wscript.exe \"%VBS%\"" /RL LIMITED /F
if errorlevel 1 goto :err

REM spustit rovnou i ted, at nemusis restartovat PC
schtasks /Run /TN "TARS" >nul 2>&1

echo.
echo   Hotovo. TARS se ted spousti sam pri kazdem prihlaseni do Windows.
echo   A prave jsem ho spustil i ted.
echo.
echo   Otevri v prohlizeci:   http://localhost:8787
echo   Z mobilu (Tailscale):  http://ADRESA-TVEHO-PC:8787
echo.
echo   (Vypnout automaticky start: spust uninstall.bat)
echo.
pause
exit /b 0

:err
echo.
echo   Neco se nepovedlo. Zkus soubor spustit znovu.
echo   Tip: pravy klik na install.bat -^> "Spustit jako spravce".
echo.
pause
exit /b 1
