import React from 'react';
import { ActivityIndicator } from 'react-native';
import { render } from '@testing-library/react-native';

import { LoadingSpinner } from '../loading-spinner';
import { Layer3Colors } from '@/constants/theme';

describe('LoadingSpinner', () => {
  it('renders default message and indicator styling', () => {
    const { getByText, UNSAFE_getByType } = render(<LoadingSpinner />);

    expect(getByText('Loading...')).toBeTruthy();

    const indicator = UNSAFE_getByType(ActivityIndicator);
    expect(indicator.props.size).toBe('large');
    expect(indicator.props.color).toBe(Layer3Colors.brandTeal);
  });

  it('renders custom message when provided', () => {
    const customMessage = 'Fetching on-chain data';
    const { getByText } = render(<LoadingSpinner message={customMessage} />);

    expect(getByText(customMessage)).toBeTruthy();
  });
});
