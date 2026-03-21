import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WonderBackground from '../components/WonderBackground';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

export default function BuddySystemScreen({ navigation }: any) {
  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.emoji}>🛡️</Text>
          <Text style={styles.title}>Buddy System</Text>
          <Text style={styles.description}>
            Buddy System lets your family see each other on a fun, colorful map! You can see where your grown-ups are, and they can see where you are. It's like having a superpower that keeps your family connected!
          </Text>
          <View style={styles.lockBadge}>
            <Text style={styles.lockText}>
              🔒 Coming soon with WONDER Family — $4.99/month
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emoji: { fontSize: 72, marginBottom: SPACING.md },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.md },
  description: {
    fontSize: FONT.body,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.xl,
  },
  lockBadge: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.safeBuddy,
    marginBottom: SPACING.xl,
  },
  lockText: { fontSize: 16, fontWeight: '700', color: COLORS.safeBuddy, textAlign: 'center' },
  backBtn: { padding: SPACING.md },
  backText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '600' },
});
