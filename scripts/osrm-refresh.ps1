param(
    [string]$Url = "https://download.geofabrik.de/south-america/ecuador-latest.osm.pbf"
)

$ErrorActionPreference = "Stop"

# Paths
$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$osrmDir = Join-Path $repoRoot "docker\osrm-data"
$composeDir = Join-Path $repoRoot "docker"
$pbfName = Split-Path -Leaf $Url
$pbfPath = Join-Path $osrmDir $pbfName

Write-Host "== OSRM refresh =="
Write-Host "Repo: $repoRoot"
Write-Host "PBF:  $Url"

if (-not (Test-Path $osrmDir)) { New-Item -ItemType Directory -Path $osrmDir | Out-Null }

Write-Host "Descargando PBF actualizado..."
Invoke-WebRequest -Uri $Url -OutFile $pbfPath -UseBasicParsing

Write-Host "Parando servicio osrm (si está corriendo)..."
Push-Location $composeDir
docker compose stop osrm | Out-Null

Write-Host "Limpiando binarios .osrm previos..."
Get-ChildItem $osrmDir -Filter "*.osrm*" | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Host "Reconstruyendo datos OSRM..."
docker compose up -d --force-recreate --no-deps osrm

Write-Host "Listo. OSRM levantado con datos nuevos."
Pop-Location
