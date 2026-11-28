import { DEFAULT_WORKER_COLOR } from "@/constants";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useWorkerStore } from "../context";

export default function ColorPaletteBar({ addColorModal }) {
  const colorArray = useWorkerStore.getState().colorArray;
  const currentWorker = useWorkerStore((state) => state.currentWorker);
  const setCurrentWorker = useWorkerStore((state) => state.setCurrentWorker);
  const [isOpen, setIsOpen] = useState(false);

  const scaleXAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0);

  const togglePalette = () => {
    if (isOpen) {
      opacityAnim.value = withTiming(0, { duration: 200 });
      progressAnim.value = withTiming(0, { duration: 300 });
      scaleXAnim.value = withTiming(
        0,
        {
          damping: 30,
          stiffness: 250,
        },
        (isFinished) => {
          if (isFinished) {
            runOnJS(setIsOpen)(false);
          }
        },
      );
    } else {
      setIsOpen(true);
      scaleXAnim.value = withSpring(1, { damping: 40, stiffness: 250 });
      opacityAnim.value = withTiming(1, { duration: 300 });
      progressAnim.value = withTiming(1, { duration: 450 });
    }
  };
  const mainButtonAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progressAnim.value,
      [0, 1],
      ["transparent", "#e4dada"],
    ),
    borderTopRightRadius: interpolateColor(progressAnim.value, [0, 1], [20, 0]),
    borderBottomRightRadius: interpolateColor(
      progressAnim.value,
      [0, 1],
      [20, 0],
    ),
  }));
  const paletteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleXAnim.value }],
    opacity: opacityAnim.value,
    backgroundColor: interpolateColor(
      progressAnim.value,
      [0, 1],
      ["transparent", "#e4dada"],
    ),
  }));

  const innerButtonOpacityStyle = useAnimatedStyle(() => ({
    opacity: opacityAnim.value,
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Animated.View
        ref={addColorModal.anchorRef}
        entering={FadeIn.duration(350)}
        style={[
          {
            paddingHorizontal: 8,
            paddingVertical: 6,
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
          },
          mainButtonAnimatedStyle,
        ]}
      >
        <TouchableOpacity
          onPress={togglePalette}
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: currentWorker?.color || DEFAULT_WORKER_COLOR,
          }}
        />
      </Animated.View>
      {isOpen && (
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              paddingRight: 8,
              paddingVertical: 6,
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              gap: 8,
              overflow: "hidden",
              transformOrigin: "left",
            },
            paletteAnimatedStyle,
          ]}
        >
          <Animated.View
            style={[
              { flexDirection: "row", alignItems: "center", gap: 8 },
              innerButtonOpacityStyle,
            ]}
          >
            {colorArray.map(
              (c, i) =>
                c.color !== currentWorker?.color && (
                  <TouchableOpacity
                    key={c.id || i}
                    onPress={() => {
                      setCurrentWorker(c);
                      togglePalette();
                    }}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: c.color,
                    }}
                  />
                ),
            )}
            <View>
              <TouchableOpacity
                onPress={() => {
                  togglePalette();
                  addColorModal.open();
                }}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#fff",
                }}
              >
                <Plus size={16} color="#333" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
