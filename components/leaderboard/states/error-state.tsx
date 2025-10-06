import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layer3Colors } from '@/constants/theme';

type ErrorStateProps = {
  error: Error;
  onRetry: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{error.message}</Text>
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Layer3Colors.neutrals.gray400,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Layer3Colors.neutrals.gray375,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: Layer3Colors.brandTeal,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Layer3Colors.white,
  },
});
