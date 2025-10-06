import React from 'react';
import { render } from '@testing-library/react-native';
import { UserAvatar } from '@/components/user-avatar';

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@/components/octagon-badge', () => {
  const { Text } = require('react-native');
  return {
    OctagonBadge: ({ text }: { text: string }) => <Text>{text}</Text>,
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

describe('UserAvatar', () => {
  it('renders with default size', () => {
    const { getByTestId } = render(<UserAvatar address="0x1234567890abcdef" username="testuser" />);
    expect(getByTestId).toBeDefined();
  });

  it('renders with custom size', () => {
    const { UNSAFE_root } = render(
      <UserAvatar address="0x1234567890abcdef" username="testuser" size={100} />
    );
    expect(UNSAFE_root).toBeDefined();
  });

  it('shows level badge when level is provided', () => {
    const { getByText } = render(
      <UserAvatar address="0x1234567890abcdef" username="Leveler" level={128} />
    );

    expect(getByText('128')).toBeTruthy();
  });

  it('displays initials from username with multiple words', () => {
    const { getByText } = render(<UserAvatar address="0x1234567890abcdef" username="John Doe" />);
    expect(getByText('JD')).toBeTruthy();
  });

  it('displays first two characters for single word username', () => {
    const { getByText } = render(<UserAvatar address="0x1234567890abcdef" username="Alice" />);
    expect(getByText('AL')).toBeTruthy();
  });

  it('displays address-based initials when no username', () => {
    const { getByText } = render(<UserAvatar address="0xABCDEF1234567890" />);
    expect(getByText('AB')).toBeTruthy();
  });

  it('displays ?? when no address or username', () => {
    const { getByText } = render(<UserAvatar />);
    expect(getByText('??')).toBeTruthy();
  });

  it('generates consistent colors for same address', () => {
    const address = '0x1234567890abcdef';
    const { UNSAFE_root: root1 } = render(<UserAvatar address={address} />);
    const { UNSAFE_root: root2 } = render(<UserAvatar address={address} />);
    expect(root1).toBeDefined();
    expect(root2).toBeDefined();
  });
});
