# ⚙️ Guía de Instalación Local - FelcarRide

Sigue estos pasos para configurar el entorno de desarrollo en tu PC utilizando **VS Code** o **Cursor**.

## 📋 Requisitos Previos

1.  **Node.js:** Versión 18.0 o superior.
2.  **Firebase Account:** Un proyecto creado en [console.firebase.google.com](https://console.firebase.google.com/).
3.  **Google AI Studio Key:** Una API Key de [aistudio.google.com](https://aistudio.google.com/).

## 🛠 Paso 1: Clonar e Instalar

Abre tu terminal y ejecuta:

```bash
# Instalar las dependencias del proyecto
npm install
```

## 🔑 Paso 2: Configuración de Variables de Entorno

Crea un archivo llamado `.env` en la raíz del proyecto y agrega tu llave de Gemini:

```env
VITE_API_KEY=tu_api_key_de_google_ai_studio
```

*Nota: Esta llave es necesaria para que las estimaciones de precio y la búsqueda inteligente funcionen.*

## 🔥 Paso 3: Configuración de Firebase

El archivo `src/firebaseConfig.ts` ya contiene las credenciales del proyecto de prueba. Si deseas usar tu propio Firebase:

1.  Ve a la configuración de tu proyecto en Firebase Console.
2.  Copia el objeto `firebaseConfig` de tu Web App.
3.  Sustituye los valores en `src/firebaseConfig.ts`.
4.  **Importante:** Habilita en la consola de Firebase:
    - **Authentication:** Proveedor de Correo/Contraseña.
    - **Firestore Database:** En modo prueba (o configura reglas de lectura/escritura).

## 🚀 Paso 4: Ejecución en Desarrollo

Para lanzar la aplicación en tu navegador:

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## 📱 Paso 5: Generar APK (Android)

Para probar la app en un dispositivo real:

```bash
# 1. Compilar el proyecto web
npm run build

# 2. Sincronizar con Capacitor
npx cap sync

# 3. Abrir en Android Studio
npx cap open android
```

## 📂 Estructura del Proyecto

- `/src/services`: Lógica de conexión con Firebase y Google AI.
- `/src/context`: Gestión de estados globales (Temas, Auth).
- `/components`: Componentes modulares de la interfaz (Mapas, Paneles, Modales).
- `/android`: Proyecto nativo generado por Capacitor.

---
**¿Tienes problemas?** Revisa que los puertos 5173 no estén ocupados y que tu conexión a internet permita peticiones a la API de Google Gemini.
