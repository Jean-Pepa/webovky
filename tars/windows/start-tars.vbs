' TARS – skrytý spouštěč serveru pro Windows.
' Spustí "node server.js" na pozadí BEZ černého okna příkazového řádku.
' Tenhle soubor je ve složce tars\windows\ , server.js je o úroveň výš (tars\).

Set fso = CreateObject("Scripting.FileSystemObject")
Set sh  = CreateObject("WScript.Shell")

' zjisti cesty podle umístění tohoto skriptu
winDir    = fso.GetParentFolderName(WScript.ScriptFullName)  ' ...\tars\windows
tarsDir   = fso.GetParentFolderName(winDir)                  ' ...\tars
serverPath = fso.BuildPath(tarsDir, "server.js")

' pracovní složka = tars\ (aby server našel svá data)
sh.CurrentDirectory = tarsDir

' spusť node skrytě (0 = bez okna), False = nečekej na konec
sh.Run "node """ & serverPath & """", 0, False
