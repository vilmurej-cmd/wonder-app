import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import { COLORS, FONT, SPACING, RADIUS, TOUCH_MIN } from '../constants/theme';

const RELATIONSHIPS = [
  { label: 'Family', color: '#F59E0B', emoji: '👨‍👩‍👧' },
  { label: 'Teacher', color: '#22C55E', emoji: '👩‍🏫' },
  { label: 'Neighbor', color: '#3B82F6', emoji: '🏠' },
  { label: 'Other', color: '#A855F7', emoji: '💜' },
];

const AVATARS = ['🦁', '🐻', '🐧', '🐰', '🦉', '🐕', '🦋', '🌟', '💛', '🐱', '🐘', '🦊'];

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  avatar: string;
  isPrimary: boolean;
}

export default function MyCircleScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('Family');
  const [avatar, setAvatar] = useState('🦁');

  useEffect(() => {
    AsyncStorage.getItem('wonderCircle').then((v) => {
      if (v) setContacts(JSON.parse(v));
    });
  }, []);

  const save = async (updated: Contact[]) => {
    setContacts(updated);
    await AsyncStorage.setItem('wonderCircle', JSON.stringify(updated));
  };

  const addContact = () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert('Oops!', 'Please enter a name and phone number.');
      return;
    }
    if (contacts.length >= 6) {
      Alert.alert('Circle Full', 'You can have up to 6 trusted grown-ups.');
      return;
    }
    const c: Contact = {
      id: Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      relationship,
      avatar,
      isPrimary: contacts.length === 0,
    };
    save([...contacts, c]);
    setName('');
    setPhone('');
    setShowAdd(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const setPrimary = (id: string) => {
    save(contacts.map((c) => ({ ...c, isPrimary: c.id === id })));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const removeContact = (id: string) => {
    Alert.alert('Remove?', 'Remove this person from the circle?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => save(contacts.filter((c) => c.id !== id)) },
    ]);
  };

  const callPrimary = () => {
    const primary = contacts.find((c) => c.isPrimary) || contacts[0];
    if (primary) Linking.openURL(`tel:${primary.phone}`);
    else Alert.alert('No contacts', 'Ask a grown-up to add trusted people first!');
  };

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>

          <Text style={styles.title}>My Trusted Grown-Ups 💛</Text>
          <Text style={styles.subtitle}>
            These are your special grown-ups. They love you and want to keep you safe!
          </Text>

          {contacts.length > 0 && (
            <View style={styles.circleContainer}>
              <View style={styles.circleGrid}>
                {contacts.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => Linking.openURL(`tel:${c.phone}`)}
                    onLongPress={() => removeContact(c.id)}
                    style={styles.contactBubble}
                  >
                    <View style={[styles.avatarCircle, { borderColor: RELATIONSHIPS.find((r) => r.label === c.relationship)?.color || COLORS.primary }]}>
                      <Text style={styles.avatarText}>{c.avatar}</Text>
                      {c.isPrimary && <Text style={styles.starBadge}>⭐</Text>}
                    </View>
                    <Text style={styles.contactName} numberOfLines={1}>{c.name}</Text>
                    <Text style={styles.contactRelation}>{c.relationship}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.youCenter}>
                <Text style={styles.youEmoji}>😊</Text>
                <Text style={styles.youText}>YOU!</Text>
              </View>
            </View>
          )}

          {contacts.length === 0 && (
            <WonderCard color={COLORS.safeCircle} style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>💛</Text>
              <Text style={styles.emptyText}>
                Ask a grown-up to add your trusted people!
              </Text>
              <Text style={styles.emptyHint}>
                Tap the gear icon on the home screen to set up your circle.
              </Text>
            </WonderCard>
          )}

          {contacts.length > 0 && (
            <BigButton
              title="CALL FOR HELP"
              emoji="📞"
              color={COLORS.safeHero}
              onPress={callPrimary}
            />
          )}

          <Text style={styles.tip}>
            If ANYTHING ever makes you feel scared or confused, you can talk to ANY of these people. That's what they're here for! 💛
          </Text>
        </ScrollView>
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
  circleContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  circleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.md },
  contactBubble: { alignItems: 'center', width: 90 },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: { fontSize: 36 },
  starBadge: { position: 'absolute', top: -4, right: -4, fontSize: 16 },
  contactName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xs, textAlign: 'center' },
  contactRelation: { fontSize: 11, color: COLORS.textSecondary },
  youCenter: { alignItems: 'center', marginTop: SPACING.md },
  youEmoji: { fontSize: 40 },
  youText: { fontSize: FONT.body, fontWeight: '900', color: COLORS.primary, marginTop: 2 },
  emptyCard: { alignItems: 'center', paddingVertical: SPACING.xxl },
  emptyEmoji: { fontSize: 56, marginBottom: SPACING.md },
  emptyText: { fontSize: FONT.lg, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  emptyHint: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm },
  tip: { fontSize: 15, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.lg, lineHeight: 22 },
});
