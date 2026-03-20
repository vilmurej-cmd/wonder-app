import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING } from '../constants/theme';
import { ISLANDS } from '../constants/tools';
import { wonderAI } from '../utils/api';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string;
}

type Phase = 'map' | 'loading' | 'lesson';

const QUESTIONS_PER_ISLAND = 3;

export default function IslandScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('map');
  const [currentIsland, setCurrentIsland] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [childAge, setChildAge] = useState(4);

  useEffect(() => {
    AsyncStorage.getItem('childAge').then((v) => { if (v) setChildAge(parseInt(v, 10)); });
  }, []);

  const fetchQuestions = async (topic: string) => {
    const fetched: Question[] = [];
    for (let i = 0; i < QUESTIONS_PER_ISLAND; i++) {
      try {
        const data = await wonderAI('island', { age: childAge, topic, optionCount: 3 });
        fetched.push(data);
      } catch {
        // Use a simple fallback if AI fails
        fetched.push({
          question: `Can you think of something about ${topic}?`,
          options: ['Yes!', 'Let me try!', 'Tell me more!'],
          correctIndex: 0,
          funFact: `${topic} is so much fun to learn about!`,
        });
      }
    }
    return fetched;
  };

  const selectIsland = async (name: string, unlocked: boolean) => {
    if (!unlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    setCurrentIsland(name);
    setQIndex(0);
    setFeedback('');
    setPhase('loading');
    const qs = await fetchQuestions(name);
    setQuestions(qs);
    setPhase('lesson');
  };

  const currentQ = questions[qIndex];

  const selectAnswer = (index: number) => {
    if (!currentQ) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (index === currentQ.correctIndex) {
      setShowCelebration(true);
      setFeedback('');
    } else {
      setFeedback(`Great try! It's ${currentQ.options[currentQ.correctIndex]}! 🌟`);
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

  if (phase === 'loading') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Preparing your lessons... ✨</Text>
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (phase === 'lesson' && currentQ) {
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
            {ISLANDS.map((island) => (
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  loadingText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.lg },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  islandGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md },
  islandCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.lg },
  islandEmoji: { fontSize: 40, marginBottom: SPACING.xs },
  islandName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text },
  locked: { opacity: 0.5 },
  lockedText: { color: COLORS.textLight },
  lockIcon: { fontSize: 16, marginTop: SPACING.xs },

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
