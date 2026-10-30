import { Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const CARD_HEIGHT = 120;
const CARD_MARGIN = 16;

export default function TransactionCard({ item, index, scrollY }) {
  const animatedStyle = useAnimatedStyle(() => {
    const originalY = index * (CARD_HEIGHT + CARD_MARGIN);

    const MAX_STACK_INDEX = 5;
    const STACK_OFFSET = 9;
    const effectiveIndex = Math.min(index, MAX_STACK_INDEX);
    const stickyTargetY = effectiveIndex * STACK_OFFSET;

    const startTriggerY = originalY - CARD_HEIGHT;

    const translateY = interpolate(
      scrollY.value,
      [startTriggerY, originalY],
      [0, stickyTargetY - originalY + scrollY.value],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: CARD_HEIGHT,
          width: "100%",
          borderRadius: 20,
          padding: 20,
          marginBottom: CARD_MARGIN,
          justifyContent: "space-between",
          backgroundColor: item.color,
          zIndex: index,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#333", fontSize: 14, fontWeight: "600" }}>
          Giao dịch #{item.id}
        </Text>
        {item.is_hidden === 1 && (
          <Text
            style={{
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "#fff",
              fontSize: 10,
              paddingHorizontal: 8,
              paddingVertical: 2,
              borderRadius: 6,
              overflow: "hidden",
            }}
          >
            Đang ẩn
          </Text>
        )}
      </View>
      <Text style={{ color: "#111", fontSize: 24, fontWeight: "bold" }}>
        {item.total_summary.toLocaleString("vi-VN")} đ
      </Text>
      <Text style={{ color: "#444", fontSize: 12 }}>
        Tạo lúc: {item.created_at}
      </Text>
    </Animated.View>
  );
}
