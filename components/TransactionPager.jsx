import { useRef, useState } from "react";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import CoffeeHarvest from "./CoffeeHarvest";
import CoffeeTransaction from "./CoffeeTransaction";
import DurianTransaction from "./DurianTransaction";

const TABS = [
  { key: 0, title: "Cà phê", bgColor: "#db4545" },
  { key: 1, title: "Bán cà phê", bgColor: "#4734b5" },
  { key: 2, title: "Sầu riêng", bgColor: "#2fba5d" },
];

function IndicatorBar({ isActive }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(isActive ? 24 : 8, { damping: 15, stiffness: 150 }),
      backgroundColor: isActive ? "#059669" : "#D1D5DB",
    };
  });
  return (
    <Animated.View style={[{ height: 4, borderRadius: 2 }, animatedStyle]} />
  );
}

export default function TransactionPager() {
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef(null);

  // Tạo 3 scrollY riêng biệt cho 3 tab để lưu độc lập vị trí cuộn của từng tab
  const scrollY0 = useSharedValue(0);
  const scrollY1 = useSharedValue(0);
  const scrollY2 = useSharedValue(0);

  // Gom lại thành một mảng để dễ gọi theo activeTab
  const scrollYList = [scrollY0, scrollY1, scrollY2];
  const currentScrollY = scrollYList[activeTab];

  // Header animate dựa theo scrollY của tab ĐANG HIỂN THỊ
  const animatedTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      currentScrollY.value,
      [0, 60],
      [34, 18],
      Extrapolation.CLAMP,
    );

    const paddingTop = interpolate(
      currentScrollY.value,
      [0, 60],
      [40, 30],
      Extrapolation.CLAMP,
    );

    return { fontSize, paddingTop };
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: TABS[activeTab].bgColor,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
          alignItems: "center",
        }}
      >
        <Animated.Text
          style={[{ color: "#333", fontWeight: "bold" }, animatedTitleStyle]}
        >
          {TABS[activeTab].title}
        </Animated.Text>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {TABS.map((tab, index) => (
            <IndicatorBar key={tab.key} isActive={activeTab === index} />
          ))}
        </View>
      </View>
      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => {
          setActiveTab(e.nativeEvent.position);
        }}
      >
        <View key="0" style={{ flex: 1 }}>
          <CoffeeHarvest scrollY={scrollY0} />
        </View>
        <View key="1" style={{ flex: 1 }}>
          <CoffeeTransaction scrollY={scrollY1} />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <DurianTransaction scrollY={scrollY2} />
        </View>
      </PagerView>
    </View>
  );
}
