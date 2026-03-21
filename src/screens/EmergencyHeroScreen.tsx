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

const EMERGENCIES = [
  { text: 'Your house is on fire', emoji: '🔥', isEmergency: true, feedback: 'Great job! A fire is an emergency! Call 911!' },
  { text: "Your mom fell and won't wake up", emoji: '😰', isEmergency: true, feedback: "That's right! If a grown-up is hurt and can't talk, call 911!" },
  { text: "You can't find your favorite toy", emoji: '🧸', isEmergency: false, feedback: "That's frustrating, but not an emergency. Ask a grown-up to help you look!" },
  { text: 'Someone broke into your house', emoji: '🚨', isEmergency: true, feedback: "Good thinking! That's scary and you need help right away!" },
  { text: 'You want pizza for dinner', emoji: '🍕', isEmergency: false, feedback: "Ha! That's not an emergency, but it IS a good idea! 🍕" },
  { text: 'Your brother scraped his knee', emoji: '🩹', isEmergency: false, feedback: 'Ouch! But a grown-up at home can help with that. A bandage will do!' },
  { text: "You smell smoke but don't see fire", emoji: '💨', isEmergency: true, feedback: "Smart! Where there's smoke, there might be fire. Call 911!" },
  { text: 'A grown-up is hurting another grown-up', emoji: '😟', isEmergency: true, feedback: "That IS an emergency. It's okay to call 911 if someone is being hurt." },
];

const PRACTICE_STEPS = [
  { dispatcher: "911, what's your emergency?", options: ["My grown-up is hurt", "There's a fire", "Someone is in my house"] },
  { dispatcher: "Okay, you're doing great. What's your name?", options: ['name'] },
  { dispatcher: "And where are you? What's your address?", options: ['address'] },
  { dispatcher: "Help is on the way. You are SO brave. Stay on the phone with me, okay?", options: ['done'] },
];

type Phase = 'menu' | 'what911' | 'when911' | 'practice' | 'memory' | 'badges';

export default function EmergencyHeroScreen({ navigation }: any) {
  const [phase, setPhase] = useState<Phase>('menu');
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [childName, setChildName] = useState('');
  const [homeAddress, setHomeAddress] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [addressGuess, setAddressGuess] = useState('');
  const [phoneGuess, setPhoneGuess] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [badges, setBadges] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('childName').then((v) => { if (v) setChildName(v); });
    AsyncStorage.getItem('wonderAddress').then((v) => { if (v) setHomeAddress(v); });
    AsyncStorage.getItem('wonderParentPhone').then((v) => { if (v) setParentPhone(v); });
    AsyncStorage.getItem('wonderHeroBadges').then((v) => { if (v) setBadges(JSON.parse(v)); });
  }, []);

  const earnBadge = async (badge: string) => {
    if (!badges.includes(badge)) {
      const updated = [...badges, badge];
      setBadges(updated);
      await AsyncStorage.setItem('wonderHeroBadges', JSON.stringify(updated));
      setShowCelebration(true);
    }
  };

  const handleQuizAnswer = (isEmergency: boolean) => {
    const correct = isEmergency === EMERGENCIES[quizIndex].isEmergency;
    setQuizAnswered(true);
    if (correct) setQuizScore(quizScore + 1);
    Haptics.impactAsync(correct ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium);
  };

  const nextQuiz = () => {
    setQuizAnswered(false);
    if (quizIndex < EMERGENCIES.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      earnBadge('911_expert');
      setPhase('menu');
      setQuizIndex(0);
      setQuizScore(0);
    }
  };

  const ALL_BADGES = [
    { key: '911_expert', emoji: '🦸', name: '911 Expert' },
    { key: 'address_master', emoji: '🏠', name: 'Address Master' },
    { key: 'phone_pro', emoji: '📞', name: 'Phone Number Pro' },
  ];

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Emergency Hero 🦸</Text>
          <Text style={styles.subtitle}>Today, YOU are the Emergency Hero!</Text>

          {phase === 'menu' && (
            <>
              {badges.length > 0 && (
                <View style={styles.badgeRow}>
                  {ALL_BADGES.map((b) => (
                    <View key={b.key} style={[styles.badgeItem, !badges.includes(b.key) && { opacity: 0.3 }]}>
                      <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                      <Text style={styles.badgeName}>{b.name}</Text>
                    </View>
                  ))}
                </View>
              )}

              <WonderCard color={COLORS.safeHero} style={styles.menuCard}>
                <Text style={styles.menuEmoji}>📞</Text>
                <Text style={styles.menuTitle}>What Is 911?</Text>
                <Text style={styles.menuDesc}>Learn about the brave helpers</Text>
              </WonderCard>
              <TouchableOpacity onPress={() => setPhase('what911')}>
                <Text style={styles.startLink}>Start Lesson →</Text>
              </TouchableOpacity>

              <BigButton
                title="Should You Call 911?"
                emoji="🎮"
                color={COLORS.safeHero}
                onPress={() => { setPhase('when911'); setQuizIndex(0); setQuizScore(0); setQuizAnswered(false); }}
              />

              <BigButton
                title="Practice Calling 911"
                emoji="📱"
                color={COLORS.primary}
                onPress={() => { setPhase('practice'); setPracticeStep(0); }}
              />

              <BigButton
                title="Remember My Address"
                emoji="🏠"
                color={COLORS.quest}
                onPress={() => setPhase('memory')}
              />
            </>
          )}

          {phase === 'what911' && (
            <>
              <WonderCard color={COLORS.safeHero} style={styles.lessonCard}>
                <Text style={styles.lessonEmoji}>📞</Text>
                <Text style={styles.lessonText}>
                  911 is a special phone number. When you call it, brave helpers answer — like firefighters, police, and ambulance drivers.
                </Text>
                <Text style={styles.lessonText}>
                  They come to help when someone is hurt, when there's a fire, or when something really scary is happening.
                </Text>
              </WonderCard>

              <View style={styles.helperRow}>
                <View style={styles.helperCard}>
                  <Text style={styles.helperEmoji}>🚒</Text>
                  <Text style={styles.helperName}>Firefighters</Text>
                </View>
                <View style={styles.helperCard}>
                  <Text style={styles.helperEmoji}>🚔</Text>
                  <Text style={styles.helperName}>Police</Text>
                </View>
                <View style={styles.helperCard}>
                  <Text style={styles.helperEmoji}>🚑</Text>
                  <Text style={styles.helperName}>Ambulance</Text>
                </View>
              </View>

              <WonderCard color={COLORS.quest} style={{ marginTop: SPACING.md }}>
                <Text style={styles.tipText}>
                  You can call 911 from ANY phone, even if it's locked. You will NEVER get in trouble for calling 911 in a real emergency.
                </Text>
              </WonderCard>

              <BigButton title="Got It!" emoji="👍" color={COLORS.safeHero} onPress={() => setPhase('menu')} />
            </>
          )}

          {phase === 'when911' && (
            <>
              <Text style={styles.progressText}>
                {quizIndex + 1} of {EMERGENCIES.length}
              </Text>

              <WonderCard color={COLORS.safeHero} style={styles.quizCard}>
                <Text style={styles.quizEmoji}>{EMERGENCIES[quizIndex].emoji}</Text>
                <Text style={styles.quizText}>{EMERGENCIES[quizIndex].text}</Text>
              </WonderCard>

              {!quizAnswered ? (
                <View style={styles.answerRow}>
                  <BigButton title="YES — Call 911! 🚨" color={COLORS.safeHero} onPress={() => handleQuizAnswer(true)} />
                  <BigButton title="No — Not an emergency" color={COLORS.textSecondary} onPress={() => handleQuizAnswer(false)} />
                </View>
              ) : (
                <WonderCard color={COLORS.success} style={styles.feedbackCard}>
                  <Text style={styles.feedbackText}>{EMERGENCIES[quizIndex].feedback}</Text>
                  <BigButton
                    title={quizIndex < EMERGENCIES.length - 1 ? 'Next!' : 'All Done!'}
                    emoji={quizIndex < EMERGENCIES.length - 1 ? '➡️' : '🎉'}
                    color={COLORS.safeHero}
                    onPress={nextQuiz}
                  />
                </WonderCard>
              )}
            </>
          )}

          {phase === 'practice' && (
            <>
              <WonderCard color={COLORS.primary} style={styles.phoneCard}>
                <Text style={styles.phoneTitle}>📱 Practice Call</Text>

                {practiceStep < PRACTICE_STEPS.length && (
                  <>
                    <View style={styles.dispatcherBubble}>
                      <Text style={styles.dispatcherText}>
                        {PRACTICE_STEPS[practiceStep].dispatcher}
                      </Text>
                    </View>

                    {PRACTICE_STEPS[practiceStep].options[0] === 'done' ? (
                      <View style={styles.practiceComplete}>
                        <Text style={styles.practiceCompleteEmoji}>🎉</Text>
                        <Text style={styles.practiceCompleteText}>
                          YOU DID IT! You're an Emergency Hero!
                        </Text>
                        <BigButton
                          title="I'm a Hero!"
                          emoji="🦸"
                          color={COLORS.safeHero}
                          onPress={() => { earnBadge('911_expert'); setPhase('menu'); }}
                        />
                      </View>
                    ) : PRACTICE_STEPS[practiceStep].options[0] === 'name' ? (
                      <View style={styles.responseBubble}>
                        <Text style={styles.responseText}>
                          "My name is {childName || 'my name'}!"
                        </Text>
                        <BigButton title="I said it!" emoji="✅" color={COLORS.quest} onPress={() => setPracticeStep(practiceStep + 1)} />
                      </View>
                    ) : PRACTICE_STEPS[practiceStep].options[0] === 'address' ? (
                      <View style={styles.responseBubble}>
                        <Text style={styles.responseText}>
                          {homeAddress ? `"I'm at ${homeAddress}!"` : '"I\'m at [your address]!"'}
                        </Text>
                        <BigButton title="I said it!" emoji="✅" color={COLORS.quest} onPress={() => setPracticeStep(practiceStep + 1)} />
                      </View>
                    ) : (
                      <View style={styles.optionsColumn}>
                        {PRACTICE_STEPS[practiceStep].options.map((opt, i) => (
                          <BigButton
                            key={i}
                            title={opt}
                            color={i === 0 ? COLORS.safeHero : i === 1 ? COLORS.animals : COLORS.storySpark}
                            onPress={() => setPracticeStep(practiceStep + 1)}
                          />
                        ))}
                      </View>
                    )}
                  </>
                )}
              </WonderCard>

              <TouchableOpacity onPress={() => setPhase('menu')} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Back to Menu</Text>
              </TouchableOpacity>
            </>
          )}

          {phase === 'memory' && (
            <>
              {homeAddress ? (
                <WonderCard color={COLORS.quest} style={styles.memoryCard}>
                  <Text style={styles.memoryEmoji}>🏠</Text>
                  <Text style={styles.memoryLabel}>Your address is:</Text>
                  <Text style={styles.memoryValue}>{homeAddress}</Text>
                  <Text style={styles.memoryLabel}>Can you type it?</Text>
                  <TextInput
                    style={styles.memoryInput}
                    value={addressGuess}
                    onChangeText={setAddressGuess}
                    placeholder="Type your address..."
                    placeholderTextColor={COLORS.textLight}
                  />
                  <BigButton
                    title="Check!"
                    emoji="✨"
                    color={COLORS.quest}
                    onPress={() => {
                      if (addressGuess.trim().toLowerCase().includes(homeAddress.toLowerCase().slice(0, 5))) {
                        earnBadge('address_master');
                        setAddressGuess('');
                      } else {
                        Alert.alert('Almost!', `Try again! Your address starts with "${homeAddress.slice(0, 10)}..."`);
                        setAddressGuess('');
                      }
                    }}
                  />
                </WonderCard>
              ) : (
                <WonderCard color={COLORS.safeCircle} style={styles.memoryCard}>
                  <Text style={styles.memoryEmoji}>🏠</Text>
                  <Text style={styles.memoryLabel}>
                    Ask a grown-up to add your address in Parent Settings so you can practice!
                  </Text>
                </WonderCard>
              )}

              {parentPhone ? (
                <WonderCard color={COLORS.letters} style={styles.memoryCard}>
                  <Text style={styles.memoryEmoji}>📞</Text>
                  <Text style={styles.memoryLabel}>Your grown-up's phone number is:</Text>
                  <Text style={styles.memoryValue}>{parentPhone}</Text>
                  <Text style={styles.memoryLabel}>Can you type it?</Text>
                  <TextInput
                    style={styles.memoryInput}
                    value={phoneGuess}
                    onChangeText={setPhoneGuess}
                    placeholder="Type the phone number..."
                    placeholderTextColor={COLORS.textLight}
                    keyboardType="phone-pad"
                  />
                  <BigButton
                    title="Check!"
                    emoji="✨"
                    color={COLORS.letters}
                    onPress={() => {
                      const clean = (s: string) => s.replace(/\D/g, '');
                      if (clean(phoneGuess) === clean(parentPhone)) {
                        earnBadge('phone_pro');
                        setPhoneGuess('');
                      } else {
                        Alert.alert('Almost!', 'Try again! You can do it! 💪');
                        setPhoneGuess('');
                      }
                    }}
                  />
                </WonderCard>
              ) : null}

              <TouchableOpacity onPress={() => setPhase('menu')} style={styles.backLink}>
                <Text style={styles.backLinkText}>← Back to Menu</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>

        {showCelebration && (
          <CelebrationOverlay
            message="You're an Emergency Hero! 🦸"
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
  badgeRow: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.lg, marginBottom: SPACING.lg },
  badgeItem: { alignItems: 'center' },
  badgeEmoji: { fontSize: 32 },
  badgeName: { fontSize: 11, fontWeight: '700', color: COLORS.text, marginTop: 2 },
  menuCard: { alignItems: 'center', paddingVertical: SPACING.lg, marginBottom: SPACING.xs },
  menuEmoji: { fontSize: 44, marginBottom: SPACING.sm },
  menuTitle: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text },
  menuDesc: { fontSize: 14, color: COLORS.textSecondary },
  startLink: { color: COLORS.safeHero, fontSize: 16, fontWeight: '700', textAlign: 'center', marginBottom: SPACING.md, padding: SPACING.sm },
  lessonCard: { alignItems: 'center', paddingVertical: SPACING.xl },
  lessonEmoji: { fontSize: 56, marginBottom: SPACING.md },
  lessonText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 26, marginBottom: SPACING.md },
  helperRow: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: SPACING.lg },
  helperCard: { alignItems: 'center' },
  helperEmoji: { fontSize: 44 },
  helperName: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xs },
  tipText: { fontSize: 15, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 22 },
  progressText: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', fontWeight: '600', marginBottom: SPACING.md },
  quizCard: { alignItems: 'center', paddingVertical: SPACING.xl, marginBottom: SPACING.md },
  quizEmoji: { fontSize: 56, marginBottom: SPACING.md },
  quizText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center', lineHeight: 30 },
  answerRow: { gap: SPACING.sm },
  feedbackCard: { paddingVertical: SPACING.lg, marginTop: SPACING.sm },
  feedbackText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, textAlign: 'center', lineHeight: 24, marginBottom: SPACING.lg },
  phoneCard: { alignItems: 'center', paddingVertical: SPACING.xl },
  phoneTitle: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.lg },
  dispatcherBubble: {
    backgroundColor: COLORS.bgMid,
    borderRadius: RADIUS.lg,
    borderTopLeftRadius: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    width: '90%',
  },
  dispatcherText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text, lineHeight: 24 },
  responseBubble: {
    backgroundColor: COLORS.bgTop,
    borderRadius: RADIUS.lg,
    borderTopRightRadius: 4,
    padding: SPACING.md,
    width: '90%',
    alignItems: 'center',
    gap: SPACING.md,
  },
  responseText: { fontSize: FONT.body, fontWeight: '700', color: COLORS.primary, textAlign: 'center' },
  optionsColumn: { width: '90%', gap: SPACING.sm },
  practiceComplete: { alignItems: 'center', gap: SPACING.md },
  practiceCompleteEmoji: { fontSize: 64 },
  practiceCompleteText: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  memoryCard: { alignItems: 'center', paddingVertical: SPACING.xl, marginBottom: SPACING.md },
  memoryEmoji: { fontSize: 48, marginBottom: SPACING.md },
  memoryLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.sm },
  memoryValue: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text, textAlign: 'center', marginBottom: SPACING.md },
  memoryInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    fontSize: FONT.body,
    fontWeight: '700',
    textAlign: 'center',
    width: '85%',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  backLink: { alignItems: 'center', marginTop: SPACING.lg },
  backLinkText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
