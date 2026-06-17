@echo off
REM BULO auto-sync (Windows): kazdych 15s sam stahne nove zmeny. Dvojklik a nech bezet.
cd /d "%~dp0"
echo == BULO auto-sync ==
echo Kazdych 15 sekund sam stahuji nejnovejsi zmeny.
echo Toto okno nech otevrene vedle okna se serverem.
echo (ukoncis zavrenim okna)
echo.
:loop
git pull
timeout /t 15 /nobreak >nul
goto loop
