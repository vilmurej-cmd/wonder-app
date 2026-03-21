import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WonderBackground from '../components/WonderBackground';
import WonderCard from '../components/WonderCard';
import ParentGate from '../components/ParentGate';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';
import { TOOLS, SAFETY_TOOLS } from '../constants/tools';

export default function HomeScreen({ navigation }: any) {
  const [childName, setChildName] = useState('');
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childName').then((name) => {
      if (name) setChildName(name);
    });
  }, []);

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.greeting}>
              {childName ? `Hi ${childName}!` : 'Hi there!'} 🌟
            </Text>
            <Text style={styles.subtitle}>What shall we learn today?</Text>
            <TouchableOpacity style={styles.settingsBtn} onPress={() => setShowGate(true)}>
              <Text style={styles.settingsIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {TOOLS.map((tool) => (
              <WonderCard
                key={tool.key}
                color={tool.color}
                onPress={() => navigation.navigate(tool.screen)}
                style={styles.toolCard}
              >
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolTagline}>{tool.tagline}</Text>
              </WonderCard>
            ))}
          </View>

          <View style={styles.safetyHeader}>
            <Text style={styles.safetyTitle}>Stay Safe 🛡️</Text>
            <Text style={styles.safetySubtitle}>Learn to be safe and brave!</Text>
          </View>

          <View style={styles.grid}>
            {SAFETY_TOOLS.map((tool) => (
              <WonderCard
                key={tool.key}
                color={tool.color}
                onPress={() => navigation.navigate(tool.screen)}
                style={styles.toolCard}
              >
                <View style={styles.shieldBadge}>
                  <Text style={styles.shieldBadgeText}>🛡️</Text>
                </View>
                <Text style={styles.toolEmoji}>{tool.emoji}</Text>
                <Text style={styles.toolName}>{tool.name}</Text>
                <Text style={styles.toolTagline}>{tool.tagline}</Text>
                {(tool as any).locked && (
                  <Text style={styles.lockBadge}>🔒</Text>
                )}
              </WonderCard>
            ))}
          </View>

          <Text style={styles.footer}>Made with ❤️ by Vilmure Ventures</Text>
        </ScrollView>

        <ParentGate
          visible={showGate}
          onPass={() => { setShowGate(false); navigation.navigate('Settings'); }}
          onCancel={() => setShowGate(false)}
        />
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  header: { alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.sm },
  greeting: { fontSize: FONT.xxl, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, marginTop: SPACING.xs },
  settingsBtn: { position: 'absolute', right: 0, top: 4, padding: SPACING.xs },
  settingsIcon: { fontSize: 26 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: SPACING.md },
  toolCard: { width: '47%', alignItems: 'center', paddingVertical: SPACING.xl },
  toolEmoji: { fontSize: 44, marginBottom: SPACING.sm },
  toolName: { fontSize: FONT.body, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  toolTagline: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2, textAlign: 'center' },
  safetyHeader: { alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.md },
  safetyTitle: { fontSize: FONT.lg, fontWeight: '900', color: COLORS.text },
  safetySubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 2 },
  shieldBadge: { position: 'absolute', top: 8, right: 8 },
  shieldBadgeText: { fontSize: 14 },
  lockBadge: { fontSize: 12, marginTop: 4 },
  footer: { textAlign: 'center', color: COLORS.textLight, fontSize: 12, marginTop: SPACING.xl },
});
