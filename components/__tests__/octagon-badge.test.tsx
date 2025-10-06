import React from 'react';
import { StyleSheet } from 'react-native';
import { render } from '@testing-library/react-native';

import { OctagonBadge } from '../octagon-badge';
import { Layer3Colors } from '@/constants/theme';

/* eslint-disable @typescript-eslint/no-require-imports */
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ children, ...props }: any) => (
      <View testID="svg-root" {...props}>
        {children}
      </View>
    ),
    Polygon: (props: any) => <View testID="svg-polygon" {...props} />,
  };
});
/* eslint-enable @typescript-eslint/no-require-imports */

describe('OctagonBadge', () => {
  it('renders defaults with expected svg attributes and styles', () => {
    const { getByTestId, getByText } = render(<OctagonBadge text="GM" />);

    const polygon = getByTestId('svg-polygon');
    expect(polygon.props.points).toBe(
      '29.3,0 70.7,0 100,29.3 100,70.7 70.7,100 29.3,100 0,70.7 0,29.3'
    );
    expect(polygon.props.fill).toBe(Layer3Colors.alpha.teal18);
    expect(polygon.props.stroke).toBe(Layer3Colors.brandTeal);
    expect(polygon.props.strokeWidth).toBe(2);

    const text = getByText('GM');
    const flattened = StyleSheet.flatten(text.props.style);
    expect(flattened.color).toBe(Layer3Colors.brandTeal);
    expect(flattened.fontSize).toBe(9);
    expect(flattened.transform?.[0]?.translateX).toBeCloseTo(0.8);
  });

  it('accepts custom styling props and calculates translate shift from size', () => {
    const customProps = {
      text: 'XP',
      size: 40,
      backgroundColor: '#222',
      strokeColor: '#111',
      textColor: '#eee',
      fontSize: 14,
      strokeWidth: 5,
    } as const;

    const { getByTestId, getByText } = render(<OctagonBadge {...customProps} />);

    const polygon = getByTestId('svg-polygon');
    expect(polygon.props.fill).toBe(customProps.backgroundColor);
    expect(polygon.props.stroke).toBe(customProps.strokeColor);
    expect(polygon.props.strokeWidth).toBe(customProps.strokeWidth);

    const text = getByText('XP');
    const flattened = StyleSheet.flatten(text.props.style);
    expect(flattened.color).toBe(customProps.textColor);
    expect(flattened.fontSize).toBe(customProps.fontSize);
    expect(flattened.transform?.[0]?.translateX).toBeCloseTo(customProps.size * 0.05);
  });
});
