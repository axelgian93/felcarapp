import React, { useMemo, useState } from 'react';
import { Layers, LifeBuoy, Briefcase, ActivitySquare, Car, User, Settings } from 'lucide-react';

import { AdminSupportDashboard } from './modules/AdminSupportDashboard';
import { OperationalReports } from './modules/OperationalReports';
import { CorporateAdminDashboard } from './modules/CorporateAdminDashboard';
import { ActiveDeliveriesMonitor } from './modules/ActiveDeliveriesMonitor';
import { CallCenterDispatchPanel } from './modules/CallCenterDispatchPanel';
import { SuperAdminLiveMonitor } from './modules/SuperAdminLiveMonitor';
import { CorporateBillingManagement } from './modules/CorporateBillingManagement';
import { CorporateUserDirectory } from './modules/CorporateUserDirectory';
import { CorporateTravelPolicies } from './modules/CorporateTravelPolicies';
import { DriverDashboardModule } from './modules/DriverDashboardModule';
import { DriverIncentivesTiers } from './modules/DriverIncentivesTiers';
import { DriverTripHistoryModule } from './modules/DriverTripHistoryModule';
import { PassengerRideRequestModule } from './modules/PassengerRideRequestModule';
import { PassengerTripTrackingModule } from './modules/PassengerTripTrackingModule';
import { PassengerTripHistoryModule } from './modules/PassengerTripHistoryModule';
import { CallCenterPerformanceAnalytics } from './modules/CallCenterPerformanceAnalytics';
import { CorporateSavingsAnalytics } from './modules/CorporateSavingsAnalytics';
import { DriverPayoutSettlementDashboard } from './modules/DriverPayoutSettlementDashboard';
import { CorporatePassManagement } from './modules/CorporatePassManagement';
import { CorporateWalletManagement } from './modules/CorporateWalletManagement';
import { CorporateTripPurposeModule } from './modules/CorporateTripPurposeModule';
import { DemandForecastModule } from './modules/DemandForecastModule';
import { DemandHeatMapModule } from './modules/DemandHeatMapModule';
import { RouteEfficiencyAnalyticsModule } from './modules/RouteEfficiencyAnalyticsModule';
import { DeliveryPerformanceReportsModule } from './modules/DeliveryPerformanceReportsModule';
import { DriverReviewsRatingsModule } from './modules/DriverReviewsRatingsModule';
import { DriverQueuePositionModule } from './modules/DriverQueuePositionModule';
import { PassengerScheduledRideModule } from './modules/PassengerScheduledRideModule';
import { PassengerSubscriptionsModule } from './modules/PassengerSubscriptionsModule';
import { PrivacySecuritySettingsModule } from './modules/PrivacySecuritySettingsModule';
import { AccessibilityInclusionSettingsModule } from './modules/AccessibilityInclusionSettingsModule';
import { NightModeConfigurationModule } from './modules/NightModeConfigurationModule';
import { CostCenterManagementModule } from './modules/CostCenterManagementModule';
import { EmployeeSpendingLimitsModule } from './modules/EmployeeSpendingLimitsModule';
import { MonthlyCorporateInvoiceModule } from './modules/MonthlyCorporateInvoiceModule';
import { CorporateZonePoliciesModule } from './modules/CorporateZonePoliciesModule';
import { CorporateTripApprovalsModule } from './modules/CorporateTripApprovalsModule';
import { PreBookedTripBoardModule } from './modules/PreBookedTripBoardModule';
import { ShiftSchedulerModule } from './modules/ShiftSchedulerModule';
import { FleetInventoryOverviewModule } from './modules/FleetInventoryOverviewModule';
import { MaintenanceAlertsPlannerModule } from './modules/MaintenanceAlertsPlannerModule';
import { TaxiRankQueuesModule } from './modules/TaxiRankQueuesModule';
import { WeeklyEarningsSummaryModule } from './modules/WeeklyEarningsSummaryModule';
import { VehicleDetailsStatusModule } from './modules/VehicleDetailsStatusModule';
import { EmergencySOSModule } from './modules/EmergencySOSModule';
import { DailyVehicleHealthCheckModule } from './modules/DailyVehicleHealthCheckModule';
import { MaintenanceExpenseAnalyticsModule } from './modules/MaintenanceExpenseAnalyticsModule';
import { MaintenanceLogRemindersModule } from './modules/MaintenanceLogRemindersModule';
import { VehicleProfitabilityAnalyticsModule } from './modules/VehicleProfitabilityAnalyticsModule';
import { GeofenceAlertDetailModule } from './modules/GeofenceAlertDetailModule';
import { ZoneGeofencingManagerModule } from './modules/ZoneGeofencingManagerModule';
import { SpeedingViolationsLogModule } from './modules/SpeedingViolationsLogModule';
import { SpeedAlertConfigurationModule } from './modules/SpeedAlertConfigurationModule';
import { BiometricSecuritySetupModule } from './modules/BiometricSecuritySetupModule';
import { DataPermissionsControlModule } from './modules/DataPermissionsControlModule';
import { SafetyContactsModule } from './modules/SafetyContactsModule';
import { AccountRecoveryModule } from './modules/AccountRecoveryModule';
import { UserRetentionAnalyticsModule } from './modules/UserRetentionAnalyticsModule';

type ModuleFamily = 'SUPPORT' | 'OPERATIONS' | 'CORPORATE' | 'DRIVER' | 'PASSENGER' | 'SETTINGS';

const families = [
  {
    id: 'SUPPORT' as const,
    label: 'Soporte',
    description: 'Tickets, SLA, chat',
    icon: LifeBuoy
  },
  {
    id: 'OPERATIONS' as const,
    label: 'Operaciones',
    description: 'Demanda, rendimiento',
    icon: ActivitySquare
  },
  {
    id: 'CORPORATE' as const,
    label: 'Corporativo',
    description: 'B2B, gastos, políticas',
    icon: Briefcase
  },
  {
    id: 'DRIVER' as const,
    label: 'Conductores',
    description: 'Paneles de desempeño',
    icon: Car
  },
  {
    id: 'PASSENGER' as const,
    label: 'Pasajeros',
    description: 'Experiencia de usuario',
    icon: User
  },
  {
    id: 'SETTINGS' as const,
    label: 'Configuración',
    description: 'Seguridad y accesibilidad',
    icon: Settings
  }
];

interface AdminFamilyModulesProps {
  onNotify: (message: string) => void;
}

export const AdminFamilyModules: React.FC<AdminFamilyModulesProps> = ({ onNotify }) => {
  const [activeFamily, setActiveFamily] = useState<ModuleFamily>('SUPPORT');
  const [activeModule, setActiveModule] = useState<string>('support-center');

  const content = useMemo(() => {
    const modules = {
      'support-center': <AdminSupportDashboard onNotify={onNotify} />,
      'operational-reports': <OperationalReports onNotify={onNotify} />,
      'active-deliveries': <ActiveDeliveriesMonitor onNotify={onNotify} />,
      'dispatch-panel': <CallCenterDispatchPanel onNotify={onNotify} />,
      'live-monitor': <SuperAdminLiveMonitor onNotify={onNotify} />,
      'call-center-analytics': <CallCenterPerformanceAnalytics onNotify={onNotify} />,
      'demand-forecast': <DemandForecastModule onNotify={onNotify} />,
      'demand-heatmap': <DemandHeatMapModule onNotify={onNotify} />,
      'route-efficiency': <RouteEfficiencyAnalyticsModule onNotify={onNotify} />,
      'delivery-performance': <DeliveryPerformanceReportsModule onNotify={onNotify} />,
      'prebooked-board': <PreBookedTripBoardModule onNotify={onNotify} />,
      'shift-scheduler': <ShiftSchedulerModule onNotify={onNotify} />,
      'fleet-inventory': <FleetInventoryOverviewModule onNotify={onNotify} />,
      'maintenance-planner': <MaintenanceAlertsPlannerModule onNotify={onNotify} />,
      'maintenance-expense': <MaintenanceExpenseAnalyticsModule onNotify={onNotify} />,
      'maintenance-log': <MaintenanceLogRemindersModule onNotify={onNotify} />,
      'vehicle-profitability': <VehicleProfitabilityAnalyticsModule onNotify={onNotify} />,
      'geofence-alerts': <GeofenceAlertDetailModule onNotify={onNotify} />,
      'geofence-manager': <ZoneGeofencingManagerModule onNotify={onNotify} />,
      'speeding-log': <SpeedingViolationsLogModule onNotify={onNotify} />,
      'speed-config': <SpeedAlertConfigurationModule onNotify={onNotify} />,
      'retention-analytics': <UserRetentionAnalyticsModule />,
      'taxi-queues': <TaxiRankQueuesModule onNotify={onNotify} />,
      'corporate-dashboard': <CorporateAdminDashboard onNotify={onNotify} />,
      'corporate-billing': <CorporateBillingManagement onNotify={onNotify} />,
      'corporate-users': <CorporateUserDirectory onNotify={onNotify} />,
      'corporate-policies': <CorporateTravelPolicies onNotify={onNotify} />,
      'corporate-savings': <CorporateSavingsAnalytics onNotify={onNotify} />,
      'corporate-passes': <CorporatePassManagement onNotify={onNotify} />,
      'corporate-wallets': <CorporateWalletManagement onNotify={onNotify} />,
      'corporate-purposes': <CorporateTripPurposeModule onNotify={onNotify} />,
      'corporate-centers': <CostCenterManagementModule onNotify={onNotify} />,
      'corporate-limits': <EmployeeSpendingLimitsModule onNotify={onNotify} />,
      'corporate-invoices': <MonthlyCorporateInvoiceModule onNotify={onNotify} />,
      'corporate-zones': <CorporateZonePoliciesModule onNotify={onNotify} />,
      'corporate-approvals': <CorporateTripApprovalsModule onNotify={onNotify} />,
      'driver-dashboard': <DriverDashboardModule onNotify={onNotify} />,
      'driver-incentives': <DriverIncentivesTiers onNotify={onNotify} />,
      'driver-history': <DriverTripHistoryModule onNotify={onNotify} />,
      'driver-payouts': <DriverPayoutSettlementDashboard onNotify={onNotify} />,
      'driver-reviews': <DriverReviewsRatingsModule onNotify={onNotify} />,
      'driver-queues': <DriverQueuePositionModule onNotify={onNotify} />,
      'driver-weekly': <WeeklyEarningsSummaryModule onNotify={onNotify} />,
      'driver-vehicle': <VehicleDetailsStatusModule onNotify={onNotify} />,
      'driver-health': <DailyVehicleHealthCheckModule onNotify={onNotify} />,
      'passenger-request': <PassengerRideRequestModule onNotify={onNotify} />,
      'passenger-tracking': <PassengerTripTrackingModule onNotify={onNotify} />,
      'passenger-history': <PassengerTripHistoryModule onNotify={onNotify} />,
      'passenger-scheduled': <PassengerScheduledRideModule onNotify={onNotify} />,
      'passenger-subscriptions': <PassengerSubscriptionsModule />,
      'passenger-sos': <EmergencySOSModule onNotify={onNotify} />,
      'settings-privacy': <PrivacySecuritySettingsModule onNotify={onNotify} />,
      'settings-accessibility': <AccessibilityInclusionSettingsModule onNotify={onNotify} />,
      'settings-night': <NightModeConfigurationModule onNotify={onNotify} />,
      'settings-biometric': <BiometricSecuritySetupModule onNotify={onNotify} />,
      'settings-permissions': <DataPermissionsControlModule onNotify={onNotify} />,
      'settings-safety': <SafetyContactsModule onNotify={onNotify} />,
      'settings-recovery': <AccountRecoveryModule onNotify={onNotify} />
    };
    return modules[activeModule as keyof typeof modules] ?? <AdminSupportDashboard onNotify={onNotify} />;
  }, [activeModule, onNotify]);

  const moduleOptions = useMemo(() => {
    switch (activeFamily) {
      case 'OPERATIONS':
        return [
          { id: 'operational-reports', label: 'Reportes' },
          { id: 'active-deliveries', label: 'Entregas' },
          { id: 'dispatch-panel', label: 'Despacho' },
          { id: 'live-monitor', label: 'Monitor en vivo' },
          { id: 'call-center-analytics', label: 'Call center' },
          { id: 'demand-forecast', label: 'Pronóstico' },
          { id: 'demand-heatmap', label: 'Mapa de calor' },
          { id: 'route-efficiency', label: 'Eficiencia rutas' },
          { id: 'delivery-performance', label: 'Entregas' },
          { id: 'prebooked-board', label: 'Pre-booked' },
          { id: 'shift-scheduler', label: 'Turnos' },
          { id: 'fleet-inventory', label: 'Flota' },
          { id: 'maintenance-planner', label: 'Mantenimiento' },
          { id: 'maintenance-expense', label: 'Gastos' },
          { id: 'maintenance-log', label: 'Recordatorios' },
          { id: 'vehicle-profitability', label: 'Rentabilidad' },
          { id: 'geofence-alerts', label: 'Geocercas' },
          { id: 'geofence-manager', label: 'Gestor geocercas' },
          { id: 'speeding-log', label: 'Excesos' },
          { id: 'speed-config', label: 'Velocidad' },
          { id: 'retention-analytics', label: 'Retención' },
          { id: 'taxi-queues', label: 'Colas taxis' }
        ];
      case 'CORPORATE':
        return [
          { id: 'corporate-dashboard', label: 'Dashboard' },
          { id: 'corporate-billing', label: 'Facturación' },
          { id: 'corporate-users', label: 'Usuarios' },
          { id: 'corporate-policies', label: 'Políticas' },
          { id: 'corporate-savings', label: 'Ahorros' },
          { id: 'corporate-passes', label: 'Pases' },
          { id: 'corporate-wallets', label: 'Wallets' },
          { id: 'corporate-purposes', label: 'Propósitos' },
          { id: 'corporate-centers', label: 'Centros costo' },
          { id: 'corporate-limits', label: 'Límites' },
          { id: 'corporate-invoices', label: 'Facturas' },
          { id: 'corporate-zones', label: 'Zonas' },
          { id: 'corporate-approvals', label: 'Aprobaciones' }
        ];
      case 'DRIVER':
        return [
          { id: 'driver-dashboard', label: 'Panel conductor' },
          { id: 'driver-incentives', label: 'Incentivos' },
          { id: 'driver-history', label: 'Historial' },
          { id: 'driver-payouts', label: 'Pagos' },
          { id: 'driver-reviews', label: 'Reseñas' },
          { id: 'driver-queues', label: 'Colas' },
          { id: 'driver-weekly', label: 'Semanal' },
          { id: 'driver-vehicle', label: 'Vehículo' },
          { id: 'driver-health', label: 'Chequeo' }
        ];
      case 'PASSENGER':
        return [
          { id: 'passenger-request', label: 'Solicitud' },
          { id: 'passenger-tracking', label: 'Seguimiento' },
          { id: 'passenger-history', label: 'Historial' },
          { id: 'passenger-scheduled', label: 'Programados' },
          { id: 'passenger-subscriptions', label: 'Suscripciones' },
          { id: 'passenger-sos', label: 'SOS' }
        ];
      case 'SETTINGS':
        return [
          { id: 'settings-privacy', label: 'Seguridad' },
          { id: 'settings-accessibility', label: 'Accesibilidad' },
          { id: 'settings-night', label: 'Modo nocturno' },
          { id: 'settings-biometric', label: 'Biometría' },
          { id: 'settings-permissions', label: 'Permisos' },
          { id: 'settings-safety', label: 'Contactos' },
          { id: 'settings-recovery', label: 'Recuperación' }
        ];
      default:
        return [{ id: 'support-center', label: 'Centro de soporte' }];
    }
  }, [activeFamily]);

  const handleFamilyChange = (familyId: ModuleFamily) => {
    setActiveFamily(familyId);
    const first = familyId === 'OPERATIONS'
      ? 'operational-reports'
      : familyId === 'CORPORATE'
        ? 'corporate-dashboard'
        : familyId === 'DRIVER'
          ? 'driver-dashboard'
          : familyId === 'PASSENGER'
            ? 'passenger-request'
            : familyId === 'SETTINGS'
              ? 'settings-privacy'
              : 'support-center';
    setActiveModule(first);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Módulos</p>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers size={20} className="text-sky-500" />
            Paneles por perfil
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Selecciona un perfil para navegar por sus paneles.
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto rounded-full border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-1">
          {families.map((family) => {
            const Icon = family.icon;
            const isActive = activeFamily === family.id;
            return (
              <button
                key={family.id}
                onClick={() => handleFamilyChange(family.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon size={14} />
                {family.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {moduleOptions.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeModule === module.id
                ? 'bg-slate-900 dark:bg-sky-500 text-white'
                : 'bg-white dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'
            }`}
          >
            {module.label}
          </button>
        ))}
      </div>

      <div className="w-full">{content}</div>
    </div>
  );
};
