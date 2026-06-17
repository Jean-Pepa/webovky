@echo off
REM BULO - stahnout nejnovejsi zmeny (Windows). Dvojklik, kdyz chci videt nove upravy.
cd /d "%~dp0"
echo Stahuji nejnovejsi zmeny...
git pull
echo.
echo Hotovo. V prohlizeci dej refresh (http://localhost:3000).
pause
