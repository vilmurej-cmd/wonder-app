import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, FONT } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const STAR_EMOJIS = ['⭐', '🌟', '✨', '💫', '🎉', '🎊', '🌈'];
const STAR_COUNT = 14;

interface CelebrationOverlayProps {
  message?: string;
  onDone?: () => void;
}

export default function CelebrationOverlay({ message = 'Amazing!', onDone }: CelebrationOverlayProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(0.3)).current;

  const stars = useRef(
    Array.from({ length: STAR_COUNT }, () => ({
      x: new Animated.Value(Math.random() * width),
      y: new Animated.Value(-40),
      opacity: new Animated.Value(1),
      rotate: new Animated.Value(0),
    }))
  ).current;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Fade in background
    Animated.timing(fadeIn, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    // Bounce in text
    Animated.spring(textScale, { toValue: 1, useNativeDriver: true, speed: 8, bounciness: 14 }).start();

    // Falling stars
    stars.forEach((star, i) => {
      const delay = i * 80;
      star.x.setValue(40 + Math.random() * (width - 80));
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(star.y, { toValue: height + 40, duration: 1800 + Math.random() * 800, useNativeDriver: true }),
          Animated.timing(star.rotate, { toValue: 4 + Math.random() * 4, duration: 2000, useNativeDriver: true }),
        ]),
      ]).start();
    });

    // Auto-dismiss
    const timer = setTimeout(() => {
      Animated.timing(fadeIn, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => onDone?.());
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeIn }]} pointerEvents="none">
      {stars.map((star, i) => {
        const spin = star.rotate.interpolate({ inputRange: [0, 8], outputRange: ['0deg', '360deg'] });
        return (
          <Animated.Text
            key={i}
            style={[
              styles.star,
              {
                left: 0,
                transform: [
                  { translateX: star.x as any },
                  { translateY: star.y },
                  { rotate: spin },
                ],
              },
            ]}
          >
            {STAR_EMOJIS[i % STAR_EMOJIS.length]}
          </Animated.Text>
        );
      })}

      <Animated.View style={[styles.textWrap, { transform: [{ scale: textScale }] }]}>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  star: {
    position: 'absolute',
    fontSize: 28,
  },
  textWrap: {
    position: 'absolute',
    top: height * 0.38,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  message: {
    fontSize: FONT.xxl,
    fontWeight: '900',
    color: COLORS.primary,
    textAlign: 'center',
  },
});
