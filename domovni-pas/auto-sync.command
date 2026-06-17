#!/bin/bash
# BULO auto-sync (Mac): každých 15 s sám stáhne nové změny. Dvojklik a nech běžet.
cd "$(dirname "$0")"
echo "== BULO auto-sync =="
echo "Kazdych 15 sekund sam stahuji nejnovejsi zmeny."
echo "Toto okno nech otevrene vedle okna se serverem."
while true; do
  git pull
  sleep 15
done
