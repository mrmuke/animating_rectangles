import React, { useEffect } from 'react';
import { Svg, Rect } from 'react-native-svg';
import Animated, { useSharedValue, useAnimatedProps, withTiming, interpolate } from 'react-native-reanimated';
import { View } from 'react-native';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const SVG_CONTAINER_WIDTH = 300
const SVG_CONTAINER_HEIGHT = 300

const ESTIMATE_BAND_MIN_MAGNITUDE = 0
const ESTIMATE_BAND_MAX_MAGNITUDE = 750 // Arbitrary estimate that seems to work for both platforms
const MIN_BAR_HEIGHT = 75;
const MAX_BAR_HEIGHT = 175;

const BAND_ANIMATION_DURATION = 150

const BAND_WIDTH = 60
const BAND_SEPERATION = 12

export default function App() {
  // Shared values for animation
  const animatedBandHeights = [0, 0, 0, 0].map(() => useSharedValue(MIN_BAR_HEIGHT));

  useEffect(() => {
    // Fake listener that generates random frequency bands
    const fakeFrequencyDataSubscription = setInterval(() => {
      const freqBands = Array.from({ length: 4 }, () =>
        Math.random() * (ESTIMATE_BAND_MAX_MAGNITUDE - ESTIMATE_BAND_MIN_MAGNITUDE) + ESTIMATE_BAND_MIN_MAGNITUDE
      );

      freqBands.forEach((band, index) => {
        const newHeight = interpolate(
          band,
          [ESTIMATE_BAND_MIN_MAGNITUDE, ESTIMATE_BAND_MAX_MAGNITUDE],
          [MIN_BAR_HEIGHT, MAX_BAR_HEIGHT],
        );

        animatedBandHeights[index].value = withTiming(newHeight, { duration: BAND_ANIMATION_DURATION });
      });
    }, 30); // make the updates occur faster than withTiming

    return () => {
      clearInterval(fakeFrequencyDataSubscription);
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Svg height={SVG_CONTAINER_HEIGHT} width={SVG_CONTAINER_WIDTH}>
        {animatedBandHeights.map((h, index) => {
          const animatedProps = useAnimatedProps(() => ({
            y: (SVG_CONTAINER_HEIGHT - h.value) / 2,
            height: h.value,
          }));

          return (
            <AnimatedRect
              key={index}
              x={index * (BAND_WIDTH + BAND_SEPERATION) + BAND_SEPERATION}
              width={BAND_WIDTH}
              ry={BAND_WIDTH / 2}
              fill={"black"}
              animatedProps={animatedProps}
            />
          );
        })}
      </Svg>
    </View>
  );
};
