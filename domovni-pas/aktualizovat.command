#!/bin/bash
# BULO – stáhnout nejnovější změny (Mac). Dvojklik, když chci vidět nové úpravy.
cd "$(dirname "$0")"
echo "Stahuji nejnovejsi zmeny..."
git pull
echo ""
echo "Hotovo. V prohlizeci dej refresh (http://localhost:3000)."
echo "Toto okno muzes zavrit."
