import 'react-native-get-random-values';
import './src/libs/dayjs';

import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { ThemeProvider } from 'styled-components/native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from './config/gluestack-ui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme from './src/theme';

import { Routes } from './src/routes';

import { StatusBar, Alert } from 'react-native';
import { Loading } from './src/components/Loading';

import { auth } from './src/config/firebase';
import messaging from '@react-native-firebase/messaging';
import { useEffect, useState } from 'react';
import { requestUserPermissionAndGetFCMToken } from './src/libs/firebase/services/notification';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged(async (user) => {
      setIsUserAuthenticated(!!user);
      setIsLoading(false);

      if (user) {
        const fcmToken = await requestUserPermissionAndGetFCMToken();
        if (fcmToken) {
          console.log('FCM Token ready to use:', fcmToken);
        }
      }
    });

    return subscriber;
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage.notification?.title ?? 'New message', remoteMessage.notification?.body ?? '');
    });

    return unsubscribe;
  }, []);

  if (isLoading || !fontsLoaded) {
    return;
  }

  return (
    <ThemeProvider theme={theme}>
      <GluestackUIProvider config={config}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          {isLoading || !fontsLoaded ? (
            <Loading />
          ) : (
            <Routes isAuthenticated={isUserAuthenticated} />
          )}
        </SafeAreaProvider>
      </GluestackUIProvider>
    </ThemeProvider>
  );
}
