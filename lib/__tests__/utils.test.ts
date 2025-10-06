import { formatAddress, formatNumber, formatXp, getRankBadgePalette } from '../utils';
import { Layer3Colors } from '@/constants/theme';

describe('formatNumber', () => {
  it('adds thousands separators for large numbers', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('preserves decimal portions', () => {
    expect(formatNumber(98.765)).toBe('98.765');
  });
});

describe('formatXp', () => {
  it('returns raw value below one thousand', () => {
    expect(formatXp(999)).toBe('999');
  });

  it('formats thousands with single decimal precision below ten thousand', () => {
    expect(formatXp(1500)).toBe('1.5k');
  });

  it('rounds thousands to whole numbers at ten thousand or more', () => {
    expect(formatXp(12400)).toBe('12k');
  });

  it('formats millions with single decimal precision', () => {
    expect(formatXp(2500000)).toBe('2.5M');
  });

  it('rounds millions to whole numbers at ten million or more', () => {
    expect(formatXp(12500000)).toBe('13M');
  });
});

describe('formatAddress', () => {
  it('returns the original address when length is short', () => {
    expect(formatAddress('0x1234')).toBe('0x1234');
  });

  it('compacts long addresses with ellipsis', () => {
    expect(formatAddress('0x1234567890abcdef')).toBe('0x1234...cdef');
  });
});

describe('getRankBadgePalette', () => {
  it('returns gold palette for rank 1', () => {
    expect(getRankBadgePalette(1, 'light')).toEqual({
      background: Layer3Colors.highlights.gold,
      text: Layer3Colors.highlights.goldText,
    });
  });

  it('returns silver palette for rank 2', () => {
    expect(getRankBadgePalette(2, 'dark')).toEqual({
      background: Layer3Colors.highlights.silver,
      text: Layer3Colors.highlights.silverText,
    });
  });

  it('returns bronze palette for rank 3', () => {
    expect(getRankBadgePalette(3, 'light')).toEqual({
      background: Layer3Colors.highlights.bronze,
      text: Layer3Colors.highlights.bronzeText,
    });
  });

  it('returns neutral light palette for other ranks in light mode', () => {
    expect(getRankBadgePalette(4, 'light')).toEqual({
      background: Layer3Colors.highlights.neutralLight,
      text: Layer3Colors.highlights.neutralLightText,
    });
  });

  it('returns neutral dark palette for other ranks in dark mode', () => {
    expect(getRankBadgePalette(42, 'dark')).toEqual({
      background: Layer3Colors.highlights.neutralDark,
      text: Layer3Colors.highlights.neutralDarkText,
    });
  });
});
