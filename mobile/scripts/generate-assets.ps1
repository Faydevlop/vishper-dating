$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$assetsDir = Join-Path $PSScriptRoot "..\assets"
New-Item -ItemType Directory -Force -Path $assetsDir | Out-Null

function New-RoundRectPath {
  param(
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [float]$Radius
  )

  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = [Math]::Max(1, $Radius * 2)

  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()

  return $path
}

function New-Bitmap {
  param(
    [int]$Width,
    [int]$Height
  )

  return New-Object System.Drawing.Bitmap($Width, $Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
}

function Use-HighQualityGraphics {
  param([System.Drawing.Graphics]$Graphics)

  $Graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $Graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $Graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
}

function Draw-WhisperLogo {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$CenterX,
    [float]$CenterY,
    [float]$Size,
    [System.Drawing.Color]$BodyColor,
    [System.Drawing.Color]$SlotColor,
    [System.Drawing.Color]$LineColor,
    [bool]$WithSlot = $true
  )

  $bodyWidth = $Size * 0.34
  $bodyHeight = $Size * 0.47
  $bodyX = $CenterX - ($bodyWidth / 2)
  $bodyY = $CenterY - ($Size * 0.33)
  $bodyRadius = $bodyWidth / 2

  $bodyPath = New-RoundRectPath -X $bodyX -Y $bodyY -Width $bodyWidth -Height $bodyHeight -Radius $bodyRadius
  $bodyBrush = New-Object System.Drawing.SolidBrush($BodyColor)
  $Graphics.FillPath($bodyBrush, $bodyPath)

  if ($WithSlot) {
    $slotWidth = $bodyWidth * 0.34
    $slotHeight = $bodyHeight * 0.58
    $slotX = $CenterX - ($slotWidth / 2)
    $slotY = $bodyY + ($bodyHeight * 0.21)

    $slotPath = New-RoundRectPath -X $slotX -Y $slotY -Width $slotWidth -Height $slotHeight -Radius ($slotWidth / 2)
    $slotBrush = New-Object System.Drawing.SolidBrush($SlotColor)
    $Graphics.FillPath($slotBrush, $slotPath)
    $slotBrush.Dispose()
    $slotPath.Dispose()
  }

  $linePen = New-Object System.Drawing.Pen($LineColor, ($Size * 0.055))
  $linePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
  $linePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

  $arcWidth = $Size * 0.66
  $arcHeight = $Size * 0.54
  $arcX = $CenterX - ($arcWidth / 2)
  $arcY = $CenterY - ($Size * 0.35)
  $Graphics.DrawArc($linePen, $arcX, $arcY, $arcWidth, $arcHeight, 38, 104)

  $stemTopY = $CenterY + ($Size * 0.11)
  $stemBottomY = $CenterY + ($Size * 0.30)
  $Graphics.DrawLine($linePen, $CenterX, $stemTopY, $CenterX, $stemBottomY)

  $baseHalf = $Size * 0.12
  $Graphics.DrawLine($linePen, $CenterX - $baseHalf, $stemBottomY, $CenterX + $baseHalf, $stemBottomY)

  $linePen.Dispose()
  $bodyBrush.Dispose()
  $bodyPath.Dispose()
}

# icon.png (1024x1024)
$iconBitmap = New-Bitmap -Width 1024 -Height 1024
$iconGraphics = [System.Drawing.Graphics]::FromImage($iconBitmap)
Use-HighQualityGraphics -Graphics $iconGraphics

$iconRect = New-Object System.Drawing.Rectangle(0, 0, 1024, 1024)
$iconGradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $iconRect,
  [System.Drawing.Color]::FromArgb(126, 76, 224),
  [System.Drawing.Color]::FromArgb(78, 42, 141),
  45
)
$iconGraphics.FillRectangle($iconGradient, $iconRect)

$haloBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(72, 179, 157, 219))
$iconGraphics.FillEllipse($haloBrush, 70, 70, 560, 560)

Draw-WhisperLogo -Graphics $iconGraphics -CenterX 512 -CenterY 520 -Size 620 -BodyColor ([System.Drawing.Color]::White) -SlotColor ([System.Drawing.Color]::FromArgb(108, 63, 197)) -LineColor ([System.Drawing.Color]::White) -WithSlot $true

$iconPath = Join-Path $assetsDir "icon.png"
$iconBitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)

$haloBrush.Dispose()
$iconGradient.Dispose()
$iconGraphics.Dispose()
$iconBitmap.Dispose()

# splash-icon.png (2048x2048 transparent)
$splashBitmap = New-Bitmap -Width 2048 -Height 2048
$splashGraphics = [System.Drawing.Graphics]::FromImage($splashBitmap)
Use-HighQualityGraphics -Graphics $splashGraphics
$splashGraphics.Clear([System.Drawing.Color]::Transparent)

$glowBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(70, 108, 63, 197))
$splashGraphics.FillEllipse($glowBrush, 560, 560, 928, 928)

$badgeRect = New-Object System.Drawing.Rectangle(650, 650, 748, 748)
$badgeGradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $badgeRect,
  [System.Drawing.Color]::FromArgb(122, 74, 215),
  [System.Drawing.Color]::FromArgb(89, 49, 170),
  42
)
$splashGraphics.FillEllipse($badgeGradient, $badgeRect)

Draw-WhisperLogo -Graphics $splashGraphics -CenterX 1024 -CenterY 1045 -Size 470 -BodyColor ([System.Drawing.Color]::White) -SlotColor ([System.Drawing.Color]::FromArgb(108, 63, 197)) -LineColor ([System.Drawing.Color]::White) -WithSlot $true

$splashPath = Join-Path $assetsDir "splash-icon.png"
$splashBitmap.Save($splashPath, [System.Drawing.Imaging.ImageFormat]::Png)

$badgeGradient.Dispose()
$glowBrush.Dispose()
$splashGraphics.Dispose()
$splashBitmap.Dispose()

# android-icon-foreground.png (1024x1024 transparent)
$fgBitmap = New-Bitmap -Width 1024 -Height 1024
$fgGraphics = [System.Drawing.Graphics]::FromImage($fgBitmap)
Use-HighQualityGraphics -Graphics $fgGraphics
$fgGraphics.Clear([System.Drawing.Color]::Transparent)

$fgCircleRect = New-Object System.Drawing.Rectangle(212, 212, 600, 600)
$fgCircleGradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $fgCircleRect,
  [System.Drawing.Color]::FromArgb(122, 74, 215),
  [System.Drawing.Color]::FromArgb(89, 49, 170),
  45
)
$fgGraphics.FillEllipse($fgCircleGradient, $fgCircleRect)
Draw-WhisperLogo -Graphics $fgGraphics -CenterX 512 -CenterY 528 -Size 380 -BodyColor ([System.Drawing.Color]::White) -SlotColor ([System.Drawing.Color]::FromArgb(108, 63, 197)) -LineColor ([System.Drawing.Color]::White) -WithSlot $true

$fgPath = Join-Path $assetsDir "android-icon-foreground.png"
$fgBitmap.Save($fgPath, [System.Drawing.Imaging.ImageFormat]::Png)

$fgCircleGradient.Dispose()
$fgGraphics.Dispose()
$fgBitmap.Dispose()

# android-icon-background.png (1024x1024)
$bgBitmap = New-Bitmap -Width 1024 -Height 1024
$bgGraphics = [System.Drawing.Graphics]::FromImage($bgBitmap)
Use-HighQualityGraphics -Graphics $bgGraphics

$bgRect = New-Object System.Drawing.Rectangle(0, 0, 1024, 1024)
$bgGradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $bgRect,
  [System.Drawing.Color]::FromArgb(16, 16, 27),
  [System.Drawing.Color]::FromArgb(13, 13, 13),
  90
)
$bgGraphics.FillRectangle($bgGradient, $bgRect)

$bgOrb = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(44, 108, 63, 197))
$bgGraphics.FillEllipse($bgOrb, 140, 120, 720, 720)

$bgPath = Join-Path $assetsDir "android-icon-background.png"
$bgBitmap.Save($bgPath, [System.Drawing.Imaging.ImageFormat]::Png)

$bgOrb.Dispose()
$bgGradient.Dispose()
$bgGraphics.Dispose()
$bgBitmap.Dispose()

# android-icon-monochrome.png (1024x1024 transparent)
$monoBitmap = New-Bitmap -Width 1024 -Height 1024
$monoGraphics = [System.Drawing.Graphics]::FromImage($monoBitmap)
Use-HighQualityGraphics -Graphics $monoGraphics
$monoGraphics.Clear([System.Drawing.Color]::Transparent)
Draw-WhisperLogo -Graphics $monoGraphics -CenterX 512 -CenterY 520 -Size 620 -BodyColor ([System.Drawing.Color]::White) -SlotColor ([System.Drawing.Color]::White) -LineColor ([System.Drawing.Color]::White) -WithSlot $false

$monoPath = Join-Path $assetsDir "android-icon-monochrome.png"
$monoBitmap.Save($monoPath, [System.Drawing.Imaging.ImageFormat]::Png)

$monoGraphics.Dispose()
$monoBitmap.Dispose()

# favicon.png (48x48)
$faviconBitmap = New-Bitmap -Width 48 -Height 48
$faviconGraphics = [System.Drawing.Graphics]::FromImage($faviconBitmap)
Use-HighQualityGraphics -Graphics $faviconGraphics
$faviconGraphics.Clear([System.Drawing.Color]::FromArgb(13, 13, 13))

$favRect = New-Object System.Drawing.Rectangle(0, 0, 48, 48)
$favGradient = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $favRect,
  [System.Drawing.Color]::FromArgb(122, 74, 215),
  [System.Drawing.Color]::FromArgb(89, 49, 170),
  45
)
$faviconGraphics.FillEllipse($favGradient, 4, 4, 40, 40)
Draw-WhisperLogo -Graphics $faviconGraphics -CenterX 24 -CenterY 25 -Size 22 -BodyColor ([System.Drawing.Color]::White) -SlotColor ([System.Drawing.Color]::FromArgb(108, 63, 197)) -LineColor ([System.Drawing.Color]::White) -WithSlot $false

$faviconPath = Join-Path $assetsDir "favicon.png"
$faviconBitmap.Save($faviconPath, [System.Drawing.Imaging.ImageFormat]::Png)

$favGradient.Dispose()
$faviconGraphics.Dispose()
$faviconBitmap.Dispose()

Write-Output "Generated Whisper app assets in $assetsDir"
