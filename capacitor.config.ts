import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ghar',
  webDir: 'www',

  plugins: {
    StatusBar: {
      backgroundColor: "#FFFFFF",
      style: "DARK"
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFFFFFFF"
    }
  }
};

export default config;
