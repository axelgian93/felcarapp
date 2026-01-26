# 🚖 FelcarRide - Ecosistema de Transporte Inteligente

FelcarRide es una plataforma de movilidad de última generación diseñada para el mercado ecuatoriano (enfocada inicialmente en Guayaquil). A diferencia de las apps de taxi tradicionales, FelcarRide integra Inteligencia Artificial para la estimación dinámica de tarifas y una arquitectura multi-inquilino (multi-tenant) que permite a diferentes cooperativas gestionar su propia flota y reglas de negocio.

## 🚀 Características Principales

### 🤖 Inteligencia Artificial (Google Gemini)
- **Estimación Dinámica:** Cálculo de tarifas en tiempo real basado en tráfico, demanda y tipo de servicio (Económico, Confort, XL).
- **Rutas Inteligentes:** Optimización de puntos de recogida y destinos mediante procesamiento de lenguaje natural.

### 🏢 Arquitectura Multi-Tenant (Cooperativas)
- **Gestión Independiente:** Cada cooperativa tiene su propio código de invitación, reglas de precios y panel administrativo.
- **Comisiones Flexibles:** Configuración de porcentajes de ganancia personalizados por grupo.

### 💼 Módulo B2B (Corporativo)
- **Crédito Empresarial:** Permite a empresas (ej. El Rosado, Banco del Pacífico) ofrecer transporte a sus empleados con facturación mensual.
- **Límites de Consumo:** Control de presupuesto por empresa y seguimiento de rutas corporativas.

### 📱 Experiencia de Usuario (Rider & Driver)
- **Real-time Tracking:** Mapas interactivos con Leaflet.js.
- **Seguridad:** Códigos OTP para inicio de viajes y botón de pánico SOS.
- **Multiplataforma:** Web App optimizada y lista para Android/iOS mediante Capacitor.

## 🛠 Stack Tecnológico

- **Frontend:** React 19 + TypeScript + Tailwind CSS.
- **Build Tool:** Vite.
- **Base de Datos & Auth:** Firebase (Firestore & Authentication).
- **IA:** Google Gemini API (@google/genai).
- **Mapas:** Leaflet.js + OpenStreetMap (OSRM para rutas).
- **Mobile:** Ionic Capacitor.

---
Desarrollado con ❤️ para el futuro de la movilidad en Ecuador.
