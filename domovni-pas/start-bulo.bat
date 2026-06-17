@echo off
REM BULO - spusteni (Windows). Dvojklik na tento soubor.
cd /d "%~dp0"
echo == BULO ==
echo Stahuji nejnovejsi verzi...
git pull
echo Instaluji zavislosti (jen poprve to chvili trva)...
call npm install
echo.
echo Spoustim BULO -^> otevri v prohlizeci:  http://localhost:3000
echo (toto okno nech otevrene)
call npm run dev
