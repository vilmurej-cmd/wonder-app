import React, { useRef } from 'react';
import { StyleSheet, Text, Animated, TouchableWithoutFeedback, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, FONT, RADIUS, TOUCH_MIN } from '../constants/theme';

interface BigButtonProps {
  title: string;
  color: string;
  onPress: () => void;
  emoji?: string;
  style?: ViewStyle;
  outline?: boolean;
}

export default function BigButton({ title, color, onPress, emoji, style, outline }: BigButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 14, bounciness: 12 }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress}>
      <Animated.View
        style={[
          styles.button,
          outline
            ? { borderColor: color, borderWidth: 2.5, backgroundColor: 'rgba(255,255,255,0.9)' }
            : { backgroundColor: color },
          { transform: [{ scale }] },
          style,
        ]}
      >
        <Text style={[styles.text, outline ? { color } : {}]}>
          {emoji ? `${emoji} ` : ''}{title}
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md + 2,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_MIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    color: '#FFFFFF',
    fontSize: FONT.lg,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
