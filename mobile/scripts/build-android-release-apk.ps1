param(
  [switch]$Clean
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

$androidDir = Join-Path $PSScriptRoot "..\\android"
$mobileDir = Join-Path $PSScriptRoot ".."

function Remove-IfExists {
  param(
    [Parameter(Mandatory = $true)]
    [string]$PathToDelete
  )

  if (-not (Test-Path -LiteralPath $PathToDelete)) {
    return
  }

  try {
    Remove-Item -LiteralPath $PathToDelete -Recurse -Force -ErrorAction Stop
    Write-Host "Removed stale native cache: $PathToDelete"
  } catch {
    Write-Host "Could not fully remove $PathToDelete. Continuing with build."
  }
}

Push-Location $androidDir
try {
  # Stop any stale daemons before cleaning native cache folders.
  & .\\gradlew.bat --stop | Out-Null

  # Clear caches that may retain old include paths (e.g. from .gradle-user-home).
  Remove-IfExists -PathToDelete (Join-Path $androidDir "app\\.cxx")
  Remove-IfExists -PathToDelete (Join-Path $mobileDir "node_modules\\react-native-screens\\android\\.cxx")
  Remove-IfExists -PathToDelete (Join-Path $mobileDir "node_modules\\expo-modules-core\\android\\.cxx")

  if ($Clean) {
    & .\\gradlew.bat clean
    if ($LASTEXITCODE -ne 0) {
      exit $LASTEXITCODE
    }
  }

  # Build ARM64 release APK to reduce local build time and avoid unnecessary ABIs.
  & .\\gradlew.bat assembleRelease -PreactNativeArchitectures=arm64-v8a
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}

$apkPath = Join-Path $androidDir "app\\build\\outputs\\apk\\release\\app-release.apk"
if (Test-Path $apkPath) {
  Write-Host "Release APK ready: $apkPath"
}
