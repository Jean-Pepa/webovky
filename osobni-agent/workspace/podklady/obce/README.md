# Územní plány obcí

Pro každou obec, kde pracuješ, jedna složka. Regulativy se vytáhnou jednou a použijí se pro
všechny další pozemky v obci, dokud se územní plán nezmění.

    obce/<obec>/
      zdroj.md               odkud je ÚP (odkaz, datum stažení, poslední změna, soudní zrušení)
      up-textova-cast.txt    textová část ÚP převedená na text (pdftotext -layout)
      regulativy.md          vytažené regulativy po plochách, s citací strany a verzí ÚP

Územní plány jsou veřejné dokumenty, proto je smí zpracovat i Claude, když lokální model
nestačí. Data projektů a klientů do toho nepatří.
