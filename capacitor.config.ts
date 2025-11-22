import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.felcar.app',
  appName: 'Felcar Ride',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;