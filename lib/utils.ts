import { Layer3Colors } from '@/constants/theme';

/**
 * Format a number with locale-specific formatting (e.g., 1,000)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format XP values with k/M suffixes for compact display
 */
export function formatXp(value: number): string {
  if (value >= 1_000_000) {
    const formatted = value / 1_000_000;
    return `${formatted >= 10 ? Math.round(formatted) : formatted.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const formatted = value / 1_000;
    return `${formatted >= 10 ? Math.round(formatted) : formatted.toFixed(1)}k`;
  }
  return value.toString();
}

/**
 * Format Ethereum address for compact display (0x1234...5678)
 */
export function formatAddress(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Get background and text colors for rank badges based on position and theme
 */
export function getRankBadgePalette(
  rank: number,
  colorScheme: 'light' | 'dark'
): {
  background: string;
  text: string;
} {
  switch (rank) {
    case 1:
      return {
        background: Layer3Colors.highlights.gold,
        text: Layer3Colors.highlights.goldText,
      };
    case 2:
      return {
        background: Layer3Colors.highlights.silver,
        text: Layer3Colors.highlights.silverText,
      };
    case 3:
      return {
        background: Layer3Colors.highlights.bronze,
        text: Layer3Colors.highlights.bronzeText,
      };
    default:
      return colorScheme === 'dark'
        ? {
            background: Layer3Colors.highlights.neutralDark,
            text: Layer3Colors.highlights.neutralDarkText,
          }
        : {
            background: Layer3Colors.highlights.neutralLight,
            text: Layer3Colors.highlights.neutralLightText,
          };
  }
}
