import { DEFAULT_WORKER_COLOR } from "@/constants";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useGlobalState } from "../context";

export default function ColorPaletteBar({ addColorModal }) {
  const { setColor, colorArray, currentWorker, setCurrentWorker } =
    useGlobalState();
  const [isOpen, setIsOpen] = useState(false);

  // Shared values
  const scaleXAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);
  const progressAnim = useSharedValue(0); // Điều khiển background và bo góc

  const togglePalette = () => {
    if (isOpen) {
      // ĐÓNG: Tăng thời gian ẩn background lên (ví dụ: 300ms) để nó biến mất từ từ, mượt mà hơn
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
      // MỞ: Tăng thời gian hiện background lên lâu hơn (ví dụ: 450ms) để background hiện lên cực kỳ thong thả, êm ái
      scaleXAnim.value = withSpring(1, { damping: 40, stiffness: 250 });
      opacityAnim.value = withTiming(1, { duration: 300 });
      progressAnim.value = withTiming(1, { duration: 450 });
    }
  };

  // 1. Style cho nút chính: Background chuyển màu chậm rãi theo progressAnim
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

  // 2. Style cho thanh palette bên phải
  const paletteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleXAnim.value }],
    opacity: opacityAnim.value,
    backgroundColor: interpolateColor(
      progressAnim.value,
      [0, 1],
      ["transparent", "#e4dada"],
    ),
  }));

  // 3. Style mờ/hiện cho các nút màu bên trong
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

      {/* 2. Danh sách Palette nở ngang khi isOpen = true */}
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
          {/* Danh sách các màu khác */}
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
                      setColor(c.color);
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
