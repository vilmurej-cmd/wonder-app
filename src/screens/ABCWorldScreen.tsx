import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING, RADIUS, TOUCH_MIN } from '../constants/theme';
import { ALPHABET, LETTER_EXAMPLES } from '../constants/tools';

const { width } = Dimensions.get('window');

type Phase = 'grid' | 'letter';

export default function ABCWorldScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('grid');
  const [currentLetter, setCurrentLetter] = useState('A');
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const example = LETTER_EXAMPLES[currentLetter];

  const selectLetter = (letter: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCurrentLetter(letter);
    setPhase('letter');

    // Speak the letter sound
    setTimeout(() => {
      Speech.speak(example?.sound || `${letter}`, { rate: 0.8, pitch: 1.15 });
    }, 300);
  };

  const handleDone = () => {
    const newVisited = new Set(visited);
    newVisited.add(currentLetter);
    setVisited(newVisited);
    setShowCelebration(true);
  };

  const handleCelebrationDone = () => {
    setShowCelebration(false);
    setPhase('grid');
  };

  const hearAgain = () => {
    Speech.speak(example?.sound || currentLetter, { rate: 0.8, pitch: 1.15 });
  };

  if (phase === 'letter') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.letterContainer}>
            <View style={styles.letterCircle}>
              <Text style={styles.bigLetter}>{currentLetter}</Text>
            </View>

            <Text style={styles.exampleEmoji}>{example?.emoji}</Text>
            <Text style={styles.exampleWord}>{currentLetter} is for {example?.word}!</Text>

            <BigButton title="Hear Again" emoji="🔊" color={COLORS.abc} onPress={hearAgain} />
            <BigButton title="I learned it!" emoji="⭐" color={COLORS.primary} onPress={handleDone} style={{ marginTop: SPACING.sm }} />

            <TouchableOpacity onPress={() => setPhase('grid')} style={styles.backBtn}>
              <Text style={styles.backText}>← All Letters</Text>
            </TouchableOpacity>
          </View>

          {showCelebration && (
            <CelebrationOverlay message={`${currentLetter} ⭐ Super!`} onDone={handleCelebrationDone} />
          )}
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>ABC World 🔤</Text>
          <Text style={styles.subtitle}>Tap a letter to learn!</Text>

          <Text style={styles.progressText}>{visited.size} / 26 letters explored ⭐</Text>

          <View style={styles.letterGrid}>
            {ALPHABET.map((letter) => {
              const isVisited = visited.has(letter);
              return (
                <TouchableOpacity
                  key={letter}
                  style={[styles.letterTile, isVisited && styles.visitedTile]}
                  activeOpacity={0.7}
                  onPress={() => selectLetter(letter)}
                >
                  <Text style={[styles.tileLetter, isVisited && styles.visitedText]}>{letter}</Text>
                  {isVisited && <Text style={styles.starBadge}>⭐</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </WonderBackground>
  );
}

const TILE_SIZE = (width - SPACING.lg * 2 - SPACING.sm * 5) / 6;

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.md },
  progressText: { fontSize: 14, fontWeight: '700', color: COLORS.abc, textAlign: 'center', marginBottom: SPACING.lg },

  letterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, justifyContent: 'center' },
  letterTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: RADIUS.md,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.abc,
    shadowColor: COLORS.abc,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  visitedTile: { backgroundColor: '#ECFDF5', borderColor: COLORS.success },
  tileLetter: { fontSize: 22, fontWeight: '900', color: COLORS.abc },
  visitedText: { color: COLORS.success },
  starBadge: { fontSize: 10, position: 'absolute', top: 2, right: 4 },

  // Letter detail
  letterContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  letterCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.abc,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    shadowColor: COLORS.abc,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  bigLetter: { fontSize: 80, fontWeight: '900', color: '#fff' },
  exampleEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  exampleWord: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.xl, textAlign: 'center' },

  backBtn: { marginTop: SPACING.xl, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
