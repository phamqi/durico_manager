import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useWindowDimensions } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useAddScreenEnterAnimation() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      translateX.value = width / 2 - insets.right;
      translateY.value = height / 2 ;
      scale.value = 0;
      opacity.value = 0;

      translateX.value = withSpring(0, {
        damping: 30,
        stiffness: 160,
        mass: 1.1
      });
      translateY.value = withSpring(0, {
        damping: 40,
        stiffness: 100,
        mass: 1.1
      });
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 100,
        mass: 1.1
      });
      opacity.value = withTiming(1, { duration: 200 });
    }, [width, height, insets])
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return animatedStyle;
}