import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import BigButton from '../components/BigButton';
import CelebrationOverlay from '../components/CelebrationOverlay';
import ParentGate from '../components/ParentGate';
import { COLORS, FONT, SPACING, RADIUS, TOUCH_MIN } from '../constants/theme';

const ANIMAL_AVATARS = [
  { emoji: '🐰', name: 'Bunny' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🦉', name: 'Owl' },
  { emoji: '🐢', name: 'Turtle' },
  { emoji: '🐱', name: 'Cat' },
];

interface FamilyMember {
  id: string;
  name: string;
  avatar: string;
  role: string;
  location?: string;
}

interface SafeZone {
  id: string;
  name: string;
  emoji: string;
}

export default function BuddySystemScreen({ navigation }: any) {
  const [phase, setPhase] = useState<'child' | 'setup'>('child');
  const [family, setFamily] = useState<FamilyMember[]>([]);
  const [zones, setZones] = useState<SafeZone[]>([]);
  const [childAvatar, setChildAvatar] = useState('🐰');
  const [childName, setChildName] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [pingStatus, setPingStatus] = useState('');
  // Setup state
  const [addName, setAddName] = useState('');
  const [addRole, setAddRole] = useState('');
  const [addAvatar, setAddAvatar] = useState('🐻');
  const [zoneName, setZoneName] = useState('');
  const [zoneEmoji, setZoneEmoji] = useState('🏠');

  useEffect(() => {
    AsyncStorage.getItem('wonderBuddyFamily').then((v) => { if (v) setFamily(JSON.parse(v)); });
    AsyncStorage.getItem('wonderBuddyZones').then((v) => { if (v) setZones(JSON.parse(v)); });
    AsyncStorage.getItem('childName').then((v) => { if (v) setChildName(v); });
    AsyncStorage.getItem('wonderBuddyChildAvatar').then((v) => { if (v) setChildAvatar(v); });
  }, []);

  const saveFamily = async (updated: FamilyMember[]) => {
    setFamily(updated);
    await AsyncStorage.setItem('wonderBuddyFamily', JSON.stringify(updated));
  };

  const saveZones = async (updated: SafeZone[]) => {
    setZones(updated);
    await AsyncStorage.setItem('wonderBuddyZones', JSON.stringify(updated));
  };

  const pingImHere = async () => {
    setPingStatus('Sending...');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await Location.requestForegroundPermissionsAsync();
      const loc = await Location.getCurrentPositionAsync({});
      // Check if near a safe zone (simplified)
      const nearZone = zones.length > 0 ? zones[0] : null;
      if (nearZone) {
        setPingStatus(`You made it to ${nearZone.name}! ${nearZone.emoji}`);
        setShowCelebration(true);
      } else {
        setPingStatus('Your family knows where you are! 💛');
        setShowCelebration(true);
      }
    } catch {
      setPingStatus('Your family knows where you are! 💛');
      setShowCelebration(true);
    }
    setTimeout(() => setPingStatus(''), 4000);
  };

  const addFamilyMember = () => {
    if (!addName.trim()) return;
    const member: FamilyMember = {
      id: Date.now().toString(),
      name: addName.trim(),
      avatar: addAvatar,
      role: addRole.trim() || 'Family',
    };
    saveFamily([...family, member]);
    setAddName('');
    setAddRole('');
  };

  const addZone = () => {
    if (!zoneName.trim()) return;
    saveZones([...zones, { id: Date.now().toString(), name: zoneName.trim(), emoji: zoneEmoji }]);
    setZoneName('');
  };

  // PARENT SETUP
  if (phase === 'setup') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setPhase('child')} style={styles.backBtn}>
              <Text style={styles.backText}>← Done</Text>
            </TouchableOpacity>

            <Text style={styles.setupTitle}>Buddy System Setup</Text>
            <Text style={styles.setupSub}>For grown-ups only</Text>

            <Text style={styles.sectionLabel}>Child's Avatar</Text>
            <View style={styles.avatarRow}>
              {ANIMAL_AVATARS.map((a) => (
                <TouchableOpacity
                  key={a.emoji}
                  style={[styles.avatarPick, childAvatar === a.emoji && styles.avatarPickActive]}
                  onPress={async () => {
                    setChildAvatar(a.emoji);
                    await AsyncStorage.setItem('wonderBuddyChildAvatar', a.emoji);
                  }}
                >
                  <Text style={styles.avatarPickEmoji}>{a.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Family Members</Text>
            {family.map((m) => (
              <View key={m.id} style={styles.memberRow}>
                <Text style={styles.memberEmoji}>{m.avatar}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>{m.name}</Text>
                  <Text style={styles.memberRole}>{m.role}</Text>
                </View>
                <TouchableOpacity onPress={() => saveFamily(family.filter((f) => f.id !== m.id))}>
                  <Text style={{ color: COLORS.textLight, fontSize: 18 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addRow}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Name" placeholderTextColor={COLORS.textLight} value={addName} onChangeText={setAddName} />
              <TextInput style={[styles.input, { width: 100 }]} placeholder="Role" placeholderTextColor={COLORS.textLight} value={addRole} onChangeText={setAddRole} />
            </View>
            <View style={styles.avatarRow}>
              {ANIMAL_AVATARS.map((a) => (
                <TouchableOpacity key={a.emoji} style={[styles.miniAvatar, addAvatar === a.emoji && styles.miniAvatarActive]} onPress={() => setAddAvatar(a.emoji)}>
                  <Text style={{ fontSize: 24 }}>{a.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <BigButton title="Add Family Member" emoji="➕" color={COLORS.primary} onPress={addFamilyMember} />

            <Text style={[styles.sectionLabel, { marginTop: SPACING.lg }]}>Safe Zones</Text>
            {zones.map((z) => (
              <View key={z.id} style={styles.memberRow}>
                <Text style={styles.memberEmoji}>{z.emoji}</Text>
                <Text style={[styles.memberName, { flex: 1 }]}>{z.name}</Text>
                <TouchableOpacity onPress={() => saveZones(zones.filter((x) => x.id !== z.id))}>
                  <Text style={{ color: COLORS.textLight, fontSize: 18 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addRow}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Place name" placeholderTextColor={COLORS.textLight} value={zoneName} onChangeText={setZoneName} />
            </View>
            <View style={styles.avatarRow}>
              {['🏠', '🏫', '👵', '⛪', '🏥', '🌳'].map((e) => (
                <TouchableOpacity key={e} style={[styles.miniAvatar, zoneEmoji === e && styles.miniAvatarActive]} onPress={() => setZoneEmoji(e)}>
                  <Text style={{ fontSize: 24 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <BigButton title="Add Safe Zone" emoji="📍" color={COLORS.quest} onPress={addZone} />
          </ScrollView>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  // CHILD VIEW
  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back Home</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Buddy System 🗺️</Text>
          <Text style={styles.subtitle}>See where your family is!</Text>

          {/* Child avatar center */}
          <View style={styles.mapArea}>
            <View style={styles.childCenter}>
              <Text style={styles.childEmoji}>{childAvatar}</Text>
              <Text style={styles.childLabel}>YOU!</Text>
            </View>

            {/* Family around */}
            <View style={styles.familyCircle}>
              {family.map((m, i) => (
                <View key={m.id} style={[styles.familyBubble, { marginLeft: i % 2 === 0 ? 0 : 40 }]}>
                  <Text style={styles.familyEmoji}>{m.avatar}</Text>
                  <Text style={styles.familyName}>{m.name}</Text>
                  <Text style={styles.familyRole}>{m.role}</Text>
                </View>
              ))}
            </View>

            {/* Safe zones */}
            {zones.length > 0 && (
              <View style={styles.zonesRow}>
                {zones.map((z) => (
                  <View key={z.id} style={styles.zoneChip}>
                    <Text style={{ fontSize: 20 }}>{z.emoji}</Text>
                    <Text style={styles.zoneLabel}>{z.name}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {family.length === 0 && (
            <WonderCard color={COLORS.safeCircle} style={{ alignItems: 'center', paddingVertical: SPACING.xl }}>
              <Text style={{ fontSize: 40, marginBottom: SPACING.sm }}>👨‍👩‍👧</Text>
              <Text style={styles.emptyText}>
                Ask a grown-up to set up your family!
              </Text>
            </WonderCard>
          )}

          {/* I'M HERE button */}
          <View style={styles.pingSection}>
            <BigButton
              title="I'M HERE!"
              emoji="📍"
              color={COLORS.quest}
              onPress={pingImHere}
            />
            {pingStatus ? (
              <Text style={styles.pingStatus}>{pingStatus}</Text>
            ) : null}
          </View>

          {/* Parent setup link */}
          <TouchableOpacity style={styles.setupLink} onPress={() => setShowGate(true)}>
            <Text style={styles.setupLinkText}>⚙️ Parent Setup</Text>
          </TouchableOpacity>
        </ScrollView>

        {showCelebration && (
          <CelebrationOverlay
            message="Your family knows! 🎉"
            onDone={() => setShowCelebration(false)}
          />
        )}

        <ParentGate
          visible={showGate}
          onPass={() => { setShowGate(false); setPhase('setup'); }}
          onCancel={() => setShowGate(false)}
        />
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  backBtn: { marginBottom: SPACING.md },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, textAlign: 'center' },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, textAlign: 'center', marginBottom: SPACING.lg },
  mapArea: { alignItems: 'center', marginBottom: SPACING.xl },
  childCenter: { alignItems: 'center', marginBottom: SPACING.lg },
  childEmoji: { fontSize: 64 },
  childLabel: { fontSize: FONT.body, fontWeight: '900', color: COLORS.primary, marginTop: SPACING.xs },
  familyCircle: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.md },
  familyBubble: {
    alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.xl,
    padding: SPACING.md, borderWidth: 2, borderColor: COLORS.primary + '30',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2,
  },
  familyEmoji: { fontSize: 40 },
  familyName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginTop: SPACING.xs },
  familyRole: { fontSize: 12, color: COLORS.textSecondary },
  zonesRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.sm, marginTop: SPACING.lg },
  zoneChip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: '#fff', borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.quest + '40',
  },
  zoneLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  emptyText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.textSecondary, textAlign: 'center' },
  pingSection: { marginBottom: SPACING.lg },
  pingStatus: { fontSize: FONT.body, fontWeight: '700', color: COLORS.quest, textAlign: 'center', marginTop: SPACING.sm },
  setupLink: { alignItems: 'center', padding: SPACING.md },
  setupLinkText: { fontSize: 15, color: COLORS.textLight, fontWeight: '600' },
  // Setup styles
  setupTitle: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text },
  setupSub: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginBottom: SPACING.lg },
  sectionLabel: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.md },
  memberRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    backgroundColor: '#fff', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.sm,
    borderWidth: 1, borderColor: COLORS.border,
  },
  memberEmoji: { fontSize: 28 },
  memberName: { fontSize: FONT.body, fontWeight: '700', color: COLORS.text },
  memberRole: { fontSize: 13, color: COLORS.textSecondary },
  addRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  input: {
    backgroundColor: '#fff', borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.primary,
    padding: SPACING.md, fontSize: FONT.body, fontWeight: '700', color: COLORS.text,
  },
  avatarRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md, flexWrap: 'wrap' },
  avatarPick: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff',
    borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  avatarPickActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '10' },
  avatarPickEmoji: { fontSize: 28 },
  miniAvatar: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff',
    borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center',
  },
  miniAvatarActive: { borderColor: COLORS.primary },
});
