import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourcompany.yourapp',
  appName: 'Your App',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
    allowNavigation: [
      'http://192.168.1.104:3000',
      'http://localhost:3000'
    ]
  },
  android: {
    allowMixedContent: true,
    useLegacyBridge: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    CapacitorCookies: {
      enabled: true
    }
  }
};

export default config;