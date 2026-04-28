param(
  [switch]$SetDefaultApp
)

$ErrorActionPreference = "Stop"

$extensions = @(".mu", ".lessmark")
$progId = "Lessmark.Document"
$contentType = "text/vnd.lessmark"

foreach ($extension in $extensions) {
  $extensionKey = "HKCU:\Software\Classes\$extension"
  New-Item -Path $extensionKey -Force | Out-Null
  New-ItemProperty -Path $extensionKey -Name "Content Type" -Value $contentType -PropertyType String -Force | Out-Null
  New-ItemProperty -Path $extensionKey -Name "PerceivedType" -Value "text" -PropertyType String -Force | Out-Null

  $openWithKey = Join-Path $extensionKey "OpenWithProgids"
  New-Item -Path $openWithKey -Force | Out-Null
  New-ItemProperty -Path $openWithKey -Name $progId -Value ([byte[]]@()) -PropertyType Binary -Force | Out-Null

  if ($SetDefaultApp) {
    Set-ItemProperty -Path $extensionKey -Name "(default)" -Value $progId
  }
}

$progIdKey = "HKCU:\Software\Classes\$progId"
New-Item -Path $progIdKey -Force | Out-Null
Set-ItemProperty -Path $progIdKey -Name "(default)" -Value "Lessmark document"
New-ItemProperty -Path $progIdKey -Name "FriendlyTypeName" -Value "Lessmark document" -PropertyType String -Force | Out-Null

if ($SetDefaultApp) {
  $commandKey = Join-Path $progIdKey "shell\open\command"
  New-Item -Path $commandKey -Force | Out-Null
  Set-ItemProperty -Path $commandKey -Name "(default)" -Value 'notepad.exe "%1"'
}

Write-Host "Registered .mu and .lessmark as $contentType for the current Windows user."
if (-not $SetDefaultApp) {
  Write-Host "Default app was not changed. Re-run with -SetDefaultApp to open Lessmark files with Notepad by default."
}
