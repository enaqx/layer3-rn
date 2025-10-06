import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BalanceSection } from '@/components/user-detail/balance-section';
import { TransactionsSection } from '@/components/user-detail/transactions-section';
import { UserHeader } from '@/components/user-detail/user-header';
import { ErrorState } from '@/components/leaderboard/states/error-state';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Layer3Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useOnchainProfile } from '@/hooks/use-onchain-profile';
import type { LeaderboardUser } from '@/lib/api/layer3';

type UserDetailScreenProps = {
  user: LeaderboardUser;
};

export function UserDetailScreen({ user }: UserDetailScreenProps) {
  const { profile, isLoading, error, refetch } = useOnchainProfile(user.address);
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray75, dark: Layer3Colors.neutrals.gray500 },
    'background'
  );
  const warningBackground =
    colorScheme === 'dark'
      ? Layer3Colors.warning.backgroundDark
      : Layer3Colors.warning.backgroundLight;
  const warningTextColor =
    colorScheme === 'dark' ? Layer3Colors.warning.textDark : Layer3Colors.warning.textLight;

  const refreshControlTintColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray400, dark: Layer3Colors.neutrals.gray300 },
    'icon'
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refetch}
          tintColor={refreshControlTintColor}
          colors={[Layer3Colors.brandTeal]}
        />
      }
    >
      <UserHeader user={user} onchainProfile={profile} />

      {isLoading && <LoadingSpinner message="Loading on-chain data..." />}

      {error && !profile && (
        <View style={styles.errorContainer}>
          <ErrorState error={error} onRetry={refetch} />
        </View>
      )}

      {profile && (
        <>
          <BalanceSection profile={profile} />
          <TransactionsSection profile={profile} />
        </>
      )}

      {error && profile && (
        <View style={[styles.warningContainer, { backgroundColor: warningBackground }]}>
          <Text style={[styles.warningText, { color: warningTextColor }]}>
            ⚠️ Using cached data
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  errorContainer: {
    flex: 1,
    minHeight: 300,
  },
  warningContainer: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
