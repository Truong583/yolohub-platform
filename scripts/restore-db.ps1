param (
    [string]$BackupFile
)

$BackupDir = Join-Path $PSScriptRoot "..\backups"
$ContainerName = "yolohub-db"
$DbName = "yolohub"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "[RESTORE] BAT DAU QUA TRINH PHUC HOI DATABASE: $DbName" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not $BackupFile) {
    $Latest = Get-ChildItem (Join-Path $BackupDir "yolohub_backup_*.archive.gz") -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($Latest) {
        $BackupFile = $Latest.FullName
    }
}

if (-not $BackupFile -or -not (Test-Path $BackupFile)) {
    Write-Host "[ERROR] Khong tim thay file backup nao de phuc hoi!" -ForegroundColor Red
    exit 1
}

Write-Host "[INFO] File duoc chon: $BackupFile" -ForegroundColor Yellow
Write-Host "[PROGRESS] Dang nap du lieu va xoa du lieu cu (--drop)..." -ForegroundColor Yellow

docker cp $BackupFile "${ContainerName}:/tmp/restore.gz"
docker exec $ContainerName mongorestore --archive="/tmp/restore.gz" --gzip --drop
docker exec $ContainerName rm -f /tmp/restore.gz

Write-Host "[SUCCESS] PHUC HOI THANH CONG!" -ForegroundColor Green
Write-Host "[INFO] Database $DbName da duoc khoi phuc nguyen ven!" -ForegroundColor Green
