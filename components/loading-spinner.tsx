import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { Layer3Colors } from '@/constants/theme';

type LoadingSpinnerProps = {
  message?: string;
};

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Layer3Colors.brandTeal} />
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
  message: {
    marginTop: 16,
    fontSize: 16,
    color: Layer3Colors.neutrals.gray375,
  },
});
