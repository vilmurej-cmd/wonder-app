import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING, RADIUS, TOUCH_MIN } from '../constants/theme';
import { ISLANDS } from '../constants/tools';

// Mock questions per island
const MOCK_QUESTIONS: Record<string, { question: string; options: string[]; correct: number; funFact: string }[]> = {
  Numbers: [
    { question: 'How many legs does a dog have?', options: ['2', '4', '6'], correct: 1, funFact: 'Dogs have 4 legs and they love to run!' },
    { question: 'What comes after 3?', options: ['2', '5', '4'], correct: 2, funFact: '3, 4, 5! You can count anything!' },
  ],
  Letters: [
    { question: 'What letter does "Apple" start with?', options: ['B', 'A', 'C'], correct: 1, funFact: 'A is the first letter of the alphabet!' },
    { question: 'What letter does "Cat" start with?', options: ['C', 'D', 'B'], correct: 0, funFact: 'C is for Cat, Cookie, and Cloud!' },
  ],
  Colors: [
    { question: 'What color is the sky?', options: ['Red', 'Green', 'Blue'], correct: 2, funFact: 'The sky looks blue because of how sunlight bounces!' },
    { question: 'What color is a banana?', options: ['Yellow', 'Purple', 'Pink'], correct: 0, funFact: 'Bananas start green and turn yellow!' },
  ],
};

type Phase = 'map' | 'lesson';

export default function IslandScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('map');
  const [currentIsland, setCurrentIsland] = useState('');
  const [qIndex, setQIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState('');

  const questions = MOCK_QUESTIONS[currentIsland] || MOCK_QUESTIONS.Numbers;
  const currentQ = questions[qIndex];

  const selectIsland = (name: string, unlocked: boolean) => {
    if (!unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setCurrentIsland(name);
    setQIndex(0);
    setFeedback('');
    setPhase('lesson');
  };

  const selectAnswer = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (index === currentQ.correct) {
      setShowCelebration(true);
      setFeedback('');
    } else {
      setFeedback(`Great try! It's ${currentQ.options[currentQ.correct]}! 🌟`);
    }
  };

  const nextQuestion = () => {
    setShowCelebration(false);
    setFeedback('');
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      setPhase('map');
    }
  };

  if (phase === 'lesson') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.lessonContainer}>
            <Text style={styles.islandTitle}>{currentIsland}</Text>
            <Text style={styles.progress}>{qIndex + 1} / {questions.length} ⭐</Text>
            <Text style={styles.question}>{currentQ.question}</Text>

            <View style={styles.options}>
              {currentQ.options.map((opt, i) => (
                <BigButton
                  key={i}
                  title={opt}
                  color={[COLORS.primary, COLORS.quest, COLORS.storySpark, COLORS.animals][i % 4]}
                  onPress={() => selectAnswer(i)}
                  style={styles.optionBtn}
                />
              ))}
            </View>

            {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

            <TouchableOpacity onPress={() => setPhase('map')} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Islands</Text>
            </TouchableOpacity>
          </View>

          {showCelebration && (
            <CelebrationOverlay message="Amazing! ⭐" onDone={nextQuestion} />
          )}
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>WONDER Island 🏝️</Text>
          <Text style={styles.subtitle}>Pick an island to explore!</Text>

          <View style={styles.islandGrid}>
            {ISLANDS.map((island, i) => (
              <WonderCard
                key={island.name}
                color={island.unlocked ? island.color : '#D1D5DB'}
                onPress={() => selectIsland(island.name, island.unlocked)}
                style={[styles.islandCard, !island.unlocked ? styles.locked : undefined]}
              >
                <Text style={styles.islandEmoji}>{island.emoji}</Text>
                <Text style={[styles.islandName, !island.unlocked && styles.lockedText]}>
                  {island.name}
                </Text>
                {!island.unlocked && <Text style={styles.lockIcon}>🔒</Text>}
              </WonderCard>
            ))}
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  islandGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md },
  islandCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.lg },
  islandEmoji: { fontSize: 40, marginBottom: SPACING.xs },
  islandName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text },
  locked: { opacity: 0.5 },
  lockedText: { color: COLORS.textLight },
  lockIcon: { fontSize: 16, marginTop: SPACING.xs },

  // Lesson
  lessonContainer: { flex: 1, padding: SPACING.lg, justifyContent: 'center' },
  islandTitle: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.primary, textAlign: 'center' },
  progress: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  question: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 42 },
  options: { gap: SPACING.md },
  optionBtn: { width: '100%' },
  feedback: { fontSize: FONT.body, fontWeight: '700', color: COLORS.animals, textAlign: 'center', marginTop: SPACING.lg },
  backBtn: { marginTop: SPACING.xl, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
