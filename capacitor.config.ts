import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'ghar',
  webDir: 'www',

  plugins: {
    StatusBar: {
      backgroundColor: "#000000",
      style: "LIGHT"
    },
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFFFFFFF"
    }
  }
};

export default config;
