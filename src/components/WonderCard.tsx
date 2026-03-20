import React, { useRef } from 'react';
import { StyleSheet, Text, Animated, TouchableWithoutFeedback, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT, RADIUS, TOUCH_MIN } from '../constants/theme';

interface WonderCardProps {
  children: React.ReactNode;
  color?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function WonderCard({ children, color, onPress, style }: WonderCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.94, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 10 }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      onPress={onPress ? handlePress : undefined}
    >
      <Animated.View
        style={[
          styles.card,
          color ? { borderColor: color, shadowColor: color } : {},
          { transform: [{ scale }] },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    minHeight: TOUCH_MIN,
  },
});
