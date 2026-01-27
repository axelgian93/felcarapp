# ðŸš– FelcarRide - Ecosistema de Transporte Inteligente

FelcarRide es una plataforma de movilidad de Ãºltima generaciÃ³n diseÃ±ada para el mercado ecuatoriano (enfocada inicialmente en Guayaquil). A diferencia de las apps de taxi tradicionales, FelcarRide integra Inteligencia Artificial para la estimaciÃ³n dinÃ¡mica de tarifas y una arquitectura multi-inquilino (multi-tenant) que permite a diferentes cooperativas gestionar su propia flota y reglas de negocio.

## ðŸš€ CaracterÃ­sticas Principales

### ðŸ¤– Inteligencia Artificial (Google Gemini)
- **EstimaciÃ³n DinÃ¡mica:** CÃ¡lculo de tarifas en tiempo real basado en trÃ¡fico, demanda y tipo de servicio (EconÃ³mico, Confort, XL).
- **Rutas Inteligentes:** OptimizaciÃ³n de puntos de recogida y destinos mediante procesamiento de lenguaje natural.

### ðŸ¢ Arquitectura Multi-Tenant (Cooperativas)
- **GestiÃ³n Independiente:** Cada cooperativa tiene su propio cÃ³digo de invitaciÃ³n, reglas de precios y panel administrativo.
- **Comisiones Flexibles:** ConfiguraciÃ³n de porcentajes de ganancia personalizados por grupo.

### ðŸ’¼ MÃ³dulo B2B (Corporativo)
- **CrÃ©dito Empresarial:** Permite a empresas (ej. El Rosado, Banco del PacÃ­fico) ofrecer transporte a sus empleados con facturaciÃ³n mensual.
- **LÃ­mites de Consumo:** Control de presupuesto por empresa y seguimiento de rutas corporativas.

### ðŸ“± Experiencia de Usuario (Rider & Driver)
- **Real-time Tracking:** Mapas interactivos con Leaflet.js.
- **Seguridad:** CÃ³digos OTP para inicio de viajes y botÃ³n de pÃ¡nico SOS.
- **Multiplataforma:** Web App optimizada y lista para Android/iOS mediante Capacitor.

## ðŸ›  Stack TecnolÃ³gico

- **Frontend:** React 19 + TypeScript + Tailwind CSS.
- **Build Tool:** Vite.
- **Base de Datos & Auth:** Firebase (Firestore & Authentication).
- **IA:** Google Gemini API (@google/genai).
- **Mapas:** Leaflet.js + OpenStreetMap (OSRM para rutas).
- **Mobile:** Ionic Capacitor.

---
Desarrollado con â¤ï¸ para el futuro de la movilidad en Ecuador.


felcar-ride/
â”œâ”€â”€ components/           # AquÃ­ van: MapBackground.tsx, AuthScreen.tsx, etc.
â”œâ”€â”€ src/
â”‚   â”œâ”€â”€ context/          # ThemeContext.tsx
â”‚   â”œâ”€â”€ services/         # authService.ts, tripService.ts, etc.
â”‚   â”œâ”€â”€ firebaseConfig.ts
â”‚   â””â”€â”€ mockData.ts
â”œâ”€â”€ services/             # geminiService.ts
â”œâ”€â”€ App.tsx
â”œâ”€â”€ index.tsx
â”œâ”€â”€ types.ts
â”œâ”€â”€ index.html
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json
â”œâ”€â”€ vite.config.ts
â”œâ”€â”€ capacitor.config.ts
â””â”€â”€ .env                  # Muy importante

## ConfiguraciÃ³n de entorno (.env)
- Copia `.env.example` a `.env` y completa las variables `VITE_FIREBASE_*` y `VITE_GEMINI_API_KEY`.
- Para producciÃ³n, mueve la clave de Gemini a un backend/proxy para evitar exponerla en el cliente.
- Opcional: si ejecutas el proxy de Gemini, define `VITE_GEMINI_PROXY_URL` (ej. `http://localhost:8787`).
- Para rutas, puedes usar tu propio OSRM: define `VITE_OSRM_URL` (ej. `http://localhost:5000`). Si no se define, se usa el demo pÃºblico de OSRM.
- ETA desde microservicio: define `VITE_ETA_URL` (ej. `http://localhost:8788`).

## Frontend en Docker
- Compose en `./docker/docker-compose.yml` (stack `taxiappFelcar`).
- Imagen multi-stage: construye con Node y sirve con Nginx (ver `Dockerfile` y `docker/nginx/default.conf`).
- Para levantar solo el frontend: desde `docker/` ejecutar `docker compose up app`.
- La app expone el puerto `80` del contenedor al `80` del host (ajusta en compose si necesitas otro).

## Microservicio ETA (backend)
- Archivo: `server/eta-service.ts`. Calcula ETA usando OSRM para la ruta y velocidades por defecto (placeholder para velocidades de flota).
- Variable: `OSRM_URL` (por defecto `http://localhost:5000`). Puerto por defecto del servicio: `8788`.
- Correr en dev: `npm run eta`. Endpoint: `POST /eta` con `{ startLat, startLng, endLat, endLng, mode? }` â†’ `{ distanceKm, etaMinutes, confidence, source, routeGeoJson }`.
- En futuro se puede conectar a Redis/DB para usar velocidades de la flota (ver `server/eta-service-spec.md`).
- Cache: el servicio ETA usa cachÃ© in-memory de 15s para rutas/ETA para reducir llamadas a OSRM. `/health` verifica conectividad a OSRM.

## Proxy Gemini (servidor opcional)
- Archivo: `server/gemini-proxy.ts` (Express). Requiere `GEMINI_API_KEY` en variables de entorno.
- Ejecuta con: `npm run proxy` (usa ts-node) despuÃ©s de exportar `GEMINI_API_KEY` y opcional `PORT`.
- El frontend usarÃ¡ automÃ¡ticamente el proxy si `VITE_GEMINI_PROXY_URL` estÃ¡ configurado (por defecto `http://localhost:8787`); con ello ya no se envÃ­a la clave al cliente.

## Servidor OSRM propio (ruteo)
- Requisitos: Docker y un archivo PBF (ej. `ecuador-latest.osm.pbf` de Geofabrik).
- Carpeta Docker: `./docker/`. El volumen de datos est? en `./docker/osrm-data/`.
- Descarga del PBF con script de ayuda (PowerShell): `powershell -ExecutionPolicy Bypass -File ./scripts/osrm-fetch.ps1` (usa Ecuador por defecto). Para otro mapa: `... -Url "https://download.geofabrik.de/south-america/peru-latest.osm.pbf"`.
- Levanta desde la carpeta `docker/`: `cd docker && docker compose up osrm` (usa `docker/docker-compose.yml`). Esto corre `extract/partition/customize` y expone `:5000`.
- Configura `VITE_OSRM_URL=http://localhost:5000` (o la IP/puerto donde lo despliegues).
- Si no defines la variable, el frontend usar? el demo p?blico `https://router.project-osrm.org` como fallback.

## Observabilidad
- Prometheus + Grafana en ./docker/docker-compose.yml (puertos 9090 y 3000; Grafana admin: felcar123).
- Scrapes: eta:8788, proxy:8787, osrm:5000 (smoke), pp:80 (/health en Nginx). Alertas en docker/prometheus/alerts.yml (error rate >2%, p90 >1s, uptime).
- Dashboard base: docker/grafana/provisioning/dashboards/json/felcar-observability.json (ETA y proxy: p50/p90/p99 y RPS).
- Logging JSON con pino en proxy y ETA; /metrics y /health en ambos. Nginx access log en JSON.

## Seguridad
- Secretos (Gemini, URLs) en variables de entorno; .dockerignore excluye .env del build para no hornear claves.
- Imágenes finales usan COPY sin montar el repo completo; en producción evita volúmenes con el código fuente.

## Mantenimiento OSRM (datos frescos)
- Refresca semanalmente: powershell -ExecutionPolicy Bypass -File ./scripts/osrm-refresh.ps1 (descarga último PBF de Ecuador, limpia .osrm y recrea el servicio osrm).
- Puedes agendarlo con el Programador de Tareas de Windows para ejecutarlo 1 vez por semana.

## OSRM en alta disponibilidad
- En docker-compose.yml hay dos instancias osrm-a y osrm-b balanceadas por osrm-lb (Nginx) que expone :5000.
- Levanta con: cd docker && docker compose up osrm-a osrm-b osrm-lb.
- Usa VITE_OSRM_URL y OSRM_URL apuntando a http://localhost:5000 para que pasen por el balanceador.
- Para refrescar datos sin downtime: drena una instancia (stop osrm-a), corre osrm-refresh.ps1 o recrea solo ese servicio, luego repite con la otra.
