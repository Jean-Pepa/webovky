<#
  Mapa počítače pro digitální kopii: co máš za složky a projekty, na čem a kdy jsi pracoval,
  co jsi naposledy otevíral a jaké programy používáš.
  Jen čte názvy, data a velikosti. Obsah souborů nečte, nic nemění a nic nikam neposílá.
  Mapu uloží do Dokumentů a otevře v Poznámkovém bloku. Než ji dáš agentovi, projdi ji
  a smaž řádky, které vidět nemá.
      powershell -ExecutionPolicy Bypass -File .\mapa-pocitace.ps1
#>
param(
    [int]$Mesicu = 24,
    [int]$Poslednich = 300
)
$ErrorActionPreference = 'SilentlyContinue'

$sep = [IO.Path]::DirectorySeparatorChar
$profil = $env:USERPROFILE
if (-not $profil) { $profil = $HOME }
$dnes = Get-Date
$vystup = Join-Path ([Environment]::GetFolderPath('MyDocuments')) ('mapa-pocitace-{0:yyyy-MM-dd}.md' -f $dnes)

# Složky, které do mapy nepatří: systém, agent, zálohy, vývojářské a skryté složky.
$vynechat = 'AppData', 'osobni-agent', 'ZalohyMozku', 'Mozek', 'Mozek-stary', 'Úklid plochy'
$sum = '[\\/](node_modules|\.git|\.venv|venv|__pycache__|\.cache|\$RECYCLE\.BIN|Úklid plochy)([\\/]|$)'
# Názvy, které můžou prozradit hesla nebo platební údaje, se v mapě skryjí.
$citlive = '(?i)(hesl|passw|password|rodn[eé].?[čc]|[čc][íi]slo.?[úu][čc]tu|iban|platebn|kreditn|credit.?card|tajn|secret|token|private.?key)'

$kategorie = [ordered]@{
    'Výkresy a modely'  = 'dwg', 'dxf', 'dwf', 'dwt', 'rvt', 'rfa', 'rte', 'rft', 'pln', 'pla', 'tpl', 'gsm', 'mod',
                          'ifc', '3dm', 'skp', 'dgn', 'nwd', 'nwc', 'fbx', 'obj', '3ds', 'max', 'stl', 'blend', 'c4d',
                          'drs', 'tm', 'ls11', 'ls12', 'ls13', 'ls2023', 'ls2024', 'ls2025'
    'PDF'               = 'pdf'
    'Dokumenty'         = 'doc', 'docx', 'odt', 'rtf', 'txt', 'md', 'pages'
    'Tabulky'           = 'xls', 'xlsx', 'xlsm', 'csv', 'ods', 'numbers'
    'Prezentace'        = 'ppt', 'pptx', 'key', 'odp'
    'Obrázky a rendery' = 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff', 'webp', 'heic', 'heif', 'svg', 'exr', 'hdr',
                          'raw', 'cr2', 'cr3', 'nef', 'arw', 'dng'
    'Grafika Adobe'     = 'psd', 'psb', 'ai', 'indd', 'idml', 'eps', 'afphoto', 'afdesign'
    'Videa'             = 'mp4', 'mov', 'avi', 'mkv', 'wmv', 'm4v'
    'Archivy'           = 'zip', 'rar', '7z', 'tar', 'gz'
    'Instalačky'        = 'exe', 'msi', 'msix', 'appx', 'iso', 'dmg'
}
$pripony = @{}
foreach ($k in $kategorie.Keys) {
    foreach ($p in $kategorie[$k]) {
        $pripony[$p] = $k
    }
}
$pracovni = 'Výkresy a modely', 'PDF', 'Dokumenty', 'Tabulky', 'Prezentace', 'Obrázky a rendery', 'Grafika Adobe', 'Videa'

function Get-Kategorie([string]$pripona) {
    $k = $pripony[$pripona.TrimStart('.').ToLowerInvariant()]
    if ($k) { return $k }
    return 'Ostatní'
}

function Skryj([string]$text) {
    if ($text -match $citlive) { return '[skrytý název]' }
    return $text
}

function Get-Relativni([string]$cesta) {
    if ($cesta.StartsWith($profil, [StringComparison]::OrdinalIgnoreCase)) {
        return $cesta.Substring($profil.Length).TrimStart('\', '/')
    }
    return $cesta
}

# Projektová složka: dvě úrovně pod profilem, u OneDrivu tři (Plocha a Obrázky jsou v něm).
function Get-Projekt([string]$relativni) {
    $casti = $relativni.Split([char[]]@('\', '/'))
    $hloubka = 2
    if ($casti[0] -like 'OneDrive*') { $hloubka = 3 }
    $n = [Math]::Min($hloubka, $casti.Count - 1)
    if ($n -lt 1) { return $casti[0] }
    return ($casti[0..($n - 1)] -join '\')
}

function Velikost([double]$bajty) {
    if ($bajty -ge 1GB) { return '{0:N1} GB' -f ($bajty / 1GB) }
    if ($bajty -ge 1MB) { return '{0:N0} MB' -f ($bajty / 1MB) }
    return '{0:N0} kB' -f ($bajty / 1KB)
}

Write-Host 'Procházím složky v profilu, může to pár minut trvat...'
$koreny = Get-ChildItem -LiteralPath $profil -Directory -Force | Where-Object {
    $_.Name -notin $vynechat -and -not $_.Name.StartsWith('.') -and
    -not ($_.Attributes -band [IO.FileAttributes]::System) -and
    -not ($_.Attributes -band [IO.FileAttributes]::Hidden)
}
$soubory = foreach ($koren in $koreny) {
    Get-ChildItem -LiteralPath $koren.FullName -File -Recurse -Force | Where-Object {
        $_.FullName -notmatch $sum -and -not ($_.Attributes -band [IO.FileAttributes]::Hidden)
    }
}

$zaznamy = foreach ($f in $soubory) {
    $rel = Get-Relativni $f.FullName
    [pscustomobject]@{
        Projekt   = Get-Projekt $rel
        Kategorie = Get-Kategorie $f.Extension
        Mesic     = $f.LastWriteTime.ToString('yyyy-MM')
        Zmena     = $f.LastWriteTime
        Velikost  = $f.Length
    }
}

$md = New-Object System.Collections.Generic.List[string]
$md.Add('# Mapa počítače')
$md.Add('')
$md.Add(('Vznikla {0:d. M. yyyy} skriptem `mapa-pocitace.ps1`. Obsahuje jen názvy složek a souborů, data a velikosti, ne jejich obsah. Názvy, které by mohly prozradit hesla nebo platební údaje, jsou skryté.' -f $dnes))
$md.Add('')
$md.Add('> Než mapu dáš agentovi, projdi ji a smaž řádky, které vidět nemá (klienti, soukromé věci).')
$md.Add('')

$md.Add("## Na čem jsem pracoval: posledních $Mesicu měsíců")
$md.Add('')
$md.Add('Pracovní soubory (výkresy, PDF, dokumenty, tabulky, obrázky, videa) podle měsíce poslední změny.')
$md.Add('')
$md.Add('| Měsíc | Souborů | Nejaktivnější složky |')
$md.Add('|---|---|---|')
$od = $dnes.AddMonths(-$Mesicu).ToString('yyyy-MM')
foreach ($m in $zaznamy | Where-Object { $_.Kategorie -in $pracovni -and $_.Mesic -ge $od } | Group-Object Mesic | Sort-Object Name -Descending) {
    $top = $m.Group | Group-Object Projekt | Sort-Object Count -Descending | Select-Object -First 3 |
        ForEach-Object { '{0} ({1})' -f (Skryj $_.Name), $_.Count }
    $md.Add(('| {0} | {1} | {2} |' -f $m.Name, $m.Count, ($top -join ', ')))
}
$md.Add('')

$md.Add('## Složky a projekty')
$md.Add('')
$md.Add('| Složka | Poslední změna | Souborů | Velikost | Převažuje |')
$md.Add('|---|---|---|---|---|')
foreach ($p in $zaznamy | Group-Object Projekt | Sort-Object { ($_.Group | Measure-Object Zmena -Maximum).Maximum } -Descending) {
    $posledni = ($p.Group | Measure-Object Zmena -Maximum).Maximum
    $velikost = ($p.Group | Measure-Object Velikost -Sum).Sum
    $druhy = $p.Group | Group-Object Kategorie | Sort-Object Count -Descending | Select-Object -First 3 |
        ForEach-Object { '{0} {1}' -f $_.Name.ToLowerInvariant(), $_.Count }
    $md.Add(('| {0} | {1:yyyy-MM-dd} | {2} | {3} | {4} |' -f (Skryj $p.Name), $posledni, $p.Count, (Velikost $velikost), ($druhy -join ', ')))
}
$md.Add('')

$md.Add('## Druhy souborů celkem')
$md.Add('')
$md.Add('| Druh | Souborů | Z toho za poslední rok |')
$md.Add('|---|---|---|')
$rok = $dnes.AddYears(-1)
foreach ($k in $zaznamy | Group-Object Kategorie | Sort-Object Count -Descending) {
    $nedavno = ($k.Group | Where-Object { $_.Zmena -ge $rok } | Measure-Object).Count
    $md.Add(('| {0} | {1} | {2} |' -f $k.Name, $k.Count, $nedavno))
}
$md.Add('')

$md.Add("## Naposledy otevřené soubory (nejvýš $Poslednich)")
$md.Add('')
$recent = Join-Path $env:APPDATA 'Microsoft\Windows\Recent'
$shell = $null
try { $shell = New-Object -ComObject WScript.Shell } catch { }
if ($shell -and (Test-Path -LiteralPath $recent)) {
    $md.Add('| Kdy | Soubor | Složka |')
    $md.Add('|---|---|---|')
    foreach ($lnk in Get-ChildItem -LiteralPath $recent -Filter '*.lnk' | Sort-Object LastWriteTime -Descending | Select-Object -First $Poslednich) {
        $cil = $shell.CreateShortcut($lnk.FullName).TargetPath
        if (-not $cil) { continue }
        $slozka = Get-Relativni ([IO.Path]::GetDirectoryName($cil))
        $md.Add(('| {0:yyyy-MM-dd} | {1} | {2} |' -f $lnk.LastWriteTime, (Skryj ([IO.Path]::GetFileName($cil))), (Skryj $slozka)))
    }
} else {
    $md.Add('Seznam posledních souborů se nepodařilo přečíst.')
}
$md.Add('')

$md.Add('## Programy')
$md.Add('')
$md.Add('| Program | Verze | Nainstalováno |')
$md.Add('|---|---|---|')
$klice = 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
         'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
         'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'
$programy = Get-ItemProperty -Path $klice | Where-Object {
    $_.DisplayName -and $_.SystemComponent -ne 1 -and -not $_.ParentKeyName -and
    $_.DisplayName -notmatch '(?i)redistributable|runtime|update for|hotfix|language pack|sdk|driver|ovladač'
} | Sort-Object DisplayName -Unique
foreach ($prog in $programy) {
    $datum = ''
    if ($prog.InstallDate -match '^\d{8}$') {
        $datum = '{0}-{1}-{2}' -f $prog.InstallDate.Substring(0, 4), $prog.InstallDate.Substring(4, 2), $prog.InstallDate.Substring(6, 2)
    }
    $md.Add(('| {0} | {1} | {2} |' -f $prog.DisplayName, $prog.DisplayVersion, $datum))
}

$md | Set-Content -LiteralPath $vystup -Encoding UTF8
Write-Host ''
Write-Host "Hotovo. Mapa je v $vystup"
Write-Host 'Projdi ji a smaž, co agent vidět nemá. Pak ji zkopíruj do Mozku:'
Write-Host ('  Copy-Item "{0}" "\\wsl.localhost\Ubuntu\home\<jméno v Ubuntu>\Mozek\prichozi\"' -f $vystup)
if ($IsWindows -ne $false) {
    Start-Process notepad.exe -ArgumentList "`"$vystup`""
}
