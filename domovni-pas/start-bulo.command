#!/bin/bash
# BULO – spuštění (Mac). Dvojklik na tento soubor.
cd "$(dirname "$0")"
echo "== BULO =="
echo "Stahuji nejnovejsi verzi..."
git pull
echo "Instaluji zavislosti (jen poprve to chvili trva)..."
npm install
echo ""
echo "Spoustim BULO -> otevri v prohlizeci:  http://localhost:3000"
echo "(toto okno nech otevrene; ukoncis ho zavrenim nebo Ctrl+C)"
npm run dev
