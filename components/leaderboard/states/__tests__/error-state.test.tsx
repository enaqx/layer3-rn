import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { ErrorState } from '../error-state';

describe('ErrorState', () => {
  it('displays error info and retry button', () => {
    const error = new Error('Network unavailable');
    const { getByText } = render(<ErrorState error={error} onRetry={jest.fn()} />);

    expect(getByText('⚠️')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Network unavailable')).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('invokes onRetry when button pressed', () => {
    const error = new Error('Timed out');
    const onRetry = jest.fn();
    const { getByText } = render(<ErrorState error={error} onRetry={onRetry} />);

    fireEvent.press(getByText('Try Again'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
