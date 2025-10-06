import React from 'react';
import { render } from '@testing-library/react-native';

import HomeScreen from '../index';
import { LeaderboardScreen } from '@/components/leaderboard/leaderboard-screen';

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('@/components/leaderboard/leaderboard-screen', () => ({
  LeaderboardScreen: jest.fn(() => {
    const React = require('react');
    const { Text } = require('react-native');
    return <Text>Leaderboard content</Text>;
  }),
}));
/* eslint-enable @typescript-eslint/no-require-imports */

describe('HomeScreen', () => {
  it('renders the leaderboard screen', () => {
    const { getByText } = render(<HomeScreen />);

    expect(getByText('Leaderboard content')).toBeTruthy();
    expect(LeaderboardScreen).toHaveBeenCalledTimes(1);
  });
});
