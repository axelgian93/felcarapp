# FelcarRide – Módulos por rol (MVP)

Este README describe qué hace cada módulo del proyecto, organizado por rol.

## Roles
- **Pasajero (Rider)**
- **Conductor (Driver)**
- **Admin de cooperativa (Admin)**
- **Super Admin (SuperAdmin)**

---

## Pasajero (Rider)

**Flujo principal (App.tsx)**
- **Solicitud de viaje:** selección de origen/destino, tipo de servicio, ETA, confirmación.
- **Seguimiento del viaje:** estado, conductor asignado, progreso y acciones.
- **Permisos de la app:** modal inicial para GPS, notificaciones, cámara y galería.
- **Tema (dark/light):** botón en menú de usuario.

**Módulos UI (components/)**
- **AuthScreen:** login/registro/recuperación de contraseña.
- **MapBackground:** mapa, rutas, marcadores y ETA.
- **SavedPlacesModal:** gestión de lugares guardados.
- **ScheduledRidesModal:** viajes reservados y cancelación.
- **TripHistory:** historial de viajes del usuario.
- **PaymentMethodsModal:** métodos de pago y crédito corporativo.
- **HelpCenterModal:** ayuda y soporte.
- **NotificationsModal:** notificaciones de la cuenta.
- **RatingModal:** calificación del viaje.
- **CancellationModal:** cancelación de viaje con motivo.
- **ChatWindow:** chat entre pasajero y conductor.
- **ProfileMenu:** menú lateral con accesos, preferencias y permisos.

---

## Conductor (Driver)

**Flujo principal (App.tsx)**
- **Panel de conductor:** estado en línea/offline, info del vehículo y solicitudes.
- **Confirmación de inicio (OTP):** inicio de viaje con PIN.

**Módulos UI (components/)**
- **DriverEarningsModal:** ganancias, historial de pagos y horas conectadas.
- **MapBackground:** vista de ruta y tracking.
- **ChatWindow:** mensajería con el pasajero.
- **ProfileMenu:** datos personales, vehículo, documentos y preferencias.

---

## Admin de cooperativa (Admin)

**Panel principal (components/AdminPanel.tsx)**
- **Gestión de clientes (riders):** estado, edición y bloqueo.
- **Gestión de conductores:** estado, edición y bloqueo.
- **Empresas (B2B):** administración de cuentas corporativas.
- **Finanzas:** métricas generales y comisiones.
- **Soporte:** tickets y acciones rápidas.
- **Reportes:** KPIs y actividad.
- **Tarifas propias:** configuración por cooperativa.
- **Cambiar clave (rider/driver de su cooperativa):** modal de reseteo.
- **Tema dark/light:** botón en el menú.

**Módulos por familia (components/admin/)**
> Son vistas de UI por familia, con datos mock y acciones simuladas.

### Soporte
- **AdminSupportDashboard:** tablero de tickets, SLA y acciones rápidas.
- **CallCenterDispatchPanel:** panel de despacho y asignación.
- **CallCenterPerformanceAnalytics:** métricas operativas del call center.

### Operaciones / Flota
- **DriverDashboardModule:** estado operativo de conductores.
- **DriverTripHistoryModule:** historial y detalle de viajes.
- **DriverIncentivesTiers:** niveles e incentivos por desempeño.
- **DriverQueuePositionModule:** cola y posicionamiento.
- **DriverReviewsRatingsModule:** ratings y feedback.
- **FleetInventoryOverviewModule:** inventario de flota.
- **VehicleDetailsStatusModule:** detalle y estado de vehículo.
- **VehicleProfitabilityAnalyticsModule:** rentabilidad por vehículo.
- **MaintenanceAlertsPlannerModule:** alertas y planificación de mantenimiento.
- **MaintenanceLogRemindersModule:** log y recordatorios.
- **MaintenanceExpenseAnalyticsModule:** costos y tendencias.
- **DailyVehicleHealthCheckModule:** checklist diario de flota.
- **ShiftSchedulerModule:** turnos operativos.
- **TaxiRankQueuesModule:** colas por parada/taxi-rank.
- **SpeedAlertConfigurationModule:** configuración de alertas de velocidad.
- **SpeedingViolationsLogModule:** registro de infracciones.
- **GeofenceAlertDetailModule:** alertas por geocercas.
- **ZoneGeofencingManagerModule:** gestión de geocercas.

### Pasajeros
- **PassengerRideRequestModule:** solicitud de viaje (UI mock).
- **PassengerTripTrackingModule:** seguimiento del viaje.
- **PassengerTripHistoryModule:** historial de pasajero.
- **PassengerScheduledRideModule:** viajes programados.
- **PassengerSubscriptionsModule:** suscripciones y planes.

### Analítica / Reportes
- **OperationalReports:** reportes operativos.
- **WeeklyEarningsSummaryModule:** resumen semanal.
- **DemandHeatMapModule:** mapa de demanda.
- **DemandForecastModule:** predicción de demanda.
- **DeliveryPerformanceReportsModule:** rendimiento de entregas.
- **RouteEfficiencyAnalyticsModule:** eficiencia de rutas.
- **SuperAdminLiveMonitor:** monitoreo global (si aplica a admin).

### Seguridad / Configuración
- **PrivacySecuritySettingsModule:** privacidad y seguridad.
- **AccessibilityInclusionSettingsModule:** accesibilidad e inclusión.
- **DataPermissionsControlModule:** permisos por rol.
- **SafetyContactsModule:** contactos de seguridad.
- **BiometricSecuritySetupModule:** biometría (mock).
- **NightModeConfigurationModule:** configuración visual (mock).
- **AccountRecoveryModule:** recuperación de cuenta.

---

## Super Admin (SuperAdmin)

Además de todo lo anterior, tiene acceso a:
- **Gestión de cooperativas:** alta/edición/estado.
- **Administradores:** gestión de admins.
- **Tarifas globales:** configuración general de precios.
- **Transferencia de usuarios entre cooperativas.**
- **Cambiar clave de cualquier rider/driver.**

---

## Notas técnicas (MVP)
- **Datos:** mock + Firebase para auth y perfiles.
- **Permisos:** modal de permisos + request de GPS/cámara/galería.
- **Tema:** dark/light con persistencia en localStorage.
- **Android:** proyecto nativo versionado en `android/` con permisos en manifest.

Si necesitas un mapa de navegación o un demo script, dímelo y lo agrego.
