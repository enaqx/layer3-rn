import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as Clipboard from 'expo-clipboard';

import { UserAvatar } from '@/components/user-avatar';
import { Layer3Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { LeaderboardUser } from '@/lib/api/layer3';
import type { OnchainProfile } from '@/lib/api/onchain';

type UserHeaderProps = {
  user: LeaderboardUser;
  onchainProfile?: OnchainProfile;
};

export function UserHeader({ user, onchainProfile }: UserHeaderProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 375;
  const displayName = useMemo(
    () => user.username || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`,
    [user.address, user.username]
  );
  const primaryText = useThemeColor({}, 'text');
  const backgroundColor = useThemeColor(
    { light: Layer3Colors.neutrals.white, dark: Layer3Colors.neutrals.gray475 },
    'background'
  );
  const borderColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray225, dark: Layer3Colors.neutrals.gray425 },
    'background'
  );
  const secondaryText = useThemeColor(
    { light: Layer3Colors.neutrals.gray375, dark: Layer3Colors.neutrals.gray300 },
    'icon'
  );
  const hintTextColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray300, dark: Layer3Colors.neutrals.gray350 },
    'icon'
  );
  const statValueColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray475, dark: Layer3Colors.neutrals.white },
    'text'
  );
  const rippleColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray200, dark: Layer3Colors.neutrals.gray400 },
    'background'
  );

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');

  useEffect(() => {
    if (copyStatus !== 'copied') {
      return;
    }
    const timeout = setTimeout(() => setCopyStatus('idle'), 2000);
    return () => clearTimeout(timeout);
  }, [copyStatus]);

  const handleCopyAddress = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(user.address);
      setCopyStatus('copied');
    } catch (error) {
      console.error('Failed to copy address', error);
    }
  }, [user.address]);

  return (
    <View style={[styles.container, { backgroundColor, borderBottomColor: borderColor }]}>
      <View style={styles.avatarContainer}>
        <UserAvatar
          avatar={user.avatarCid ?? undefined}
          size={isCompact ? 100 : 120}
          rank={user.rank}
          address={user.address}
          username={user.username ?? undefined}
        />
      </View>

      <Text style={[styles.username, isCompact && styles.usernameCompact, { color: primaryText }]}>
        {displayName}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Copy wallet address"
        accessibilityHint="Copies the full address to the clipboard"
        hitSlop={8}
        onPress={handleCopyAddress}
        style={[styles.addressWrapper, isCompact && styles.addressWrapperCompact]}
        android_ripple={Platform.OS === 'android' ? { color: rippleColor } : undefined}
        testID="user-address-pressable"
      >
        <Text
          testID="user-address-text"
          style={[styles.address, isCompact && styles.addressCompact, { color: secondaryText }]}
          numberOfLines={1}
          ellipsizeMode="middle"
          adjustsFontSizeToFit={isCompact}
          minimumFontScale={isCompact ? 0.7 : 1}
        >
          {user.address}
        </Text>
      </Pressable>
      <Text
        accessibilityRole="text"
        accessibilityLiveRegion="polite"
        style={[styles.copyHint, { color: hintTextColor }]}
        testID="user-address-hint"
      >
        {copyStatus === 'copied' ? 'Address copied!' : 'Tap address to copy'}
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statValue,
              isCompact && styles.statValueCompact,
              { color: statValueColor },
            ]}
          >
            #{user.rank}
          </Text>
          <Text
            style={[
              styles.statLabel,
              isCompact && styles.statLabelCompact,
              { color: secondaryText },
            ]}
          >
            Rank
          </Text>
        </View>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statValue,
              isCompact && styles.statValueCompact,
              { color: statValueColor },
            ]}
          >
            {user.xp.toLocaleString()}
          </Text>
          <Text
            style={[
              styles.statLabel,
              isCompact && styles.statLabelCompact,
              { color: secondaryText },
            ]}
          >
            XP
          </Text>
        </View>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statValue,
              isCompact && styles.statValueCompact,
              { color: statValueColor },
            ]}
          >
            {user.level}
          </Text>
          <Text
            style={[
              styles.statLabel,
              isCompact && styles.statLabelCompact,
              { color: secondaryText },
            ]}
          >
            Level
          </Text>
        </View>
        <View style={styles.stat}>
          <Text
            style={[
              styles.statValue,
              isCompact && styles.statValueCompact,
              { color: statValueColor },
            ]}
          >
            {user.gmStreak}
          </Text>
          <Text
            style={[
              styles.statLabel,
              isCompact && styles.statLabelCompact,
              { color: secondaryText },
            ]}
          >
            Streak
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Layer3Colors.neutrals.white,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Layer3Colors.neutrals.gray225,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  address: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  addressWrapper: {
    maxWidth: '85%',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressWrapperCompact: {
    maxWidth: '90%',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  usernameCompact: {
    fontSize: 20,
  },
  addressCompact: {
    fontSize: 12,
  },
  statValueCompact: {
    fontSize: 18,
  },
  statLabelCompact: {
    fontSize: 10,
  },
  copyHint: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
});
