param(
  [string]$Port = "8081",
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$ExtraArgs
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

Set-GradleUserHomeForWindowsPathLimit

& npx expo run:android --port $Port @ExtraArgs
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}
