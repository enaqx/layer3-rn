import { StyleSheet, Text, View } from 'react-native';

import { Layer3Colors } from '@/constants/theme';

type EmptyStateProps = {
  message?: string;
};

export function EmptyState({ message = 'No users found' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🏆</Text>
      <Text style={styles.message}>{message}</Text>
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
  message: {
    fontSize: 18,
    color: Layer3Colors.neutrals.gray375,
    textAlign: 'center',
  },
});
