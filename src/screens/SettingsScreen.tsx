import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WonderBackground from '../components/WonderBackground';
import BigButton from '../components/BigButton';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

const AGES = [2, 3, 4, 5, 6, 7, 8];

export default function SettingsScreen({ navigation }: any) {
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(4);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childName').then((v) => { if (v) setChildName(v); });
    AsyncStorage.getItem('childAge').then((v) => { if (v) setChildAge(parseInt(v, 10)); });
  }, []);

  const handleSave = async () => {
    await AsyncStorage.setItem('childName', childName);
    await AsyncStorage.setItem('childAge', String(childAge));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>For grown-ups only</Text>

          <Text style={styles.label}>Child's Name</Text>
          <TextInput
            style={styles.input}
            value={childName}
            onChangeText={setChildName}
            placeholder="Enter name"
            placeholderTextColor={COLORS.textLight}
            maxLength={20}
          />

          <Text style={styles.label}>Child's Age</Text>
          <View style={styles.ageRow}>
            {AGES.map((age) => (
              <TouchableOpacity
                key={age}
                style={[styles.ageBubble, childAge === age && styles.ageSelected]}
                onPress={() => setChildAge(age)}
              >
                <Text style={[styles.ageText, childAge === age && styles.ageTextSelected]}>{age}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <BigButton title={saved ? 'Saved!' : 'Save'} emoji={saved ? '✅' : '💾'} color={COLORS.primary} onPress={handleSave} />

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Text style={styles.menuText}>Restore Purchases</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => Linking.openURL('https://wonder-privacy.vercel.app')}>
            <Text style={styles.menuText}>Privacy Policy</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.version}>WONDER v1.0.0</Text>
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
  subtitle: { fontSize: 14, color: COLORS.primary, fontWeight: '700', marginBottom: SPACING.xl },
  label: { fontSize: FONT.body, fontWeight: '700', color: COLORS.text, marginBottom: SPACING.sm, marginTop: SPACING.md },
  input: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    fontSize: FONT.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  ageRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl, flexWrap: 'wrap' },
  ageBubble: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  ageText: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.text },
  ageTextSelected: { color: '#fff' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.xl },
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
});
