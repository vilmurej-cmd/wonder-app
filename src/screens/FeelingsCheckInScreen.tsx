import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

const ANIMALS = [
  {
    key: 'great',
    emoji: '🦁',
    name: 'ROARY',
    label: 'GREAT!',
    color: COLORS.quest,
    message: "That's WONDERFUL! What made today so great?",
  },
  {
    key: 'good',
    emoji: '🐱',
    name: 'WHISKERS',
    label: 'Good!',
    color: COLORS.letters,
    message: 'Good days are nice! Anything you want to talk about?',
  },
  {
    key: 'hmm',
    emoji: '🐻',
    name: 'BENNY',
    label: "Hmm...",
    color: COLORS.animals,
    message: "It's okay to feel unsure. Do you want to tell me more?",
  },
  {
    key: 'notgood',
    emoji: '🐧',
    name: 'PIPPA',
    label: 'Not so good',
    color: COLORS.storySpark,
    message: "I'm sorry you're not feeling great. Do you want to talk about it?",
    showHelp: true,
  },
  {
    key: 'needhug',
    emoji: '🐰',
    name: 'COTTON',
    label: 'I need a hug',
    color: COLORS.heart,
    message: "Oh, sweet friend. Everyone has hard days. You're safe here. Do you want to tell someone?",
    showHelp: true,
  },
];

export default function FeelingsCheckInScreen({ navigation }: any) {
  const [childName, setChildName] = useState('Friend');
  const [selected, setSelected] = useState('');
  const [note, setNote] = useState('');
  const [done, setDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [todayDone, setTodayDone] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childName').then((v) => { if (v) setChildName(v); });
    const today = new Date().toDateString();
    AsyncStorage.getItem('wonderCheckInDate').then((v) => {
      if (v === today) setTodayDone(true);
    });
  }, []);

  const handleSelect = (key: string) => {
    setSelected(key);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleDone = async () => {
    const today = new Date().toDateString();
    await AsyncStorage.setItem('wonderCheckInDate', today);

    // Save to check-in history
    const historyRaw = await AsyncStorage.getItem('wonderCheckInHistory');
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    history.push({ date: today, feeling: selected, note: note.trim() });
    await AsyncStorage.setItem('wonderCheckInHistory', JSON.stringify(history.slice(-30)));

    // Check for multiple sad/scared days
    const recentSad = history
      .slice(-7)
      .filter((h: any) => h.feeling === 'notgood' || h.feeling === 'needhug').length;
    if (recentSad >= 3) {
      await AsyncStorage.setItem('wonderSadAlert', 'true');
    }

    setDone(true);
    setShowCelebration(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const animal = ANIMALS.find((a) => a.key === selected);

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            Hi {childName}! How do you feel today? 😊
          </Text>

          {todayDone && !done && !selected && (
            <WonderCard color={COLORS.quest} style={styles.doneCard}>
              <Text style={styles.doneEmoji}>⭐</Text>
              <Text style={styles.doneText}>
                You already checked in today! Come back tomorrow! 💛
              </Text>
            </WonderCard>
          )}

          {!done && (
            <View style={styles.animalGrid}>
              {ANIMALS.map((a) => (
                <TouchableOpacity
                  key={a.key}
                  style={[
                    styles.animalBtn,
                    selected === a.key && { borderColor: a.color, backgroundColor: a.color + '15', transform: [{ scale: 1.05 }] },
                  ]}
                  onPress={() => handleSelect(a.key)}
                >
                  <Text style={styles.animalEmoji}>{a.emoji}</Text>
                  <Text style={[styles.animalName, selected === a.key && { color: a.color }]}>
                    {a.name}
                  </Text>
                  <Text style={styles.animalLabel}>{a.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selected && !done && animal && (
            <View style={styles.responseSection}>
              <WonderCard color={animal.color} style={styles.responseCard}>
                <Text style={styles.responseEmoji}>{animal.emoji}</Text>
                <Text style={styles.responseName}>{animal.name} says:</Text>
                <Text style={styles.responseMessage}>{animal.message}</Text>
              </WonderCard>

              <TextInput
                style={styles.noteInput}
                placeholder="Want to say more? (you don't have to!)"
                placeholderTextColor={COLORS.textLight}
                multiline
                value={note}
                onChangeText={setNote}
              />

              <BigButton
                title="All Done!"
                emoji="⭐"
                color={animal.color}
                onPress={handleDone}
              />

              {animal.showHelp && (
                <View style={styles.helpSection}>
                  <Text style={styles.helpText}>
                    Would you like to talk to one of your trusted grown-ups?
                  </Text>
                  <BigButton
                    title="My Trusted Grown-Ups"
                    emoji="💛"
                    color={COLORS.safeCircle}
                    onPress={() => navigation.navigate('MyCircle')}
                  />
                </View>
              )}
            </View>
          )}

          {done && (
            <WonderCard color={COLORS.quest} style={styles.completedCard}>
              <Text style={styles.completedEmoji}>🌟</Text>
              <Text style={styles.completedText}>
                Thanks for sharing how you feel, {childName}! That's really brave! 💛
              </Text>
            </WonderCard>
          )}
        </ScrollView>

        {showCelebration && (
          <CelebrationOverlay
            message="Great check-in! 🌟"
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
  title: { fontSize: FONT.lg, fontWeight: '900', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.xl },
  doneCard: { alignItems: 'center', paddingVertical: SPACING.xl, marginBottom: SPACING.lg },
  doneEmoji: { fontSize: 48, marginBottom: SPACING.sm },
  doneText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  animalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  animalBtn: {
    width: '28%',
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  animalEmoji: { fontSize: 44, marginBottom: SPACING.xs },
  animalName: { fontSize: 13, fontWeight: '800', color: COLORS.text },
  animalLabel: { fontSize: 11, color: COLORS.textSecondary, textAlign: 'center', marginTop: 2 },
  responseSection: { marginTop: SPACING.sm },
  responseCard: { alignItems: 'center', paddingVertical: SPACING.xl, marginBottom: SPACING.md },
  responseEmoji: { fontSize: 56, marginBottom: SPACING.sm },
  responseName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm },
  responseMessage: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 26 },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.md,
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: SPACING.md,
  },
  helpSection: { marginTop: SPACING.lg, gap: SPACING.sm },
  helpText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '600' },
  completedCard: { alignItems: 'center', paddingVertical: SPACING.xxl },
  completedEmoji: { fontSize: 64, marginBottom: SPACING.md },
  completedText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center', lineHeight: 30 },
});
