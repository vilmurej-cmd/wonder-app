import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WonderBackground from '../components/WonderBackground';
import BigButton from '../components/BigButton';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

const AGES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const CONTACT_AVATARS = ['🦁', '🐻', '🐧', '🐰', '🦉', '🐕'];
const RELATIONSHIPS = ['Family', 'Teacher', 'Neighbor', 'Other'];

interface CircleContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  avatar: string;
  isPrimary: boolean;
}

export default function SettingsScreen({ navigation }: any) {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(4);
  const [homeAddress, setHomeAddress] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [codeWord, setCodeWord] = useState('');
  const [contacts, setContacts] = useState<CircleContact[]>([]);
  const [saved, setSaved] = useState(false);
  const [section, setSection] = useState<'main' | 'circle' | 'progress'>('main');
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addRelation, setAddRelation] = useState('Family');
  const [showAdd, setShowAdd] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [checkInHistory, setCheckInHistory] = useState<any[]>([]);
  const [sadAlert, setSadAlert] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childName').then((v) => { if (v) setChildName(v); });
    AsyncStorage.getItem('childAge').then((v) => { if (v) setChildAge(parseInt(v, 10)); });
    AsyncStorage.getItem('wonderAddress').then((v) => { if (v) setHomeAddress(v); });
    AsyncStorage.getItem('wonderParentPhone').then((v) => { if (v) setParentPhone(v); });
    AsyncStorage.getItem('wonderCodeWord').then((v) => { if (v) setCodeWord(v); });
    AsyncStorage.getItem('wonderCircle').then((v) => { if (v) setContacts(JSON.parse(v)); });
    AsyncStorage.getItem('wonderSafetyCompleted').then((v) => { if (v) setCompleted(JSON.parse(v)); });
    AsyncStorage.getItem('wonderHeroBadges').then((v) => { if (v) setBadges(JSON.parse(v)); });
    AsyncStorage.getItem('wonderCheckInHistory').then((v) => { if (v) setCheckInHistory(JSON.parse(v)); });
    AsyncStorage.getItem('wonderSadAlert').then((v) => { if (v === 'true') setSadAlert(true); });
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('childName', childName);
    await AsyncStorage.setItem('childAge', String(childAge));
    await AsyncStorage.setItem('wonderAddress', homeAddress);
    await AsyncStorage.setItem('wonderParentPhone', parentPhone);
    await AsyncStorage.setItem('wonderCodeWord', codeWord);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveContacts = async (updated: CircleContact[]) => {
    setContacts(updated);
    await AsyncStorage.setItem('wonderCircle', JSON.stringify(updated));
  };

  const addContact = () => {
    if (!addName.trim() || !addPhone.trim()) return;
    if (contacts.length >= 6) { Alert.alert('Full', 'Maximum 6 trusted adults.'); return; }
    const c: CircleContact = {
      id: Date.now().toString(),
      name: addName.trim(),
      phone: addPhone.trim(),
      relationship: addRelation,
      avatar: CONTACT_AVATARS[contacts.length] || '💛',
      isPrimary: contacts.length === 0,
    };
    saveContacts([...contacts, c]);
    setAddName('');
    setAddPhone('');
    setShowAdd(false);
  };

  const FEELING_EMOJIS: Record<string, string> = {
    great: '🦁', good: '🐱', hmm: '🐻', notgood: '🐧', needhug: '🐰',
  };

  const recentHistory = checkInHistory.slice(-7);

  if (section === 'circle') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>My Circle Setup</Text>
            <Text style={styles.subtitle}>Trusted adults for your child ({contacts.length}/6)</Text>

            {contacts.map((c) => (
              <View key={c.id} style={styles.contactRow}>
                <Text style={styles.contactAvatar}>{c.avatar}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.contactName}>{c.name} {c.isPrimary ? '⭐' : ''}</Text>
                  <Text style={styles.contactDetail}>{c.relationship} · {c.phone}</Text>
                </View>
                <TouchableOpacity onPress={() => saveContacts(contacts.map((x) => ({ ...x, isPrimary: x.id === c.id })))}>
                  <Text style={{ fontSize: 14, color: COLORS.primary, fontWeight: '600' }}>Primary</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveContacts(contacts.filter((x) => x.id !== c.id))}>
                  <Text style={{ fontSize: 18, color: COLORS.textLight, padding: 4 }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}

            {showAdd ? (
              <View style={styles.addForm}>
                <TextInput style={styles.input} value={addName} onChangeText={setAddName} placeholder="Name" placeholderTextColor={COLORS.textLight} />
                <TextInput style={styles.input} value={addPhone} onChangeText={setAddPhone} placeholder="Phone number" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" />
                <View style={styles.ageRow}>
                  {RELATIONSHIPS.map((r) => (
                    <TouchableOpacity key={r} style={[styles.ageBubble, { width: 'auto', paddingHorizontal: 14, borderRadius: 20 }, addRelation === r && styles.ageSelected]} onPress={() => setAddRelation(r)}>
                      <Text style={[styles.ageText, { fontSize: 14 }, addRelation === r && styles.ageTextSelected]}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <BigButton title="Add" emoji="✅" color={COLORS.quest} onPress={addContact} />
              </View>
            ) : contacts.length < 6 ? (
              <BigButton title="Add Trusted Adult" emoji="➕" color={COLORS.primary} onPress={() => setShowAdd(true)} />
            ) : null}

            <TouchableOpacity onPress={() => setSection('main')} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Settings</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  if (section === 'progress') {
    return (
      <WonderBackground>
        <SafeAreaView style={styles.safe}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Safety Progress</Text>

            {sadAlert && (
              <View style={styles.alertCard}>
                <Text style={styles.alertText}>
                  💛 {childName || 'Your child'} has been feeling sad or scared several times this week. This might be a good time for a gentle check-in.
                </Text>
                <TouchableOpacity onPress={async () => { setSadAlert(false); await AsyncStorage.removeItem('wonderSadAlert'); }}>
                  <Text style={{ color: COLORS.primary, fontWeight: '600', marginTop: 8 }}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.label}>Tell Someone Lessons</Text>
            {['secrets', 'body', 'telling', 'online', 'scary', 'home'].map((l) => (
              <View key={l} style={styles.progressRow}>
                <Text style={styles.progressText}>{l.charAt(0).toUpperCase() + l.slice(1)}</Text>
                <Text style={styles.progressStatus}>{completed.includes(l) ? '⭐ Completed' : '⭕ Not started'}</Text>
              </View>
            ))}

            <Text style={[styles.label, { marginTop: SPACING.lg }]}>Emergency Hero Badges</Text>
            {[{ key: '911_expert', name: '911 Expert' }, { key: 'address_master', name: 'Address Master' }, { key: 'phone_pro', name: 'Phone Number Pro' }].map((b) => (
              <View key={b.key} style={styles.progressRow}>
                <Text style={styles.progressText}>{b.name}</Text>
                <Text style={styles.progressStatus}>{badges.includes(b.key) ? '🏆 Earned' : '⭕ Not yet'}</Text>
              </View>
            ))}

            {recentHistory.length > 0 && (
              <>
                <Text style={[styles.label, { marginTop: SPACING.lg }]}>Recent Check-Ins</Text>
                <View style={styles.checkInRow}>
                  {recentHistory.map((h: any, i: number) => (
                    <View key={i} style={styles.checkInDay}>
                      <Text style={styles.checkInEmoji}>{FEELING_EMOJIS[h.feeling] || '😊'}</Text>
                      <Text style={styles.checkInDate}>{new Date(h.date).toLocaleDateString('en-US', { weekday: 'short' })}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <TouchableOpacity onPress={() => setSection('main')} style={styles.backBtn}>
              <Text style={styles.backText}>← Back to Settings</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </WonderBackground>
    );
  }

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Parent Settings</Text>
          <Text style={styles.subtitle}>For grown-ups only</Text>

          <Text style={styles.sectionHeader}>Child Profile</Text>

          <Text style={styles.label}>Child's Name</Text>
          <TextInput style={styles.input} value={childName} onChangeText={setChildName} placeholder="Enter name" placeholderTextColor={COLORS.textLight} maxLength={20} />

          <Text style={styles.label}>Child's Age</Text>
          <View style={styles.ageRow}>
            {AGES.map((age) => (
              <TouchableOpacity key={age} style={[styles.ageBubble, childAge === age && styles.ageSelected]} onPress={() => setChildAge(age)}>
                <Text style={[styles.ageText, childAge === age && styles.ageTextSelected]}>{age}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Home Address (for Emergency Hero)</Text>
          <TextInput style={styles.input} value={homeAddress} onChangeText={setHomeAddress} placeholder="123 Main St, City, State" placeholderTextColor={COLORS.textLight} />

          <Text style={styles.label}>Parent Phone Number</Text>
          <TextInput style={styles.input} value={parentPhone} onChangeText={setParentPhone} placeholder="(555) 123-4567" placeholderTextColor={COLORS.textLight} keyboardType="phone-pad" />

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Safe Words</Text>
          <Text style={styles.label}>Family Code Word</Text>
          <TextInput style={styles.input} value={codeWord} onChangeText={setCodeWord} placeholder="Set your secret family word" placeholderTextColor={COLORS.textLight} />

          <BigButton title={saved ? 'Saved!' : 'Save All'} emoji={saved ? '✅' : '💾'} color={COLORS.primary} onPress={handleSave} />

          <View style={styles.divider} />

          <Text style={styles.sectionHeader}>Safety Tools</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => setSection('circle')}>
            <Text style={styles.menuText}>💛 My Circle Setup ({contacts.length}/6 contacts)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setSection('progress')}>
            <Text style={styles.menuText}>📊 Safety Progress & Check-Ins</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuText}>Restore Purchases</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('https://wonder-privacy.vercel.app')}>
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.version}>WONDER v2.0.0</Text>
            <Text style={styles.madeBy}>Made with ❤️ by Vilmure Ventures</Text>
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
  container: { padding: SPACING.lg, paddingTop: SPACING.xl, paddingBottom: SPACING.xxl },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginBottom: SPACING.lg },
  sectionHeader: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text, marginTop: SPACING.md, marginBottom: SPACING.xs },
  label: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.xs, marginTop: SPACING.md },
  input: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    fontSize: FONT.body,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  ageRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.lg, flexWrap: 'wrap' },
  ageBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ageText: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text },
  ageTextSelected: { color: '#fff' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.lg },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  menuText: { fontSize: FONT.body, fontWeight: '600', color: COLORS.text },
  footer: { alignItems: 'center', marginTop: SPACING.xl },
  version: { color: COLORS.textLight, fontSize: 12 },
  madeBy: { color: COLORS.textSecondary, fontSize: 14, marginTop: SPACING.xs },
  backBtn: { marginTop: SPACING.xl, alignItems: 'center' },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  contactAvatar: { fontSize: 28 },
  contactName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  contactDetail: { fontSize: 13, color: COLORS.textSecondary },
  addForm: { backgroundColor: '#fff', borderRadius: RADIUS.lg, padding: SPACING.md, marginTop: SPACING.sm, gap: SPACING.sm },
  alertCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.star,
    marginBottom: SPACING.lg,
  },
  alertText: { fontSize: 15, fontWeight: '600', color: COLORS.text, lineHeight: 22 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.xs,
  },
  progressText: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  progressStatus: { fontSize: 14, color: COLORS.textSecondary },
  checkInRow: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm, justifyContent: 'center' },
  checkInDay: { alignItems: 'center' },
  checkInEmoji: { fontSize: 28 },
  checkInDate: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
});
