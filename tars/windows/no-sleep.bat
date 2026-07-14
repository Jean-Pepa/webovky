@echo off
chcp 65001 >nul

REM ============================================================
REM  TARS – aby PC neuspavalo (kdyz je zapojene v siti)
REM  Nastavi, ze pri napajeni ze zasuvky pocitac neusne ani
REM  nehibernuje. Displej muze zhasnout - to nevadi, server bezi dal.
REM  Vratit zpet: nastav si cisla podle sebe ve Windows nastaveni napajeni.
REM ============================================================

echo.
echo   Nastavuji, aby PC pri napajeni ze zasuvky neuspavalo...

powercfg /change standby-timeout-ac 0
powercfg /change hibernate-timeout-ac 0

echo   Hotovo. PC ted pri zapojeni do site neusne (server zustane dostupny).
echo.
pause
