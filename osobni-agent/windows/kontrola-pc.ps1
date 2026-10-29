<#
  Kontrola notebooku před instalací lokálního AI agenta.
  Jen čte, nic nemění ani nemaže. Výsledek uloží na Plochu do souboru kontrola-pc.txt.
  Spuštění v PowerShellu ze složky se skriptem:
      powershell -ExecutionPolicy Bypass -File .\kontrola-pc.ps1
#>
$ErrorActionPreference = 'SilentlyContinue'
$report = New-Object System.Collections.Generic.List[string]

function Say([string]$text) {
    Write-Host $text
    $report.Add($text)
}

function Head([string]$text) {
    Say ''
    Say "=== $text ==="
}

Head 'Systém'
$os = Get-CimInstance Win32_OperatingSystem
Say ("Windows: {0}, verze {1}, build {2}" -f $os.Caption, $os.Version, $os.BuildNumber)
$cs = Get-CimInstance Win32_ComputerSystem
Say ("Model: {0} {1}" -f $cs.Manufacturer, $cs.Model)
Say ("RAM: {0:N1} GB" -f ($cs.TotalPhysicalMemory / 1GB))
foreach ($cpu in Get-CimInstance Win32_Processor) {
    Say ("CPU: {0}" -f $cpu.Name.Trim())
}
foreach ($gpu in Get-CimInstance Win32_VideoController) {
    Say ("GPU: {0} (ovladač {1})" -f $gpu.Name, $gpu.DriverVersion)
}
if (Get-Command nvidia-smi -ErrorAction SilentlyContinue) {
    $smi = & nvidia-smi --query-gpu=name,memory.total,driver_version --format=csv,noheader
    foreach ($line in $smi) {
        Say "NVIDIA: $line"
    }
} else {
    Say '!! nvidia-smi nenalezen: nainstaluj ovladač NVIDIA (krok 2 návodu).'
}

Head 'Disky'
foreach ($disk in Get-CimInstance Win32_LogicalDisk -Filter 'DriveType=3') {
    $free = $disk.FreeSpace / 1GB
    $size = $disk.Size / 1GB
    $pct = 0
    if ($size -gt 0) {
        $pct = $free / $size * 100
    }
    Say ("{0} volno {1:N0} GB z {2:N0} GB ({3:N0} %)" -f $disk.DeviceID, $free, $size, $pct)
}
$systemDisk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
$freeC = [math]::Round($systemDisk.FreeSpace / 1GB)
if ($freeC -lt 100) {
    Say "!! Na C: je jen $freeC GB volna. Udělej úklid (krok 1), cíl je aspoň 150 GB."
} elseif ($freeC -lt 150) {
    Say "Na C: je $freeC GB volna. Stačí to, ale doporučuji uvolnit aspoň 150 GB."
} else {
    Say "Na C: je $freeC GB volna. Místa je dost."
}

Head 'Velké složky v tvém profilu'
$folders = @('Downloads', 'Desktop', 'Documents', 'Videos', 'Pictures', 'Music', 'AppData\Local\Temp')
foreach ($name in $folders) {
    $path = Join-Path $env:USERPROFILE $name
    if (Test-Path -LiteralPath $path) {
        $sum = (Get-ChildItem -LiteralPath $path -Recurse -File -Force -ErrorAction SilentlyContinue |
            Measure-Object -Property Length -Sum).Sum
        if (-not $sum) {
            $sum = 0
        }
        Say ("{0,-20} {1,8:N1} GB" -f $name, ($sum / 1GB))
    }
}

Head 'OneDrive'
$known = [ordered]@{ 'Plocha' = 'Desktop'; 'Dokumenty' = 'MyDocuments'; 'Obrázky' = 'MyPictures' }
foreach ($name in $known.Keys) {
    $path = [Environment]::GetFolderPath($known[$name])
    if ($path -match '\\OneDrive') {
        Say "${name}: zálohuje se na OneDrive"
    } else {
        Say "${name}: jen v notebooku"
    }
}
Say 'Mozek ani nic z agenta nedávej do složek, které se zálohují na OneDrive (krok 5 návodu).'

Head 'Největší nainstalované programy'
$keys = @(
    'HKLM:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKLM:\Software\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
    'HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\*'
)
$apps = Get-ItemProperty -Path $keys -ErrorAction SilentlyContinue |
    Where-Object { $_.DisplayName -and $_.EstimatedSize } |
    Sort-Object -Property EstimatedSize -Descending |
    Select-Object -First 25
foreach ($app in $apps) {
    Say ("{0,8:N1} GB  {1}" -f ($app.EstimatedSize / 1MB), $app.DisplayName)
}
Say 'Pozn.: velikost uvádí instalátor programu, u některých chybí nebo nesedí.'

Head 'WSL'
# Windows má vestavěný zástupný wsl.exe. Bez nainstalovaného WSL by místo výpisu nabídl instalaci,
# proto ho voláme jen tehdy, když je WSL opravdu nainstalované.
$wslInstalled = (Test-Path -LiteralPath (Join-Path $env:ProgramFiles 'WSL\wsl.exe')) -or
    (Get-Service -Name WSLService -ErrorAction SilentlyContinue)
if ($wslInstalled) {
    $env:WSL_UTF8 = '1'
    $oldEncoding = [Console]::OutputEncoding
    try { [Console]::OutputEncoding = [System.Text.Encoding]::UTF8 } catch { }
    foreach ($line in (& wsl.exe --status 2>&1)) {
        if ("$line".Trim()) {
            Say "$line"
        }
    }
    foreach ($line in (& wsl.exe --list --verbose 2>&1)) {
        if ("$line".Trim()) {
            Say "$line"
        }
    }
    try { [Console]::OutputEncoding = $oldEncoding } catch { }
} else {
    Say 'WSL zatím není nainstalované (krok 3 návodu).'
}

Head 'Ollama'
if (Get-Command ollama -ErrorAction SilentlyContinue) {
    Say ("Ollama: " + (& ollama --version 2>&1 | Select-Object -First 1))
    foreach ($line in (& ollama list 2>&1)) {
        Say "$line"
    }
} else {
    Say 'Ollama zatím není nainstalovaná (krok 4 návodu).'
}

Head 'Napájení a šifrování'
Say ("Schéma napájení: " + (& powercfg /getactivescheme))
$battery = Get-CimInstance Win32_Battery
if ($battery) {
    Say ("Baterie: {0} %" -f $battery.EstimatedChargeRemaining)
}
$bitlocker = Get-BitLockerVolume -MountPoint 'C:' -ErrorAction SilentlyContinue
if ($bitlocker) {
    Say ("BitLocker na C: {0}, zašifrováno {1} %" -f $bitlocker.ProtectionStatus, $bitlocker.EncryptionPercentage)
} else {
    Say 'Stav BitLockeru jde zjistit jen s právy správce. Zkontroluj ho v Nastavení > Ochrana osobních údajů a zabezpečení.'
}

$out = Join-Path ([Environment]::GetFolderPath('Desktop')) 'kontrola-pc.txt'
$report | Set-Content -LiteralPath $out -Encoding UTF8
Write-Host ''
Write-Host "Hotovo. Výsledek je uložený v $out" -ForegroundColor Green
