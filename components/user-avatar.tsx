import { Image } from 'expo-image';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';

import { OctagonBadge } from '@/components/octagon-badge';
import { buildAvatarUrl } from '@/lib/ipfs';
import { Layer3Colors } from '@/constants/theme';

type UserAvatarProps = {
  avatar?: string;
  size?: number;
  rank?: number;
  address?: string;
  username?: string;
  level?: number;
};

export function UserAvatar({
  avatar,
  size = 56,
  rank: _rank,
  address,
  username,
  level,
}: UserAvatarProps) {
  const avatarUrl = avatar ? buildAvatarUrl(avatar) : null;
  const [imageError, setImageError] = useState(false);

  // Generate placeholder initials and colors based on address
  const placeholderData = getPlaceholderData(address, username);

  // Show placeholder if no avatar URL or if image failed to load
  const showPlaceholder = !avatarUrl || imageError;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {showPlaceholder ? (
        <LinearGradient
          colors={placeholderData.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        >
          <View style={styles.initialsContainer}>
            <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
              {placeholderData.initials}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={{ position: 'relative' }}>
          <LinearGradient
            colors={placeholderData.colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.image,
              { width: size, height: size, borderRadius: size / 2, position: 'absolute' },
            ]}
          >
            <View style={styles.initialsContainer}>
              <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
                {placeholderData.initials}
              </Text>
            </View>
          </LinearGradient>
          <Image
            source={{ uri: avatarUrl! }}
            style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
            contentFit="cover"
            transition={200}
            onError={() => setImageError(true)}
          />
        </View>
      )}
      {typeof level === 'number' && (
        <View style={[styles.levelBadgeContainer, { bottom: -8, right: -8 }]}>
          <OctagonBadge
            text={level.toString()}
            size={Math.min(24, size * 0.4)}
            backgroundColor={Layer3Colors.accent.xpGreen}
            strokeColor={Layer3Colors.accent.xpGreen}
            textColor={Layer3Colors.white}
            fontSize={Math.min(11, size * 0.18)}
            strokeWidth={0}
          />
        </View>
      )}
    </View>
  );
}

// Generate consistent placeholder data based on address
function getPlaceholderData(address?: string, username?: string) {
  const gradients = Layer3Colors.gradients.avatarPresets;

  // Use address to deterministically select a gradient
  const hash = address ? address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  const colors = gradients[hash % gradients.length];

  // Generate initials
  let initials = '??';
  if (username) {
    const parts = username.trim().split(/\s+/);
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else {
      initials = username.slice(0, 2).toUpperCase();
    }
  } else if (address) {
    initials = address.slice(2, 4).toUpperCase();
  }

  return { colors, initials };
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: Layer3Colors.neutrals.gray175,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: Layer3Colors.white,
    fontWeight: '700',
    textAlign: 'center',
  },
  levelBadgeContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
});
