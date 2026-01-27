# ETA Service Spec (propuesta)

## Objetivo
Calcular ETA y distancia para rutas de taxi usando OSRM para geometría y velocidades de flota para tráfico, con fallbacks a histórico y perfil por defecto.

## Endpoint
- `POST /eta`
  - Body:
    ```json
    {
      "startLat": number,
      "startLng": number,
      "endLat": number,
      "endLng": number,
      "mode": "car" | "moto" | "van",
      "cooperativeId": string | null
    }
    ```
  - Respuesta:
    ```json
    {
      "distanceKm": number,
      "etaMinutes": number,
      "confidence": number,          // 0..1 basado en densidad de datos recientes
      "source": "fleet" | "historic" | "default" | "blended" | "external",
      "routeGeoJson": object | null  // opcional: para reusar en el cliente
    }
    ```

## Flujo de cálculo
1) **Ruta base**: consulta OSRM `/route/v1/driving/{startLng},{startLat};{endLng},{endLat}?overview=false&annotations=distance` (u overview=full si se requiere geometría). Cachea por hash de coordenadas redondeadas (5–6 decimales) en Redis `route:{hash}` con TTL 1h.
2) **Velocidad efectiva**:
   - Obtener tiles H3 para el trazo (nivel 9-10). Para cada tile, buscar velocidad reciente en Redis `speed:{mode}:{h3}:{bucket}` (bucket de 5–10 min).
   - Si no hay, usar velocidad histórica por franja horaria/día `speed:hist:{mode}:{h3}:{dow}:{hour}` (tabla en Postgres/ClickHouse).
   - Si tampoco hay, usar velocidad por defecto (p.ej. car: 35 km/h urbano).
   - Promediar ponderado por longitud de la ruta dentro de cada tile.
3) **ETA**: `eta = distancia / vel_media + buffer` (buffer 1–2 min). Calcular `confidence` = min(1, muestras_recientes / umbral).
4) **Fallback premium (opcional)**: si `confidence < 0.3`, consultar proveedor externo solo para ETA y mezclar: `eta_final = 0.6*eta_fleet + 0.4*eta_external`.

## Datos y almacenamiento
- **Telemetría**: cada taxi envía `lat,lng,speedKph,timestamp,mode,cooperativeId`. Ingesta por Redis Streams/Kafka.
- **Agregador**: job que agrupa por H3 y ventana 5 min, guarda en Redis `speed:{mode}:{h3}:{bucket}` con `value = {avgKph, count}` TTL 30 min, y escribe histórico en Postgres/Timescale (tabla `speed_tile(mode,h3,dow,hour,avg_kph,count)`).
- **Cache rutas**: Redis clave `route:{hash}` → `{distanceKm, geometry(optional)}`.

## Redis claves (ejemplo)
- `speed:car:892830829abffff:2026-01-26T14:05` → `{avgKph: 24.3, count: 18}`
- `speed:hist:car:892830829abffff:1:14` → `{avgKph: 28.1, count: 220}` (dow=1 lunes, hour=14)
- `route:abc123` → `{distanceKm: 8.7, coords: [...]}` (TTL 3600s)

## Endpoint interno de ingesta (opcional)
- `POST /telemetry` (autenticado) para flota propia; escribe en stream/cola, no en Redis directo.

## Stack sugerido
- Runtime: Node/NestJS o Go.
- Redis: cache de rutas y velocidades recientes.
- Postgres+Timescale o ClickHouse: histórico por franja horaria.
- OSRM: ya desplegado; dos réplicas detrás de un LB (Traefik/NGINX).
- Observabilidad: métricas Prometheus (`eta_requests_total`, `eta_confidence_histogram`, latencia OSRM).

## Seguridad
- Autenticación por token/bearer en `/eta` si se expone a otros clientes internos.
- Rate limit básico en el gateway (p.ej., 50 rps por token).

## Roadmap corto
1) Implementar `/eta` consultando OSRM + Redis con fallback a default speed.
2) Ingesta básica de telemetría → Redis speeds recientes.
3) Persistencia histórica y uso por franja horaria.
4) Blend con proveedor externo opcional.
