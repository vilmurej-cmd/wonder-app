import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

const API_BASE = 'https://unhinged-go-api.vercel.app';

const LESSONS = [
  { key: 'secrets', title: 'Surprises vs. Unsafe Secrets', emoji: '🎁', color: COLORS.safeTell },
  { key: 'body', title: 'My Body Belongs to Me', emoji: '💪', color: COLORS.heart },
  { key: 'telling', title: 'Telling Is Not Tattling', emoji: '🗣️', color: COLORS.quest },
  { key: 'online', title: 'Online Safety', emoji: '💻', color: COLORS.abc, minAge: 7 },
  { key: 'scary', title: 'Scary Things on Screens', emoji: '📱', color: COLORS.storySpark },
  { key: 'home', title: 'When Home Feels Scary', emoji: '🏠', color: COLORS.safeCircle },
];

interface ScenarioData {
  storyIntro: string;
  scenario: string;
  choices: { text: string; isBest: boolean; feedback: string }[];
  teachingMoment: string;
  keyPhrase: string;
}

export default function TellSomeoneScreen({ navigation }: any) {
  const [phase, setPhase] = useState<'menu' | 'lesson' | 'scenario' | 'result'>('menu');
  const [activeLesson, setActiveLesson] = useState('');
  const [scenario, setScenario] = useState<ScenarioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(-1);
  const [showCelebration, setShowCelebration] = useState(false);
  const [childAge, setChildAge] = useState(6);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('childAge').then((v) => { if (v) setChildAge(parseInt(v, 10)); });
    AsyncStorage.getItem('wonderSafetyCompleted').then((v) => { if (v) setCompleted(JSON.parse(v)); });
  }, []);

  const startLesson = async (lessonKey: string) => {
    setActiveLesson(lessonKey);
    setPhase('lesson');
    setLoading(true);
    setSelectedChoice(-1);

    const ageGroup = childAge <= 6 ? '4-6' : childAge <= 9 ? '7-9' : '10-12';

    try {
      const res = await fetch(`${API_BASE}/api/wonder/safety-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: lessonKey, ageGroup }),
      });
      const data = await res.json();
      setScenario(data);
      setPhase('scenario');
    } catch {
      // Fallback scenario
      setScenario({
        storyIntro: 'Bravie the lion cub was playing with friends when something happened...',
        scenario: 'Someone asked Bravie to keep a secret that made Bravie\'s tummy feel weird.',
        choices: [
          { text: 'Keep the secret because they said to', isBest: false, feedback: 'It\'s tricky, but secrets that make your tummy feel weird are the ones you SHOULD tell about!' },
          { text: 'Tell a trusted grown-up', isBest: true, feedback: 'YES! That\'s exactly right! If a secret makes you feel weird, ALWAYS tell a grown-up you trust!' },
          { text: 'Try to forget about it', isBest: false, feedback: 'It\'s hard to forget things that bother us. A trusted grown-up can help you feel better!' },
        ],
        teachingMoment: 'If a secret makes you feel scared, sad, confused, or sick in your tummy — ALWAYS tell a grown-up you trust. You will NEVER get in trouble for telling.',
        keyPhrase: 'Unsafe secrets are meant to be told!',
      });
      setPhase('scenario');
    } finally {
      setLoading(false);
    }
  };

  const handleChoice = async (index: number) => {
    setSelectedChoice(index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (scenario?.choices[index].isBest) {
      setShowCelebration(true);
      if (!completed.includes(activeLesson)) {
        const updated = [...completed, activeLesson];
        setCompleted(updated);
        await AsyncStorage.setItem('wonderSafetyCompleted', JSON.stringify(updated));
      }
    }
  };

  const filteredLessons = LESSONS.filter((l) => !l.minAge || childAge >= l.minAge);

  if (phase === 'menu') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backText}>← Back Home</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Tell Someone 🗣️</Text>
            <Text style={styles.subtitle}>
              Learn when and how to tell a grown-up you trust. Bravie the lion cub will show you!
            </Text>

            <View style={styles.bravieCard}>
              <Text style={styles.bravieEmoji}>🦁</Text>
              <Text style={styles.bravieText}>
                "Hi! I'm Bravie! Let's learn about staying safe together!"
              </Text>
            </View>

            <View style={styles.grid}>
              {filteredLessons.map((lesson) => (
                <WonderCard
                  key={lesson.key}
                  color={lesson.color}
                  onPress={() => startLesson(lesson.key)}
                  style={styles.lessonCard}
                >
                  <Text style={styles.lessonEmoji}>{lesson.emoji}</Text>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  {completed.includes(lesson.key) && (
                    <Text style={styles.completedBadge}>⭐ Done!</Text>
                  )}
                </WonderCard>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (loading) {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Bravie is preparing a story... 🦁</Text>
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.storySection}>
            <Text style={styles.storyBravie}>🦁</Text>
            <WonderCard color={COLORS.safeTell} style={styles.storyCard}>
              <Text style={styles.storyText}>{scenario?.storyIntro}</Text>
            </WonderCard>

            <WonderCard color={COLORS.primary} style={styles.scenarioCard}>
              <Text style={styles.scenarioText}>{scenario?.scenario}</Text>
            </WonderCard>

            <Text style={styles.questionText}>What should Bravie do?</Text>

            {scenario?.choices.map((choice, i) => {
              const isSelected = selectedChoice === i;
              const showFeedback = selectedChoice >= 0;

              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.choiceBtn,
                    isSelected && choice.isBest && styles.choiceBtnCorrect,
                    isSelected && !choice.isBest && styles.choiceBtnWrong,
                    showFeedback && !isSelected && { opacity: 0.5 },
                  ]}
                  onPress={() => handleChoice(i)}
                  disabled={selectedChoice >= 0}
                >
                  <Text style={styles.choiceText}>{choice.text}</Text>
                  {isSelected && (
                    <Text style={styles.feedbackText}>{choice.feedback}</Text>
                  )}
                </TouchableOpacity>
              );
            })}

            {selectedChoice >= 0 && (
              <View style={styles.teachingCard}>
                <Text style={styles.teachingLabel}>🦁 Bravie says:</Text>
                <Text style={styles.teachingText}>{scenario?.teachingMoment}</Text>
                <View style={styles.keyPhraseCard}>
                  <Text style={styles.keyPhraseLabel}>Remember this:</Text>
                  <Text style={styles.keyPhrase}>"{scenario?.keyPhrase}"</Text>
                </View>

                <View style={styles.lessonActions}>
                  <BigButton
                    title="Try Another"
                    emoji="🔄"
                    color={COLORS.safeTell}
                    onPress={() => startLesson(activeLesson)}
                  />
                  <TouchableOpacity onPress={() => setPhase('menu')} style={styles.menuLink}>
                    <Text style={styles.menuLinkText}>← Back to Lessons</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {showCelebration && (
          <CelebrationOverlay
            message="You're learning to be safe! ⭐"
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
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.xs, marginBottom: SPACING.lg },
  bravieCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.safeTell,
  },
  bravieEmoji: { fontSize: 48 },
  bravieText: { flex: 1, fontSize: 16, fontWeight: '600', color: COLORS.text, lineHeight: 22 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md },
  lessonCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.lg },
  lessonEmoji: { fontSize: 40, marginBottom: SPACING.sm },
  lessonTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  completedBadge: { fontSize: 12, color: COLORS.star, fontWeight: '700', marginTop: SPACING.xs },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: SPACING.md },
  loadingText: { fontSize: FONT.body, color: COLORS.textSecondary },
  storySection: { alignItems: 'center' },
  storyBravie: { fontSize: 64, marginBottom: SPACING.md },
  storyCard: { marginBottom: SPACING.md, paddingVertical: SPACING.lg },
  storyText: { fontSize: FONT.lg, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 32 },
  scenarioCard: { marginBottom: SPACING.lg, paddingVertical: SPACING.lg },
  scenarioText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 26 },
  questionText: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.md },
  choiceBtn: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: COLORS.border,
    width: '100%',
  },
  choiceBtnCorrect: { borderColor: COLORS.success, backgroundColor: '#F0FFF4' },
  choiceBtnWrong: { borderColor: COLORS.animals, backgroundColor: '#FFFBEB' },
  choiceText: { fontSize: FONT.body, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  feedbackText: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm, lineHeight: 20 },
  teachingCard: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.safeTell,
    width: '100%',
  },
  teachingLabel: { fontSize: FONT.body, fontWeight: '800', color: COLORS.safeTell, marginBottom: SPACING.sm },
  teachingText: { fontSize: 16, color: COLORS.text, lineHeight: 24, marginBottom: SPACING.md },
  keyPhraseCard: {
    backgroundColor: COLORS.bgTop,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  keyPhraseLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },
  keyPhrase: { fontSize: FONT.lg, fontWeight: '900', color: COLORS.safeTell, textAlign: 'center', marginTop: SPACING.xs },
  lessonActions: { gap: SPACING.md },
  menuLink: { alignItems: 'center', paddingVertical: SPACING.sm },
  menuLinkText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
