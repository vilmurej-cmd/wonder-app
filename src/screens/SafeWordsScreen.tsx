import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

interface Scenario {
  text: string;
  knowsCode: boolean;
  emoji: string;
  feedback: string;
}

const SCENARIOS: Scenario[] = [
  {
    text: 'Your aunt comes to pick you up from school. She says the code word!',
    knowsCode: true,
    emoji: '👩',
    feedback: "It's safe to go — she knows the code word! Great job!",
  },
  {
    text: "A man in a car says 'Your dad had an accident, get in!' He does NOT know the code word.",
    knowsCode: false,
    emoji: '🚗',
    feedback: "Do NOT go. Go back inside and tell a teacher. Even if the story sounds scary, ALWAYS ask for the code word first.",
  },
  {
    text: "Your neighbor says 'Your mom asked me to walk you home.' She says the code word.",
    knowsCode: true,
    emoji: '🏠',
    feedback: "She knows the code word — it's okay! Smart thinking!",
  },
  {
    text: "A woman at the park says 'I have a puppy in my car, want to see?' She doesn't know your family.",
    knowsCode: false,
    emoji: '🐕',
    feedback: "NEVER go with a stranger, even if they offer something fun. Stay where you are and tell a trusted grown-up.",
  },
  {
    text: "Your grandpa is at school pickup. He says the code word with a big smile!",
    knowsCode: true,
    emoji: '👴',
    feedback: "Grandpa knows the code word! It's safe to go with him! 💛",
  },
  {
    text: "Someone you don't know says 'Your mom sent me.' They can't say the code word.",
    knowsCode: false,
    emoji: '❓',
    feedback: "No code word = don't go. Find a trusted grown-up right away. You're being SO smart!",
  },
];

export default function SafeWordsScreen({ navigation }: any) {
  const [phase, setPhase] = useState<'story' | 'practice' | 'quiz'>('story');
  const [codeWord, setCodeWord] = useState('');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('wonderCodeWord').then((v) => { if (v) setCodeWord(v); });
  }, []);

  const handleAnswer = (saysYes: boolean) => {
    const correct = saysYes === SCENARIOS[scenarioIndex].knowsCode;
    setAnswered(true);
    if (correct) {
      setScore(score + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const nextScenario = () => {
    setAnswered(false);
    if (scenarioIndex < SCENARIOS.length - 1) {
      setScenarioIndex(scenarioIndex + 1);
    } else {
      setShowCelebration(true);
      setPhase('story');
      setScenarioIndex(0);
      setScore(0);
    }
  };

  const checkQuiz = () => {
    if (quizAnswer.trim().toLowerCase() === codeWord.toLowerCase()) {
      setShowCelebration(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setQuizAnswer('');
    } else {
      Alert.alert('Not quite!', 'Ask your grown-up to help you remember the code word! 💛');
      setQuizAnswer('');
    }
  };

  const current = SCENARIOS[scenarioIndex];

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Safe Words 🔑</Text>
          <Text style={styles.subtitle}>Your family's secret code word</Text>

          {phase === 'story' && (
            <>
              <WonderCard color={COLORS.safeWords} style={styles.storyCard}>
                <Text style={styles.storyBravie}>🦁</Text>
                <Text style={styles.storyText}>
                  Bravie's family has a SECRET CODE WORD. It's a special word that only Bravie's family knows.
                </Text>
                <Text style={styles.storyText}>
                  If anyone ever says "your mom sent me to pick you up," Bravie asks: "What's the code word?"
                </Text>
                <Text style={styles.storyHighlight}>
                  If they don't know it — Bravie does NOT go with them. Even if the person seems nice.
                </Text>
              </WonderCard>

              <BigButton
                title="Practice Scenarios!"
                emoji="🎮"
                color={COLORS.safeWords}
                onPress={() => {
                  setPhase('practice');
                  setScenarioIndex(0);
                  setScore(0);
                  setAnswered(false);
                }}
              />

              {codeWord ? (
                <BigButton
                  title="Code Word Quiz"
                  emoji="🔑"
                  color={COLORS.primary}
                  onPress={() => setPhase('quiz')}
                />
              ) : (
                <WonderCard color={COLORS.safeCircle} style={{ marginTop: SPACING.md, alignItems: 'center' }}>
                  <Text style={styles.noCodeText}>
                    Ask a grown-up to set your family code word in Settings! ⚙️
                  </Text>
                </WonderCard>
              )}
            </>
          )}

          {phase === 'practice' && (
            <>
              <Text style={styles.progressText}>
                Scenario {scenarioIndex + 1} of {SCENARIOS.length}
              </Text>

              <WonderCard color={COLORS.safeWords} style={styles.scenarioCard}>
                <Text style={styles.scenarioEmoji}>{current.emoji}</Text>
                <Text style={styles.scenarioText}>{current.text}</Text>
              </WonderCard>

              {!answered ? (
                <View style={styles.answerRow}>
                  <BigButton
                    title="Go with them ✅"
                    color={COLORS.quest}
                    onPress={() => handleAnswer(true)}
                  />
                  <BigButton
                    title="Don't go ❌"
                    color={COLORS.animals}
                    onPress={() => handleAnswer(false)}
                  />
                </View>
              ) : (
                <WonderCard
                  color={
                    (answered && ((current.knowsCode && true) || (!current.knowsCode && false)))
                      ? COLORS.success : COLORS.animals
                  }
                  style={styles.feedbackCard}
                >
                  <Text style={styles.feedbackText}>{current.feedback}</Text>
                  <BigButton
                    title={scenarioIndex < SCENARIOS.length - 1 ? 'Next!' : 'All Done!'}
                    emoji={scenarioIndex < SCENARIOS.length - 1 ? '➡️' : '🎉'}
                    color={COLORS.safeWords}
                    onPress={nextScenario}
                  />
                </WonderCard>
              )}
            </>
          )}

          {phase === 'quiz' && (
            <>
              <WonderCard color={COLORS.primary} style={styles.quizCard}>
                <Text style={styles.quizEmoji}>🔑</Text>
                <Text style={styles.quizText}>
                  Do you remember your family's code word?
                </Text>
                <TextInput
                  style={styles.quizInput}
                  value={quizAnswer}
                  onChangeText={setQuizAnswer}
                  placeholder="Type the code word..."
                  placeholderTextColor={COLORS.textLight}
                  autoCapitalize="none"
                />
                <BigButton
                  title="Check!"
                  emoji="✨"
                  color={COLORS.primary}
                  onPress={checkQuiz}
                />
              </WonderCard>

              <TouchableOpacity onPress={() => setPhase('story')} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Back to Story</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {showCelebration && (
          <CelebrationOverlay
            message="You're a safety superstar! ⭐"
            onDone={() => setShowCelebration(false)}
          />
        )}
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  backBtn: { marginBottom: SPACING.md },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  storyCard: { alignItems: 'center', paddingVertical: SPACING.xl, marginBottom: SPACING.lg },
  storyBravie: { fontSize: 56, marginBottom: SPACING.md },
  storyText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 26, marginBottom: SPACING.md },
  storyHighlight: { fontSize: FONT.body, fontWeight: '800', color: COLORS.safeTell, textAlign: 'center', lineHeight: 26 },
  noCodeText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },
  progressText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '600', marginBottom: SPACING.md },
  scenarioCard: { alignItems: 'center', paddingVertical: SPACING.xl, marginBottom: SPACING.lg },
  scenarioEmoji: { fontSize: 56, marginBottom: SPACING.md },
  scenarioText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center', lineHeight: 32 },
  answerRow: { gap: SPACING.sm },
  feedbackCard: { paddingVertical: SPACING.lg, marginTop: SPACING.md },
  feedbackText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 24, marginBottom: SPACING.lg },
  quizCard: { alignItems: 'center', paddingVertical: SPACING.xl },
  quizEmoji: { fontSize: 56, marginBottom: SPACING.md },
  quizText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.lg },
  quizInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    fontSize: FONT.lg,
    fontWeight: '700',
    textAlign: 'center',
    width: '80%',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  backLink: { alignItems: 'center', marginTop: SPACING.lg },
  backLinkText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
