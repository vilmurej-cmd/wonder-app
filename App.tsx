import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
let Purchases: any = null; try { Purchases = require('react-native-purchases').default; } catch(e) {}
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    try { Purchases?.configure({ apiKey: 'test_BHrjQCGhEmEppHpLyPkcuEDInwx' }); } catch(e) {}
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
