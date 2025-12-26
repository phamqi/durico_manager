import { useRef, useState } from "react";
import { Dimensions } from "react-native";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");
const MAX_RADIUS = Math.sqrt(
  SCREEN_WIDTH * SCREEN_WIDTH + SCREEN_HEIGHT * SCREEN_HEIGHT
);

export function useAnchoredModalReanimated() {
  const anchorRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const origin = useRef({ x: 0, y: 0 });
  const backdropScale = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const open = () => {
    anchorRef.current?.measureInWindow((x, y, w, h) => {
      const ox = x + w / 2;
      const oy = y + h / 2;
      origin.current = { x: ox, y: oy };

      translateX.value = ox - SCREEN_WIDTH / 2;
      translateY.value = oy - SCREEN_HEIGHT / 2;
      scale.value = 0.1;
      opacity.value = 0.7;

      setVisible(true);

      translateX.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 1.1
      });
      translateY.value = withSpring(0, {
        damping: 20,
        stiffness: 200,
        mass: 1.1
      });
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 200,
        mass: 1.1
      });
      opacity.value = withTiming(1, { duration: 220 });
      backdropOpacity.value = withTiming(1, { duration: 220 });
      backdropScale.value = withSpring(1, {
      damping: 26,
      stiffness: 50,
      mass: 1.1
    });


    });
  };

  const close = () => {
  const { x, y } = origin.current;

  translateX.value = withSpring(x - SCREEN_WIDTH / 2, {
    damping: 20,
    stiffness: 200,
    mass: 0.9
  });

  translateY.value = withSpring(y - SCREEN_HEIGHT / 2, {
    damping: 20,
    stiffness: 200,
    mass: 0.9
  });

  scale.value = withSpring( 0.1 , {
    damping: 20,
    stiffness: 200,
    mass: 0.9
  });

  opacity.value = withTiming(0, { duration: 200 }, () => {
    runOnJS(setVisible)(false);
  });
  backdropOpacity.value = withTiming(0, { duration: 290 });
  backdropScale.value = withTiming(0, { duration: 300 });
};
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
    transform: [{ scale: backdropScale.value }],
  }));
  return {
    anchorRef,
    visible,
    open,
    close,
    animatedStyle,
    backdropStyle,
    MAX_RADIUS, 
    SCREEN_WIDTH,
    SCREEN_HEIGHT
  };
}