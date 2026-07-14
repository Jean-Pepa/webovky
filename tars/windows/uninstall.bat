@echo off
chcp 65001 >nul

REM ============================================================
REM  TARS – vypnuti automatickeho startu (Windows)
REM  Odebere ulohu z Planovace uloh. Uz nahrane data zustavaji.
REM ============================================================

echo.
echo   Vypinam automaticky start TARS...
echo.

schtasks /Delete /TN "TARS" /F

echo.
echo   Hotovo. TARS uz se nebude spoustet sam.
echo   (Bezici server tim nezastavim - na to je stop-tars.bat.)
echo.
pause
