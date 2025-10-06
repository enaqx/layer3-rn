import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { UserDetailScreen } from '@/components/user-detail/user-detail-screen';
import { findUserByAddress } from '@/lib/leaderboard-store';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function UserDetailPage() {
  const { address } = useLocalSearchParams<{ address: string }>();
  const router = useRouter();
  const headerTintColor = useThemeColor({}, 'text');
  const isWeb = Platform.OS === 'web';
  const user = address ? findUserByAddress(address) : null;

  if (!user) {
    return <ThemedText style={styles.error}>User not found</ThemedText>;
  }

  const displayName = user.username || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;
  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: displayName,
          headerBackTitle: 'Back',
          headerLeft: isWeb
            ? () => (
                <Pressable style={styles.headerBackButton} onPress={handleBackPress} hitSlop={12}>
                  <Ionicons name="chevron-back" size={20} color={headerTintColor} />
                  <Text style={[styles.headerBackText, { color: headerTintColor }]}>Back</Text>
                </Pressable>
              )
            : undefined,
          headerTitleAlign: isWeb ? 'center' : undefined,
        }}
      />
      <UserDetailScreen user={user} />
    </>
  );
}

const styles = StyleSheet.create({
  error: {
    flex: 1,
    textAlign: 'center',
    padding: 24,
    fontSize: 16,
  },
  headerBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  headerBackText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
});
