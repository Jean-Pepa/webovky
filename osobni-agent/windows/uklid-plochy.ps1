<#
  Úklid plochy: roztřídí volné soubory z plochy do složek podle druhu. Nic nemaže, jen přesouvá.
  Nejdřív jen ukáže, co by udělal:
      powershell -ExecutionPolicy Bypass -File .\uklid-plochy.ps1
  Když to sedí, teprve přesune:
      powershell -ExecutionPolicy Bypass -File .\uklid-plochy.ps1 -Provest
  Poslední úklid vrátí zpátky:
      powershell -ExecutionPolicy Bypass -File .\uklid-plochy.ps1 -Vratit
  Složky, zástupce (.lnk, .url) a skryté soubory nechává na místě.
#>
param(
    [switch]$Provest,
    [switch]$Vratit
)
$ErrorActionPreference = 'Stop'

$plocha = [Environment]::GetFolderPath('Desktop')
$zaznamy = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Úklid plochy'
$ostatni = 'Ostatní'
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
    'Zvuk'              = 'mp3', 'm4a', 'wav', 'aac', 'flac', 'ogg'
    'Archivy'           = 'zip', 'rar', '7z', 'tar', 'gz'
    'Instalačky'        = 'exe', 'msi', 'msix', 'appx', 'iso', 'dmg'
}

function Get-Kategorie([string]$pripona) {
    $p = $pripona.TrimStart('.').ToLowerInvariant()
    foreach ($k in $kategorie.Keys) {
        if ($kategorie[$k] -contains $p) {
            return $k
        }
    }
    return $ostatni
}

# Když ve složce už soubor stejného jména je, přidá k názvu (2), (3)… Nic nepřepíše.
function Get-VolneJmeno([string]$slozka, [string]$jmeno) {
    $cil = Join-Path $slozka $jmeno
    if (-not (Test-Path -LiteralPath $cil)) {
        return $cil
    }
    $zaklad = [IO.Path]::GetFileNameWithoutExtension($jmeno)
    $pripona = [IO.Path]::GetExtension($jmeno)
    for ($i = 2; ; $i++) {
        $cil = Join-Path $slozka ('{0} ({1}){2}' -f $zaklad, $i, $pripona)
        if (-not (Test-Path -LiteralPath $cil)) {
            return $cil
        }
    }
}

if ($Vratit) {
    $posledni = Get-ChildItem -LiteralPath $zaznamy -Filter 'uklid-*.csv' -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notlike '*.vraceno.csv' } |
        Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if (-not $posledni) {
        Write-Host 'Nenašel jsem žádný úklid, který by šel vrátit.'
        exit
    }
    $vraceno = 0
    foreach ($radek in Import-Csv -LiteralPath $posledni.FullName) {
        if ((Test-Path -LiteralPath $radek.Kam) -and -not (Test-Path -LiteralPath $radek.Odkud)) {
            Move-Item -LiteralPath $radek.Kam -Destination $radek.Odkud
            $vraceno++
        } else {
            Write-Host "Přeskakuji (soubor už není na svém místě): $($radek.Kam)"
        }
    }
    Rename-Item -LiteralPath $posledni.FullName -NewName ($posledni.Name -replace '\.csv$', '.vraceno.csv')
    Write-Host "Vráceno $vraceno souborů na plochu. Prázdné složky po úklidu smaž ručně."
    exit
}

$soubory = Get-ChildItem -LiteralPath $plocha -File -Force | Where-Object {
    -not ($_.Attributes -band [IO.FileAttributes]::Hidden) -and
    -not ($_.Attributes -band [IO.FileAttributes]::System) -and
    $_.Extension -notin '.lnk', '.url' -and
    $_.Name -ne 'desktop.ini'
}
$plan = @(foreach ($soubor in $soubory) {
    [pscustomobject]@{ Slozka = (Get-Kategorie $soubor.Extension); Soubor = $soubor.Name; Cesta = $soubor.FullName }
})

Write-Host "Plocha: $plocha"
if ($plan.Count -eq 0) {
    Write-Host 'Na ploše nejsou žádné volné soubory k roztřídění.'
    exit
}
Write-Host ''
foreach ($skupina in $plan | Group-Object Slozka | Sort-Object Name) {
    Write-Host ('{0,-20} {1,4} souborů' -f $skupina.Name, $skupina.Count)
}
Write-Host ''
$plan | Sort-Object Slozka, Soubor | Format-Table Slozka, Soubor -AutoSize | Out-String -Width 220 | Write-Host

if (-not $Provest) {
    Write-Host 'Zatím se nic nepřesunulo. Když to sedí, spusť skript znovu s -Provest.'
    exit
}

New-Item -ItemType Directory -Force -Path $zaznamy | Out-Null
$zaznam = Join-Path $zaznamy ('uklid-{0:yyyy-MM-dd_HHmmss}.csv' -f (Get-Date))
$hotovo = New-Object System.Collections.Generic.List[object]
$chyby = 0
foreach ($polozka in $plan) {
    $slozka = Join-Path $plocha $polozka.Slozka
    New-Item -ItemType Directory -Force -Path $slozka | Out-Null
    $cil = Get-VolneJmeno $slozka $polozka.Soubor
    try {
        Move-Item -LiteralPath $polozka.Cesta -Destination $cil
        $hotovo.Add([pscustomobject]@{ Odkud = $polozka.Cesta; Kam = $cil })
    } catch {
        Write-Host "Nepřesunuto, soubor je asi otevřený: $($polozka.Soubor)"
        $chyby++
    }
}
$hotovo | Export-Csv -LiteralPath $zaznam -NoTypeInformation -Encoding UTF8
Write-Host "Přesunuto $($hotovo.Count) souborů, nepřesunuto $chyby."
Write-Host "Záznam o úklidu je v $zaznam. Vrátíš ho spuštěním s -Vratit."
