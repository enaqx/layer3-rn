import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { Layer3Colors } from '@/constants/theme';

const OCTAGON_POINTS = '29.3,0 70.7,0 100,29.3 100,70.7 70.7,100 29.3,100 0,70.7 0,29.3';

type OctagonBadgeProps = {
  text: string;
  size?: number;
  backgroundColor?: string;
  strokeColor?: string;
  textColor?: string;
  fontSize?: number;
  strokeWidth?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function OctagonBadge({
  text,
  size = 16,
  backgroundColor = Layer3Colors.alpha.teal18,
  strokeColor = Layer3Colors.brandTeal,
  textColor = Layer3Colors.brandTeal,
  fontSize = 9,
  strokeWidth = 2,
  style,
  textStyle,
}: OctagonBadgeProps) {
  const horizontalShift = size * 0.05;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg viewBox="0 0 100 100" style={styles.svg} pointerEvents="none">
        <Polygon
          points={OCTAGON_POINTS}
          fill={backgroundColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </Svg>
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize,
            transform: [{ translateX: +horizontalShift }],
          },
          textStyle,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
