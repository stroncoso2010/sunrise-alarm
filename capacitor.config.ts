import { CapacitorConfig } from '@capacitor/cli';

// Para DESARROLLO con hot-reload, descomenta el bloque "server"
// Para PRODUCCIÓN, déjalo comentado para usar los archivos locales

const config: CapacitorConfig = {
  appId: 'app.lovable.f465401ee9db4730824251bddbc79162',
  appName: 'Alarm Clock',
  webDir: 'dist',
  // SOLO para desarrollo - comentar para producción:
  // server: {
  //   url: 'https://f465401e-e9db-4730-8242-51bddbc79162.lovableproject.com?forceHideBadge=true',
  //   cleartext: true
  // },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0F172A",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#F97316",
      splashFullScreen: true,
      splashImmersive: true,
    },
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#F97316",
      sound: "beep.wav",
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
