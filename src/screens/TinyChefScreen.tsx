import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING } from '../constants/theme';
import { RECIPES } from '../constants/tools';

type Phase = 'menu' | 'cooking' | 'done';

export default function TinyChefScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('menu');
  const [recipe, setRecipe] = useState(RECIPES[0]);
  const [stepIndex, setStepIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const selectRecipe = (r: typeof RECIPES[0]) => {
    setRecipe(r);
    setStepIndex(0);
    setPhase('cooking');
  };

  const nextStep = () => {
    if (stepIndex < recipe.steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setShowCelebration(true);
    }
  };

  if (phase === 'cooking') {
    const step = recipe.steps[stepIndex];
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.cookingContainer}>
            <Text style={styles.recipeTitle}>Making {recipe.emoji} {recipe.name}</Text>
            <Text style={styles.stepCount}>Step {stepIndex + 1} of {recipe.steps.length}</Text>

            <View style={styles.stepCard}>
              <Text style={styles.stepEmoji}>{step.emoji}</Text>
              <Text style={styles.stepText}>{step.text}</Text>
            </View>

            <BigButton
              title={stepIndex < recipe.steps.length - 1 ? 'Next Step' : 'Time to Serve!'}
              emoji={stepIndex < recipe.steps.length - 1 ? '👉' : '🎉'}
              color={recipe.color}
              onPress={nextStep}
            />

            <TouchableOpacity onPress={() => setPhase('menu')} style={styles.backBtn}>
              <Text style={styles.backText}>← Pick another recipe</Text>
            </TouchableOpacity>
          </View>

          {showCelebration && (
            <CelebrationOverlay
              message={`${recipe.emoji} Yummy!`}
              onDone={() => { setShowCelebration(false); setPhase('menu'); }}
            />
          )}
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Tiny Chef 🧑‍🍳</Text>
          <Text style={styles.subtitle}>What shall we make?</Text>

          <View style={styles.recipeGrid}>
            {RECIPES.map((r) => (
              <WonderCard key={r.name} color={r.color} onPress={() => selectRecipe(r)} style={styles.recipeCard}>
                <Text style={styles.recipeEmoji}>{r.emoji}</Text>
                <Text style={styles.recipeName}>{r.name}</Text>
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
  recipeGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md },
  recipeCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.xl },
  recipeEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  recipeName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text },

  cookingContainer: { flex: 1, padding: SPACING.lg, justifyContent: 'center' },
  recipeTitle: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  stepCount: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.xl },
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  stepEmoji: { fontSize: 72, marginBottom: SPACING.md },
  stepText: { fontSize: FONT.xl, fontWeight: '800', color: COLORS.text, textAlign: 'center' },

  backBtn: { marginTop: SPACING.xl, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
