import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { OctagonBadge } from '@/components/octagon-badge';
import { UserAvatar } from '@/components/user-avatar';
import { LeaderboardUser } from '@/lib/api/layer3';
import { formatNumber, formatXp, formatAddress, getRankBadgePalette } from '@/lib/utils';
import { Layer3Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';

type UserListItemProps = {
  user: LeaderboardUser;
  rank: number;
  onPress: () => void;
};

export function UserListItem({ user, rank, onPress }: UserListItemProps) {
  const { width } = useWindowDimensions();
  const isCompact = width < 375;
  const displayName = user.username || `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;
  const primaryTextColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor(
    { light: Layer3Colors.neutrals.gray325, dark: Layer3Colors.neutrals.gray300 },
    'icon'
  );
  const cardBackground = useThemeColor(
    { light: Layer3Colors.neutrals.gray50, dark: Layer3Colors.neutrals.gray475 },
    'background'
  );
  const pressedBackground = useThemeColor(
    { light: Layer3Colors.neutrals.gray150, dark: Layer3Colors.neutrals.gray450 },
    'background'
  );
  const cardBorder = useThemeColor(
    { light: Layer3Colors.neutrals.gray200, dark: Layer3Colors.neutrals.gray425 },
    'background'
  );
  const colorScheme = useColorScheme();

  const rankBadgePalette = useMemo(
    () => getRankBadgePalette(rank, colorScheme),
    [rank, colorScheme]
  );

  const subtitle = useMemo(() => formatAddress(user.address), [user.address]);
  const shouldShowSubtitle = subtitle !== displayName;

  const xpDisplay = useMemo(() => formatXp(user.xp), [user.xp]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: pressed ? pressedBackground : cardBackground,
          borderColor: cardBorder,
        },
      ]}
    >
      <View style={[styles.rankBadge, { backgroundColor: rankBadgePalette.background }]}>
        <Text style={[styles.rankText, { color: rankBadgePalette.text }]}>{rank}</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <UserAvatar
          avatar={user.avatarCid ?? undefined}
          size={isCompact ? 48 : 56}
          rank={rank}
          address={user.address}
          username={user.username ?? undefined}
          level={user.level}
        />
      </View>

      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text
            style={[
              styles.username,
              isCompact && styles.usernameCompact,
              { color: primaryTextColor },
            ]}
            numberOfLines={1}
          >
            {displayName}
          </Text>
        </View>
        {shouldShowSubtitle && (
          <Text
            style={[
              styles.subtitle,
              isCompact && styles.subtitleCompact,
              { color: secondaryTextColor },
            ]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Ionicons
            name="flame"
            size={18}
            color={Layer3Colors.accent.flame}
            style={styles.statIcon}
          />
          <Text style={[styles.statValue, { color: primaryTextColor }]}>
            {formatNumber(user.gmStreak)}
          </Text>
        </View>
        <View style={[styles.statRow, styles.xpRow]}>
          <OctagonBadge
            text="XP"
            fontSize={6}
            backgroundColor={Layer3Colors.accent.xpGreen}
            strokeColor={Layer3Colors.accent.xpGreen}
            textColor={Layer3Colors.white}
          />
          <Text style={[styles.statValue, { color: primaryTextColor }]}>{xpDisplay}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    shadowColor: Layer3Colors.black,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
  },
  avatarWrapper: {
    marginRight: 14,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  username: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  usernameCompact: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 0.6,
  },
  subtitleCompact: {
    fontSize: 11,
  },
  stats: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: 8,
    marginLeft: 12,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
  },
  statIcon: {
    marginRight: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
  },
  xpRow: {
    gap: 4,
  },
  xpValue: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    color: Layer3Colors.accent.xpGreen,
  },
});
