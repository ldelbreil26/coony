import React, { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing 
} from 'react-native-reanimated';
import COLORS from '../utils/Colors';

export default function FondOndes() {
  const { width, height } = useWindowDimensions();
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-width, { 
        duration: 25000, 
        easing: Easing.linear 
      }),
      -1,
      false
    );
  }, [width]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // TRACÉ BAS : L'onde est en haut du rectangle, le plein est en bas
  const pathBas = `M0 50 Q${width / 4} 0 ${width / 2} 50 T${width} 50 T${width * 1.5} 50 T${width * 2} 50 L${width * 2} 150 L0 150 Z`;

  // TRACÉ HAUT : L'onde est en bas du rectangle, le plein est en haut (Inversion manuelle)
  const pathHaut = `M0 0 L${width * 2} 0 L${width * 2} 50 Q${width * 1.75} 100 ${width * 1.5} 50 T${width} 50 T${width / 2} 50 T0 50 Z`;

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.background, zIndex: -1 }]}>
      
      {/* --- ONDE DU HAUT --- */}
      <View style={styles.topContainer}>
        <Animated.View style={[styles.waveWrapper, animatedStyle]}>
          <Svg width={width * 2} height={100}>
            <Path d={pathHaut} fill={COLORS.primary} opacity={0.12} />
          </Svg>
        </Animated.View>
      </View>

      {/* --- ONDE DU BAS --- */}
      <View style={styles.bottomContainer}>
        <Animated.View style={[styles.waveWrapper, animatedStyle]}>
          <Svg width={width * 2} height={100}>
            <Path d={pathBas} fill={COLORS.primary} opacity={0.12} />
          </Svg>
        </Animated.View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    overflow: 'hidden',
  },
  waveWrapper: {
    position: 'absolute',
    width: '200%',
  },
});