param(
  [string]$Port = "8081",
  [string]$DeviceId = ""
)

$ErrorActionPreference = "Stop"

function Set-GradleUserHomeForWindowsPathLimit {
  $recommendedGradleHome = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\\.g"))
  if (-not (Test-Path $recommendedGradleHome)) {
    New-Item -ItemType Directory -Path $recommendedGradleHome | Out-Null
  }

  if ($env:GRADLE_USER_HOME -and $env:GRADLE_USER_HOME.Length -le 40) {
    return
  }

  $env:GRADLE_USER_HOME = $recommendedGradleHome
  Write-Host "Using GRADLE_USER_HOME=$($env:GRADLE_USER_HOME) to avoid Windows path-length issues."
}

function Stop-ProcessOnPort {
  param(
    [Parameter(Mandatory = $true)]
    [string]$TargetPort
  )

  $listeners = Get-NetTCPConnection -LocalPort $TargetPort -State Listen -ErrorAction SilentlyContinue
  if (-not $listeners) {
    return
  }

  $pids = $listeners | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($id in $pids) {
    try {
      Stop-Process -Id $id -Force -ErrorAction Stop
      Write-Host "Stopped stale process on port $TargetPort (PID $id)."
    } catch {
      Write-Host "Could not stop PID $id on port $TargetPort. Continuing."
    }
  }
}

function Get-FirstUsbDeviceName {
  $adbPath = $null
  $adbCmd = Get-Command adb -ErrorAction SilentlyContinue
  if ($adbCmd) {
    $adbPath = $adbCmd.Source
  } else {
    $localPropertiesPath = Join-Path $PSScriptRoot "..\\android\\local.properties"
    if (Test-Path $localPropertiesPath) {
      $localProperties = Get-Content $localPropertiesPath
      foreach ($line in $localProperties) {
        if ($line -match "^sdk\.dir=(.+)$") {
          $sdkDir = $matches[1] -replace "\\\\", "\"
          $candidate = Join-Path $sdkDir "platform-tools\\adb.exe"
          if (Test-Path $candidate) {
            $adbPath = $candidate
          }
          break
        }
      }
    }
  }

  if (-not $adbPath) {
    return $null
  }

  $lines = & $adbPath devices
  if (-not $lines) {
    return $null
  }

  $devices = @()
  foreach ($line in $lines) {
    if ($line -match "^\s*$" -or $line -like "List of devices*") {
      continue
    }

    $parts = $line -split "\s+"
    if ($parts.Length -ge 2 -and $parts[1] -eq "device") {
      $devices += $parts[0]
    }
  }

  if ($devices.Count -gt 0) {
    $serial = $devices[0]
    $model = & $adbPath -s $serial shell getprop ro.product.model
    if ($model) {
      $modelName = ($model | Out-String).Trim()
      if ($modelName) {
        return $modelName
      }
    }
    return $serial
  }

  return $null
}

Set-GradleUserHomeForWindowsPathLimit

Stop-ProcessOnPort -TargetPort $Port

$resolvedDeviceId = $DeviceId
if (-not $resolvedDeviceId) {
  $resolvedDeviceId = Get-FirstUsbDeviceName
}

if ($resolvedDeviceId) {
  Write-Host "Using USB device: $resolvedDeviceId"
  & npx expo run:android --device $resolvedDeviceId --port $Port
} else {
  Write-Host "No USB device detected via adb. Falling back to device picker."
  & npx expo run:android --device --port $Port
}

if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
