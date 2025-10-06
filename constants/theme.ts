/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1a4182';
const tintColorDark = '#1a4182';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#101114',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

const Neutrals = {
  white: '#FFFFFF',
  black: '#000000',
  gray25: '#F9F9F9',
  gray50: '#F7F8FB',
  gray75: '#F5F5F5',
  gray100: '#F4F3F4',
  gray150: '#ECEFF5',
  gray175: '#E6E9F0',
  gray200: '#E2E8F0',
  gray225: '#E0E0E0',
  gray250: '#C6C6CF',
  gray275: '#B2C6DC',
  gray300: '#9BA1A6',
  gray325: '#7E8794',
  gray350: '#687076',
  gray375: '#666666',
  gray400: '#333333',
  gray425: '#1F1F24',
  gray450: '#1C1C22',
  gray475: '#15151A',
  gray500: '#101114',
  gray525: '#11181C',
  amber200: '#FFE082',
};

const Surfaces = {
  lightDefault: Neutrals.white,
  darkDefault: Neutrals.gray475,
  lightMuted: Neutrals.gray75,
  darkMuted: Neutrals.gray425,
  lightCard: Neutrals.gray25,
  darkCard: Neutrals.gray450,
};

const Accent = {
  flame: '#FF8A3C',
  xpGreen: '#1DD251',
};

const Highlights = {
  gold: '#FFD166',
  goldText: '#3D2B00',
  silver: '#B2C6DC',
  silverText: '#3F4C61',
  bronze: '#F4CBA6',
  bronzeText: '#4B2C16',
  neutralLight: '#E6E9F0',
  neutralLightText: '#1A1E26',
  neutralDark: '#1F1F24',
  neutralDarkText: Neutrals.white,
};

const Warning = {
  backgroundLight: '#FFF9C4',
  backgroundDark: 'rgba(255, 214, 102, 0.15)',
  textLight: Neutrals.gray375,
  textDark: Neutrals.amber200,
};

const Alpha = {
  white90: 'rgba(255, 255, 255, 0.9)',
  white50: 'rgba(255, 255, 255, 0.5)',
  teal18: 'rgba(48, 184, 149, 0.18)',
  warningOverlay: 'rgba(255, 214, 102, 0.15)',
};

const Gradients = {
  avatarPresets: [
    ['#667EEA', '#764BA2'],
    ['#F093FB', '#F5576C'],
    ['#4FACFE', '#00F2FE'],
    ['#43E97B', '#38F9D7'],
    ['#FA709A', '#FEE140'],
    ['#30CFD0', '#330867'],
    ['#A8EDEA', '#FED6E3'],
    ['#FF9A9E', '#FECFEF'],
    ['#FFECD2', '#FCB69F'],
    ['#FF6E7F', '#BFE9FF'],
  ] as const,
};

export const Layer3Colors = {
  // Primary Brand Colors
  brandTeal: '#30B895', // Main brand color
  brandTealLight: '#23EDA3', // Lighter teal for gradients
  brandPurple: '#895BF3', // Secondary accent color

  // Background Colors
  backgroundPrimary: Neutrals.gray500,
  backgroundSecondary: Neutrals.gray475,

  // Content Colors
  contentPrimary: Neutrals.white,
  contentSecondary: Alpha.white90,
  contentTertiary: Alpha.white50,

  // Utility Colors
  white: Neutrals.white,
  black: Neutrals.black,

  // Gradient Colors
  gradientTeal: '#23EDA3',
  gradientPurple: '#895BF3',
  neutrals: Neutrals,
  surfaces: Surfaces,
  accent: Accent,
  highlights: Highlights,
  warning: Warning,
  alpha: Alpha,
  gradients: Gradients,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
