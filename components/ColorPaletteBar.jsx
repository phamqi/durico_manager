import { DEFAULT_WORKER_COLOR } from "@/constants";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
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

  // Dùng scaleX để hiệu ứng nở ngang sang một bên cực kỳ mượt mà
  const scaleXAnim = useSharedValue(0);
  const opacityAnim = useSharedValue(0);

  const togglePalette = () => {
    if (isOpen) {
      opacityAnim.value = withTiming(0, { duration: 150 });
      scaleXAnim.value = withTiming(0, { duration: 150 }, (isFinished) => {
        if (isFinished) {
          runOnJS(setIsOpen)(false);
        }
      });
    } else {
      setIsOpen(true);
      scaleXAnim.value = withSpring(1, { damping: 30, stiffness: 200 });
      opacityAnim.value = withTiming(1, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleXAnim.value }],
    opacity: opacityAnim.value,
  }));

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {/* 1. Nút tròn chính hiển thị màu hiện tại */}
      <View
        ref={addColorModal.anchorRef}
        style={{
          backgroundColor: "#0b0a0a",
          paddingHorizontal: 8,
          paddingVertical: 6,
          borderTopRightRadius: isOpen ? 0 : 20, // Bo góc trên phải
          borderBottomRightRadius: isOpen ? 0 : 20, // Bo góc dưới phải
          borderTopLeftRadius: 20, // Góc trên trái giữ nguyên vuông
          borderBottomLeftRadius: 20,
        }}
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
      </View>

      {/* 2. Danh sách Palette nở ngang khi isOpen = true */}
      {isOpen && (
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#0b0a0a",
              paddingRight: 8,
              paddingVertical: 6,
              borderTopRightRadius: 20, // Bo góc trên phải
              borderBottomRightRadius: 20, // Bo góc dưới phải
              borderTopLeftRadius: 0, // Góc trên trái giữ nguyên vuông
              borderBottomLeftRadius: 0,
              gap: 8,
              overflow: "hidden",
              // Neo điểm transform sang bên trái để thanh palette nở dài sang phải
              transformOrigin: "left",
            },
            animatedStyle,
          ]}
        >
          {/* Nút thêm màu mới (+) */}
          {/* Danh sách các màu khác */}
          <>
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
          </>
          <View>
            <TouchableOpacity
              onPress={() => {
                togglePalette();
                addColorModal.open();
                console.log("alo alo");
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
      )}
    </View>
  );
}
