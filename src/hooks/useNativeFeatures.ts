import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { App } from '@capacitor/app';
import { LocalNotifications } from '@capacitor/local-notifications';

export const useNativeFeatures = () => {
  const isNative = Capacitor.isNativePlatform();

  useEffect(() => {
    if (!isNative) return;

    const initNativeFeatures = async () => {
      // Configurar StatusBar
      await StatusBar.setStyle({ style: Style.Dark });
      await StatusBar.setBackgroundColor({ color: '#0F172A' });

      // Ocultar SplashScreen
      await SplashScreen.hide();

      // Solicitar permisos de notificaciones
      await LocalNotifications.requestPermissions();

      // Manejar estado de la app
      App.addListener('appStateChange', ({ isActive }) => {
        console.log('App state changed. Is active?', isActive);
      });

      // Manejar botón de retroceso en Android
      App.addListener('backButton', ({ canGoBack }) => {
        if (!canGoBack) {
          App.exitApp();
        } else {
          window.history.back();
        }
      });
    };

    initNativeFeatures();

    return () => {
      if (isNative) {
        App.removeAllListeners();
      }
    };
  }, [isNative]);

  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Medium) => {
    if (isNative) {
      await Haptics.impact({ style });
    }
  };

  const scheduleNotification = async (alarm: { time: string; label?: string; id: string }) => {
    if (!isNative) return;

    const [hours, minutes] = alarm.time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
    
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "⏰ Alarma",
          body: alarm.label || `Alarma a las ${alarm.time}`,
          id: parseInt(alarm.id.replace(/\D/g, '').slice(0, 9)) || Math.floor(Math.random() * 1000000),
          schedule: { at: scheduledTime },
          sound: 'beep.wav',
          attachments: undefined,
          actionTypeId: "",
          extra: { alarmId: alarm.id }
        }
      ]
    });
  };

  const cancelNotification = async (alarmId: string) => {
    if (!isNative) return;
    
    const notificationId = parseInt(alarmId.replace(/\D/g, '').slice(0, 9)) || 0;
    await LocalNotifications.cancel({ notifications: [{ id: notificationId }] });
  };

  return {
    isNative,
    triggerHaptic,
    scheduleNotification,
    cancelNotification,
  };
};
