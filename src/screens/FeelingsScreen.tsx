import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING } from '../constants/theme';
import { FEELINGS } from '../constants/tools';

type Phase = 'select' | 'feeling' | 'activity';

export default function FeelingsScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('select');
  const [selected, setSelected] = useState(FEELINGS[0]);
  const [showCelebration, setShowCelebration] = useState(false);

  const selectFeeling = (feeling: typeof FEELINGS[0]) => {
    setSelected(feeling);
    setPhase('feeling');
  };

  const handleFeelBetter = () => {
    setShowCelebration(true);
  };

  if (phase === 'activity') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={styles.animalEmoji}>{selected.emoji}</Text>
            <Text style={styles.animalSays}>{selected.animal} says:</Text>
            <WonderCard color={selected.color} style={styles.activityCard}>
              <Text style={styles.activityText}>{selected.activity}</Text>
            </WonderCard>
            <BigButton title="I feel better!" emoji="🌟" color={selected.color} onPress={handleFeelBetter} />
            <TouchableOpacity onPress={() => setPhase('select')} style={styles.backBtn}>
              <Text style={styles.backText}>← Pick another feeling</Text>
            </TouchableOpacity>
          </View>
          {showCelebration && (
            <CelebrationOverlay message="You're amazing! 💛" onDone={() => { setShowCelebration(false); setPhase('select'); }} />
          )}
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (phase === 'feeling') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.center}>
            <Text style={styles.bigEmoji}>{selected.emoji}</Text>
            <Text style={styles.feelingTitle}>Feeling {selected.name}</Text>
            <WonderCard color={selected.color} style={styles.messageCard}>
              <Text style={styles.messageText}>{selected.message}</Text>
            </WonderCard>
            <BigButton title="What can I do?" emoji="💡" color={selected.color} onPress={() => setPhase('activity')} />
            <TouchableOpacity onPress={() => setPhase('select')} style={styles.backBtn}>
              <Text style={styles.backText}>← Pick another feeling</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Feelings Friends 💛</Text>
          <Text style={styles.subtitle}>How are you feeling?</Text>

          <View style={styles.grid}>
            {FEELINGS.map((f) => (
              <WonderCard key={f.name} color={f.color} onPress={() => selectFeeling(f)} style={styles.feelingCard}>
                <Text style={styles.feelingEmoji}>{f.emoji}</Text>
                <Text style={styles.feelingName}>{f.name}</Text>
                <Text style={styles.animalName}>{f.animal}</Text>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md },
  feelingCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.lg },
  feelingEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  feelingName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text },
  animalName: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },

  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg },
  bigEmoji: { fontSize: 80, marginBottom: SPACING.md },
  feelingTitle: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.lg },
  messageCard: { marginBottom: SPACING.xl, width: '100%' },
  messageText: { fontSize: FONT.lg, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 34 },
  animalEmoji: { fontSize: 64, marginBottom: SPACING.sm },
  animalSays: { fontSize: FONT.body, fontWeight: '700', color: COLORS.textSecondary, marginBottom: SPACING.md },
  activityCard: { marginBottom: SPACING.xl, width: '100%' },
  activityText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center', lineHeight: 34 },

  backBtn: { marginTop: SPACING.xl, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
