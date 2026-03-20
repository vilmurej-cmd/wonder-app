import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

interface WonderBackgroundProps {
  children: React.ReactNode;
}

export default function WonderBackground({ children }: WonderBackgroundProps) {
  return (
    <LinearGradient
      colors={[COLORS.bgTop, COLORS.bgMid, COLORS.bgBottom]}
      style={styles.gradient}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
