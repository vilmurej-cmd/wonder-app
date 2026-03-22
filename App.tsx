import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import Purchases from 'react-native-purchases';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    Purchases.configure({ apiKey: 'test_BHrjQCGhEmEppHpLyPkcuEDInwx' });
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
