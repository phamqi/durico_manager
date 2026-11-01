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
  { key: 0, title: "Cà phê" },
  { key: 1, title: "Bán cà phê" },
  { key: 2, title: "Sầu riêng" },
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

  const scrollY = useSharedValue(0);

  const animatedTitleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, 60],
      [34, 16],
      Extrapolation.CLAMP,
    );

    const paddingTop = interpolate(
      scrollY.value,
      [0, 60],
      [50, 30],
      Extrapolation.CLAMP,
    );

    return { fontSize, paddingTop };
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: "#FFFFFF",
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
          scrollY.value = 0;
        }}
      >
        <View key="0" style={{ flex: 1 }}>
          <CoffeeHarvest scrollY={scrollY} />
        </View>
        <View key="1" style={{ flex: 1 }}>
          <CoffeeTransaction scrollY={scrollY} />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <DurianTransaction scrollY={scrollY} />
        </View>
      </PagerView>
    </View>
  );
}
