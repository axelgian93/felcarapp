param(
    [string]$Url = "https://download.geofabrik.de/south-america/ecuador-latest.osm.pbf",
    [string]$OutDir = "./docker/osrm-data"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $OutDir)) {
    Write-Host "Creando carpeta $OutDir ..."
    New-Item -ItemType Directory -Path $OutDir | Out-Null
}

$fileName = Split-Path -Path $Url -Leaf
$dest = Join-Path $OutDir $fileName

Write-Host "Descargando $Url -> $dest"
Invoke-WebRequest -Uri $Url -OutFile $dest -UseBasicParsing

Write-Host "Listo. Archivo guardado en $dest"
