$BackupDir = Join-Path $PSScriptRoot "..\backups"
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFilename = "yolohub_backup_${Timestamp}.archive.gz"
$ContainerName = "yolohub-db"
$DbName = "yolohub"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "[BACKUP] BAT DAU QUA TRINH SAO LUU DATABASE: $DbName" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Force -Path $BackupDir | Out-Null
}

$OutputPath = Join-Path $BackupDir $BackupFilename
Write-Host "[PROGRESS] Dang trich xuat du lieu tu container $ContainerName..." -ForegroundColor Yellow

docker exec $ContainerName mongodump --db $DbName --archive="/tmp/dump.gz" --gzip
docker cp "${ContainerName}:/tmp/dump.gz" $OutputPath
docker exec $ContainerName rm -f /tmp/dump.gz

if (Test-Path $OutputPath) {
    $Size = (Get-Item $OutputPath).Length
    Write-Host "[SUCCESS] SAO LUU THANH CONG!" -ForegroundColor Green
    Write-Host "[FILE] File luu tai: $OutputPath" -ForegroundColor Green
    Write-Host "[SIZE] Dung luong: $Size bytes" -ForegroundColor Green
}
else {
    Write-Host "[ERROR] Sao luu that bai!" -ForegroundColor Red
}
