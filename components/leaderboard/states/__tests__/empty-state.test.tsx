import React from 'react';
import { render } from '@testing-library/react-native';

import { EmptyState } from '../empty-state';

describe('EmptyState', () => {
  it('renders with default message', () => {
    const { getByText } = render(<EmptyState />);

    expect(getByText('🏆')).toBeTruthy();
    expect(getByText('No users found')).toBeTruthy();
  });

  it('renders provided custom message', () => {
    const { getByText } = render(<EmptyState message="Leaderboard is empty" />);

    expect(getByText('Leaderboard is empty')).toBeTruthy();
  });
});
