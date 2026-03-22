import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Purchases from 'react-native-purchases';
import WonderBackground from '../components/WonderBackground';
import BigButton from '../components/BigButton';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

export default function PaywallScreen({ navigation }: any) {
  const [purchasing, setPurchasing] = useState(false);

  const purchase = async () => {
    setPurchasing(true);
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current) {
        await Purchases.purchasePackage(offerings.current.availablePackages[0]);
        Alert.alert('Welcome to WONDER Family!', 'Buddy System is now unlocked! 🎉', [{ text: 'Yay!', onPress: () => navigation.goBack() }]);
      }
    } catch (e: any) {
      if (!e.userCancelled) Alert.alert('Oops', 'Something went wrong. Try again.');
    } finally { setPurchasing(false); }
  };

  const restore = async () => {
    try {
      const info = await Purchases.restorePurchases();
      if (info.entitlements.active['family']) {
        Alert.alert('Restored!', 'WONDER Family is active again!', [{ text: 'Yay!', onPress: () => navigation.goBack() }]);
      } else Alert.alert('Not Found', 'No subscription found.');
    } catch { Alert.alert('Error', 'Could not restore.'); }
  };

  return (
    <WonderBackground>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.closeText}>← Go Back</Text>
          </TouchableOpacity>

          <Text style={styles.emoji}>🛡️</Text>
          <Text style={styles.title}>WONDER Family</Text>
          <Text style={styles.subtitle}>Keep your family connected!</Text>

          <View style={styles.featureCard}>
            <Text style={styles.feature}>✅ Buddy System — See your family on a fun map</Text>
            <Text style={styles.feature}>✅ Animal avatars for every family member</Text>
            <Text style={styles.feature}>✅ Safe zone celebrations</Text>
            <Text style={styles.feature}>✅ "I'm Here!" location pings</Text>
          </View>

          <Text style={styles.price}>$4.99/month</Text>
          <Text style={styles.priceNote}>Cancel anytime</Text>

          {purchasing ? (
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 20 }} />
          ) : (
            <BigButton title="Start Free Trial" emoji="🎉" color={COLORS.primary} onPress={purchase} />
          )}

          <TouchableOpacity onPress={restore} style={styles.restoreBtn}>
            <Text style={styles.restoreText}>Restore Purchases</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </WonderBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  closeBtn: { position: 'absolute', top: 8, left: 8, padding: SPACING.sm },
  closeText: { fontSize: 16, color: COLORS.textSecondary, fontWeight: '600' },
  emoji: { fontSize: 64, marginBottom: SPACING.md },
  title: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.xs },
  subtitle: { fontSize: FONT.body, color: COLORS.textSecondary, marginBottom: SPACING.xl },
  featureCard: {
    backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: SPACING.lg, width: '100%',
    borderWidth: 2, borderColor: COLORS.primary + '30', marginBottom: SPACING.xl, gap: SPACING.sm,
  },
  feature: { fontSize: 16, fontWeight: '600', color: COLORS.text },
  price: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.primary },
  priceNote: { fontSize: 14, color: COLORS.textSecondary, marginBottom: SPACING.lg },
  restoreBtn: { marginTop: SPACING.md, padding: SPACING.sm },
  restoreText: { fontSize: 14, color: COLORS.textLight },
});
