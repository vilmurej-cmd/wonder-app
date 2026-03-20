import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONT, SPACING, RADIUS } from '../constants/theme';

interface ParentGateProps {
  visible: boolean;
  onPass: () => void;
  onCancel: () => void;
}

export default function ParentGate({ visible, onPass, onCancel }: ParentGateProps) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const { a, b } = useMemo(() => ({
    a: 10 + Math.floor(Math.random() * 30),
    b: 10 + Math.floor(Math.random() * 30),
  }), [visible]);

  const handleSubmit = () => {
    if (parseInt(answer, 10) === a + b) {
      setAnswer('');
      setError(false);
      onPass();
    } else {
      setError(true);
      setAnswer('');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>Grown-Up Check</Text>
          <Text style={styles.subtitle}>Please solve this to continue:</Text>
          <Text style={styles.problem}>What is {a} + {b}?</Text>

          <TextInput
            style={styles.input}
            value={answer}
            onChangeText={(t) => { setAnswer(t); setError(false); }}
            keyboardType="number-pad"
            placeholder="Type the answer"
            placeholderTextColor={COLORS.textLight}
            maxLength={3}
            autoFocus
          />

          {error && <Text style={styles.error}>Not quite — try again!</Text>}

          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Enter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  title: { fontSize: FONT.lg, fontWeight: '800', color: COLORS.primary, marginBottom: SPACING.xs },
  subtitle: { fontSize: 15, color: COLORS.textSecondary, marginBottom: SPACING.md },
  problem: { fontSize: FONT.xl, fontWeight: '900', color: COLORS.text, marginBottom: SPACING.lg },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SPACING.md,
    fontSize: FONT.lg,
    fontWeight: '700',
    textAlign: 'center',
    width: 160,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  error: { color: COLORS.animals, fontSize: 14, fontWeight: '600', marginBottom: SPACING.sm },
  buttons: { flexDirection: 'row', gap: SPACING.md, marginTop: SPACING.sm },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: RADIUS.md,
    backgroundColor: '#F3F4F6',
  },
  cancelText: { color: COLORS.textSecondary, fontSize: 16, fontWeight: '700' },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
