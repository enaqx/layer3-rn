import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import {
  FlatList,
  type ListRenderItem,
  RefreshControl,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState } from '@/components/leaderboard/states/empty-state';
import { ErrorState } from '@/components/leaderboard/states/error-state';
import { LoadingSpinner } from '@/components/loading-spinner';
import { UserListItem } from '@/components/leaderboard/user-list-item';
import { Layer3Colors } from '@/constants/theme';
import { useColorScheme, useColorSchemeController } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import type { LeaderboardUser } from '@/lib/api/layer3';

export function LeaderboardScreen() {
  const { users, isLoading, isRefreshing, error, refresh } = useLeaderboard();
  const router = useRouter();
  const { toggleColorScheme } = useColorSchemeController();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const backgroundColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray75, dark: Layer3Colors.neutrals.gray500 },
    'background'
  );
  const accentColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray350, dark: Layer3Colors.neutrals.gray300 },
    'icon'
  );
  const textColor = useThemeColor({}, 'text');

  const handleUserPress = useCallback(
    (user: LeaderboardUser) => {
      router.push(`/user/${user.address}` as any);
    },
    [router]
  );

  const renderItem: ListRenderItem<LeaderboardUser> = useCallback(
    ({ item }) => (
      <UserListItem user={item} rank={item.rank} onPress={() => handleUserPress(item)} />
    ),
    [handleUserPress]
  );

  const keyExtractor = useCallback((item: LeaderboardUser) => item.address, []);

  const listHeader = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: textColor }]}>Top Users</Text>
        <View style={styles.toggleRow}>
          <Feather
            name={isDarkMode ? 'moon' : 'sun'}
            size={20}
            color={accentColor}
            accessibilityLabel={isDarkMode ? 'Dark mode enabled' : 'Light mode enabled'}
            accessibilityHint="Toggle to switch appearance mode"
          />
          <Switch
            value={isDarkMode}
            onValueChange={toggleColorScheme}
            trackColor={{
              false: Layer3Colors.neutrals.gray250,
              true: Layer3Colors.brandTeal,
            }}
            thumbColor={isDarkMode ? Layer3Colors.neutrals.white : Layer3Colors.neutrals.gray100}
            ios_backgroundColor={Layer3Colors.neutrals.gray250}
          />
        </View>
      </View>
    ),
    [accentColor, isDarkMode, textColor, toggleColorScheme]
  );

  if (isLoading && users.length === 0) {
    return <LoadingSpinner message="Loading leaderboard..." />;
  }

  if (error && users.length === 0) {
    return <ErrorState error={error} onRetry={refresh} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={[
          styles.listContent,
          users.length === 0 ? styles.emptyContainer : undefined,
        ]}
        ListHeaderComponent={listHeader}
        ListHeaderComponentStyle={styles.headerContainer}
        ListEmptyComponent={<EmptyState message="No users on the leaderboard yet" />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refresh}
            tintColor={Layer3Colors.brandTeal}
            colors={[Layer3Colors.brandTeal]}
            progressBackgroundColor={
              isDarkMode ? Layer3Colors.neutrals.gray425 : Layer3Colors.neutrals.white
            }
          />
        }
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 2,
    paddingBottom: 32,
    paddingHorizontal: 16,
    gap: 2,
  },
  emptyContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 12,
    paddingBottom: 6,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});
