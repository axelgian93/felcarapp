# FelcarRide - Plan de despliegue Azure (HA ligera con Docker Compose)

## Topología
- 2× VM (Ubuntu 22.04) Standard D4s v5 (4 vCPU, 16 GB RAM)
- LB público (Azure Application Gateway o Azure Load Balancer) para front HTTPS
- DNS en Azure DNS

## Roles por VM
**VM-1 (app-core)**
- Contenedores: `osrm-lb`, `osrm-a`, `eta`, `proxy`, `frontend` (Nginx), `prometheus`, `grafana`
- Disco OSRM dedicado: SSD Premium 50–100 GB montado en `/data/osrm`

**VM-2 (app-core-b)**
- Contenedores: `osrm-lb`, `osrm-b` (rolling refresh), opcional réplica de `frontend`/`prometheus`/`grafana` para mayor HA
- Disco OSRM dedicado similar (se refresca o sincroniza PBF/OSRM)

## Puertos / Exposición
- Público: 80/443 → frontend (Nginx)
- Interno (VNet):
  - 8788 → ETA
  - 8787 → Proxy Gemini
  - 5000 → OSRM LB (Nginx que balancea `osrm-a`/`osrm-b`)
  - 9090 → Prometheus (restringido)
  - 3000 → Grafana (restringido a IPs administrativas)
  - 22 → SSH/Bastion (solo administración)

## Balanceo y health checks
- App Gateway:
  - Backend pool: frontend en VM-1 (y opcional VM-2)
  - Probe: `/health`
- OSRM interno:
  - `osrm-lb` (Nginx) balancea `osrm-a` y `osrm-b`
  - Probe interno: `/route/v1/driving/0,0;0,0?overview=false`

## Refresco OSRM sin downtime
1) Drenar `osrm-b` (stop contenedor).
2) Refrescar datos en su disco (script `scripts/osrm-refresh.ps1` apuntado a esa instancia).
3) Levantar `osrm-b`.
4) Repetir con `osrm-a`.
`osrm-lb` mantiene servicio usando el backend disponible.

## Seguridad
- Secretos en Key Vault; inyectar via env vars.
- HTTPS terminado en App Gateway (cert gestionado).
- Reglas NSG limitando puertos internos y SSH.

## Observabilidad
- Prometheus + Grafana ya definidos en `docker/docker-compose.yml` (puertos internos 9090, 3000).
- Scrapes: eta, proxy, osrm, app.
- Alertas: `docker/prometheus/alerts.yml` (error rate, latencia p90, uptime).

## Comandos base (en VM)
```bash
git clone repo
cd docker
docker compose build
docker compose up -d app eta proxy osrm-a osrm-b osrm-lb prometheus grafana
```

## Opcional AKS (resumen)
- Cluster AKS con nodos D4s v5
- Deployments: frontend, eta, proxy, grafana, prometheus
- StatefulSets: osrm-a, osrm-b (PVC SSD Premium)
- Ingress Nginx + Azure LB
- PDBs para eta/frontend

## Infraestructura económica (aprox)
- **Opción ahorro (1 VM)**: 1× D2s v5 (2 vCPU/8 GB) + disco P15 256 GB para OSRM + IP pública. Servicios: frontend, eta, proxy, osrm-lb, osrm-a/osrm-b (en la misma VM, solo uno activo si prefieres), prom/grafana. Costo estimado: ~$110–130/mes.
- **Opción HA básica (2 VMs)**: 2× D4s v5 (4 vCPU/16 GB) + 2 discos P20 (64 GB) + App Gateway + 1 TB egress. Costo estimado: ~$520–650/mes.
- **Híbrido Firestore + Postgres gestionado (si migras datos de negocio a Postgres)**: añade ~$40–55/mes (Firestore + Azure Postgres B1/B2) al modelo económico, o reemplaza Firestore parcial para controlar costo por request.

## Diagrama ASCII
```
                  Internet
                      |
               Azure App Gateway (80/443, TLS)
                      |
           ------------------------------
           |                            |
        VM-1 (app-core)             VM-2 (app-core-b)
        D4s v5, SSD OSRM           D4s v5, SSD OSRM
           |                            |
   -------------------          -------------------
   |   |    |    |   |          |   |    |    |   |
 frontend  eta proxy osrm-lb   osrm-lb osrm-b (standby)
 (80)   (8788) (8787) (5000)           (5000)
 prom (9090) grafana (3000)        (opcional prom/graf)
   -------------------          -------------------
           |                            |
           \__________ VNet (privado) ___/
                      |
              OSRM backend pool
            osrm-lb → osrm-a / osrm-b
```
