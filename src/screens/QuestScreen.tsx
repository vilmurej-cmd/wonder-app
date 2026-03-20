import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING } from '../constants/theme';
import { wonderAI } from '../utils/api';

type Phase = 'loading' | 'intro' | 'activity' | 'reward' | 'timeup';

const QUEST_MINUTES = 15;

interface QuestData {
  theme: string;
  emoji: string;
  intro: string[];
  activity: { question: string; options: string[]; correct: number };
  reward: string;
}

const FALLBACK_QUEST: QuestData = {
  theme: 'Jungle Explorer',
  emoji: '🌴',
  intro: ['Welcome, brave explorer!', "Today we're going on a jungle adventure!", "Let's find 3 hidden animals in the jungle!"],
  activity: { question: 'How many animals can you count? 🦜🐒🦎', options: ['2', '3', '4'], correct: 1 },
  reward: 'You earned the Jungle Explorer sticker! 🏅',
};

export default function QuestScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [quest, setQuest] = useState<QuestData>(FALLBACK_QUEST);
  const [introSlide, setIntroSlide] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(QUEST_MINUTES * 60);
  const [showCelebration, setShowCelebration] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Fetch AI quest
    wonderAI('quest', {})
      .then((data) => { setQuest(data); setPhase('intro'); })
      .catch(() => { setQuest(FALLBACK_QUEST); setPhase('intro'); });

    // Start 15-min timer
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setPhase('timeup');
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  const timerPercent = secondsLeft / (QUEST_MINUTES * 60);

  const nextIntro = () => {
    if (introSlide < quest.intro.length - 1) {
      setIntroSlide(introSlide + 1);
    } else {
      setPhase('activity');
    }
  };

  const handleAnswer = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (index === quest.activity.correct) {
      setShowCelebration(true);
    }
  };

  if (phase === 'loading') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={styles.loadingEmoji}>🗺️</Text>
            <ActivityIndicator size="large" color={COLORS.quest} />
            <Text style={styles.loadingText}>Preparing your adventure... ✨</Text>
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (phase === 'timeup') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={styles.timeupEmoji}>🌈</Text>
            <Text style={styles.timeupTitle}>Great job today!</Text>
            <Text style={styles.timeupText}>Time to go play! See you tomorrow!</Text>
            <BigButton title="Go Home" emoji="🏠" color={COLORS.quest} onPress={() => navigation.goBack()} style={{ marginTop: SPACING.xl }} />
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (phase === 'reward') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={styles.rewardEmoji}>🏅</Text>
            <Text style={styles.rewardTitle}>You did it!</Text>
            <Text style={styles.rewardText}>{quest.reward}</Text>
            <BigButton title="Go Home" emoji="🏠" color={COLORS.quest} onPress={() => navigation.goBack()} style={{ marginTop: SPACING.xl }} />
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        {/* Timer bar */}
        <View style={styles.timerBar}>
          <View style={[styles.timerFill, { width: `${timerPercent * 100}%` }]} />
          <Text style={styles.timerText}>⏰ {timerText}</Text>
        </View>

        <View style={styles.center}>
          <Text style={styles.questEmoji}>{quest.emoji}</Text>
          <Text style={styles.questTheme}>{quest.theme}</Text>

          {phase === 'intro' && (
            <>
              <WonderCard color={COLORS.quest} style={styles.introCard}>
                <Text style={styles.introText}>{quest.intro[introSlide]}</Text>
              </WonderCard>
              <BigButton title="Next" emoji="👉" color={COLORS.quest} onPress={nextIntro} />
            </>
          )}

          {phase === 'activity' && (
            <>
              <Text style={styles.activityQ}>{quest.activity.question}</Text>
              <View style={styles.options}>
                {quest.activity.options.map((opt, i) => (
                  <BigButton key={i} title={opt} color={[COLORS.quest, COLORS.primary, COLORS.storySpark][i]} onPress={() => handleAnswer(i)} style={styles.optBtn} />
                ))}
              </View>
            </>
          )}
        </View>

        {showCelebration && (
          <CelebrationOverlay message="You found them! 🎉" onDone={() => { setShowCelebration(false); setPhase('reward'); }} />
        )}
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  timerBar: { height: 32, backgroundColor: '#E5E7EB', marginHorizontal: SPACING.lg, borderRadius: 16, marginTop: SPACING.sm, overflow: 'hidden', justifyContent: 'center' },
  timerFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: COLORS.quest, borderRadius: 16 },
  timerText: { textAlign: 'center', fontSize: 14, fontWeight: '800', color: COLORS.text },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  loadingEmoji: { fontSize: 64, marginBottom: SPACING.md },
  loadingText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.quest, marginTop: SPACING.md },
  questEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  questTheme: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.xl },
  introCard: { marginBottom: SPACING.lg, width: '100%' },
  introText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center', lineHeight: 34 },
  activityQ: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.xl },
  options: { gap: SPACING.md, width: '100%' },
  optBtn: { width: '100%' },
  timeupEmoji: { fontSize: 80, marginBottom: SPACING.md },
  timeupTitle: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.quest },
  timeupText: { fontSize: FONT.body, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center' },
  rewardEmoji: { fontSize: 80, marginBottom: SPACING.md },
  rewardTitle: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.quest },
  rewardText: { fontSize: FONT.body, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center' },
});
