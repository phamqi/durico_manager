import { Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import TransactionCard from "./TransactionCard";

const DATA = [
  {
    id: 1,
    is_hidden: 0,
    total_summary: 250000,
    created_at: "2026-06-06 08:30:00",
    color: "#FF6B6B",
  },
  {
    id: 2,
    is_hidden: 0,
    total_summary: 1250000,
    created_at: "2026-06-06 09:15:00",
    color: "#4ECDC4",
  },
  {
    id: 3,
    is_hidden: 1,
    total_summary: 500000,
    created_at: "2026-06-06 10:00:00",
    color: "#45B7D1",
  },
  {
    id: 4,
    is_hidden: 0,
    total_summary: 320000,
    created_at: "2026-06-06 11:45:00",
    color: "#96CEB4",
  },
  {
    id: 5,
    is_hidden: 0,
    total_summary: 890000,
    created_at: "2026-06-06 14:20:00",
    color: "#FFEEAD",
  },
  {
    id: 6,
    is_hidden: 0,
    total_summary: 250000,
    created_at: "2026-06-06 08:30:00",
    color: "#FF6B6B",
  },
  {
    id: 7,
    is_hidden: 0,
    total_summary: 1250000,
    created_at: "2026-06-06 09:15:00",
    color: "#4ECDC4",
  },
  {
    id: 8,
    is_hidden: 1,
    total_summary: 500000,
    created_at: "2026-06-06 10:00:00",
    color: "#45B7D1",
  },
  {
    id: 9,
    is_hidden: 0,
    total_summary: 320000,
    created_at: "2026-06-06 11:45:00",
    color: "#96CEB4",
  },
  {
    id: 10,
    is_hidden: 0,
    total_summary: 890000,
    created_at: "2026-06-06 14:20:00",
    color: "#FFEEAD",
  },
  {
    id: 11,
    is_hidden: 0,
    total_summary: 250000,
    created_at: "2026-06-06 08:30:00",
    color: "#FF6B6B",
  },
  {
    id: 12,
    is_hidden: 0,
    total_summary: 1250000,
    created_at: "2026-06-06 09:15:00",
    color: "#4ECDC4",
  },
  {
    id: 13,
    is_hidden: 1,
    total_summary: 500000,
    created_at: "2026-06-06 10:00:00",
    color: "#45B7D1",
  },
  {
    id: 14,
    is_hidden: 0,
    total_summary: 320000,
    created_at: "2026-06-06 11:45:00",
    color: "#96CEB4",
  },
  {
    id: 15,
    is_hidden: 0,
    total_summary: 890000,
    created_at: "2026-06-06 14:20:00",
    color: "#FFEEAD",
  },
  {
    id: 16,
    is_hidden: 0,
    total_summary: 250000,
    created_at: "2026-06-06 08:30:00",
    color: "#FF6B6B",
  },
  {
    id: 17,
    is_hidden: 0,
    total_summary: 1250000,
    created_at: "2026-06-06 09:15:00",
    color: "#4ECDC4",
  },
  {
    id: 18,
    is_hidden: 1,
    total_summary: 500000,
    created_at: "2026-06-06 10:00:00",
    color: "#45B7D1",
  },
  {
    id: 19,
    is_hidden: 0,
    total_summary: 320000,
    created_at: "2026-06-06 11:45:00",
    color: "#96CEB4",
  },
  {
    id: 20,
    is_hidden: 0,
    total_summary: 890000,
    created_at: "2026-06-06 14:20:00",
    color: "#FFEEAD",
  },
];

export default function DurianTransaction() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#44b422", paddingTop: 60 }}>
      <Text
        style={{
          color: "#333",
          fontSize: 22,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Danh sách Giao dịch sau
      </Text>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 250,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {DATA.map((item, index) => {
          return (
            <TransactionCard
              key={item.id}
              item={item}
              index={index}
              scrollY={scrollY}
            />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
}
