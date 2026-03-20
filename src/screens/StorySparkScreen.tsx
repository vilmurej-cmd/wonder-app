import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

type Phase = 'input' | 'loading' | 'story';

const TOPICS = [
  { label: 'Dinosaurs', emoji: '🦕' },
  { label: 'Space', emoji: '🚀' },
  { label: 'Princess', emoji: '👑' },
  { label: 'Trucks', emoji: '🚛' },
  { label: 'Ocean', emoji: '🐙' },
  { label: 'Animals', emoji: '🦁' },
  { label: 'Magic', emoji: '✨' },
];

const MOCK_STORY = `Once upon a time, in a land filled with sparkling stars and fluffy clouds, there lived a brave little adventurer named Luna.

Luna loved dinosaurs more than anything in the whole wide world. Every night, Luna would look up at the stars and wish to meet a real dinosaur.

One magical evening, a friendly baby dinosaur named Sprout appeared in Luna's backyard! Sprout had soft green scales and the biggest, sweetest smile.

"Will you be my friend?" asked Sprout.

"Yes!" cheered Luna. Together, they went on the most wonderful adventure through the Enchanted Forest, where flowers sang songs and butterflies showed them the way.

At the end of the adventure, Sprout gave Luna a special star that glowed in the dark. "Whenever you look at this star, remember our adventure," Sprout said.

Luna hugged Sprout goodnight, climbed into bed, and held the glowing star close. With a happy smile and wonderful memories, Luna drifted off to the most peaceful sleep, dreaming of tomorrow's adventures.

The end. 🌟`;

export default function StorySparkScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('input');
  const [childName, setChildName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [isReading, setIsReading] = useState(false);

  const handleGenerate = () => {
    if (!childName.trim() || !selectedTopic) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setPhase('loading');
    // Mock delay — will call AI in Phase 3
    setTimeout(() => setPhase('story'), 2500);
  };

  const handleReadToMe = () => {
    if (isReading) {
      Speech.stop();
      setIsReading(false);
      return;
    }
    setIsReading(true);
    Speech.speak(MOCK_STORY.replace(/🌟/g, ''), {
      rate: 0.85,
      pitch: 1.1,
      onDone: () => setIsReading(false),
      onStopped: () => setIsReading(false),
    });
  };

  const handleNewStory = () => {
    Speech.stop();
    setIsReading(false);
    setPhase('input');
    setSelectedTopic('');
  };

  if (phase === 'loading') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingEmoji}>📖✨</Text>
            <ActivityIndicator size="large" color={COLORS.storySpark} style={{ marginBottom: SPACING.md }} />
            <Text style={styles.loadingText}>Writing a story just for {childName}...</Text>
          </View>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (phase === 'story') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.storyContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.storyTitle}>A Story for {childName} ✨</Text>
            <WonderCard color={COLORS.storySpark} style={styles.storyCard}>
              <Text style={styles.storyText}>{MOCK_STORY}</Text>
            </WonderCard>

            <BigButton
              title={isReading ? 'Stop Reading' : 'Read to Me'}
              emoji={isReading ? '⏹️' : '🔊'}
              color={COLORS.storySpark}
              onPress={handleReadToMe}
            />
            <BigButton title="New Story" emoji="📖" color={COLORS.primary} onPress={handleNewStory} style={{ marginTop: SPACING.sm }} outline />
            <TouchableOpacity onPress={() => { Speech.stop(); navigation.goBack(); }} style={styles.backBtn}>
              <Text style={styles.backText}>← Back Home</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Story Spark 📖</Text>
          <Text style={styles.subtitle}>Grown-up helps here!</Text>

          <Text style={styles.label}>Child's name:</Text>
          <TextInput
            style={styles.nameInput}
            value={childName}
            onChangeText={setChildName}
            placeholder="Enter name"
            placeholderTextColor={COLORS.textLight}
            maxLength={20}
          />

          <Text style={styles.label}>What does {childName || 'your child'} love?</Text>
          <View style={styles.topicGrid}>
            {TOPICS.map((t) => (
              <WonderCard
                key={t.label}
                color={selectedTopic === t.label ? COLORS.storySpark : COLORS.border}
                onPress={() => setSelectedTopic(t.label)}
                style={[styles.topicCard, selectedTopic === t.label ? styles.topicSelected : undefined]}
              >
                <Text style={styles.topicEmoji}>{t.emoji}</Text>
                <Text style={styles.topicLabel}>{t.label}</Text>
              </WonderCard>
            ))}
          </View>

          <BigButton
            title="Create Story"
            emoji="✨"
            color={childName.trim() && selectedTopic ? COLORS.storySpark : '#D1D5DB'}
            onPress={handleGenerate}
          />

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
  subtitle: { fontSize: 14, color: COLORS.storySpark, textAlign: 'center', fontWeight: '700', marginBottom: SPACING.lg },
  label: { fontSize: FONT.body, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.md },
  nameInput: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.storySpark,
    padding: SPACING.md,
    fontSize: FONT.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  topicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.xl },
  topicCard: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, alignItems: 'center', width: '30%' },
  topicSelected: { backgroundColor: '#EEF2FF' },
  topicEmoji: { fontSize: 32, marginBottom: 4 },
  topicLabel: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  loadingEmoji: { fontSize: 64, marginBottom: SPACING.lg },
  loadingText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.storySpark, textAlign: 'center' },
  storyContainer: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  storyTitle: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.storySpark, textAlign: 'center', marginBottom: SPACING.lg },
  storyCard: { marginBottom: SPACING.lg },
  storyText: { fontSize: FONT.body, lineHeight: 30, color: COLORS.text },
  backBtn: { marginTop: SPACING.xl, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
