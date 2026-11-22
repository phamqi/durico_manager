import { useGlobalState } from "@/context";
import { useCallback, useRef, useState } from "react";
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
import HarvestPager from "./HarvestPager";

const TABS = [
  { key: 0, title: "Cà phê", bgColor: "#db4545" },
  { key: 1, title: "Bán cà phê", bgColor: "#4734b5" },
  { key: 2, title: "Sầu riêng", bgColor: "#2fba5d" },
  { key: 3, title: "Thu", bgColor: "#2fba5d" },
];

function IndicatorBar({ isActive }) {
  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(isActive ? 24 : 8, { damping: 15, stiffness: 150 }),
    backgroundColor: isActive ? "#059669" : "#D1D5DB",
  }));
  return (
    <Animated.View style={[{ height: 4, borderRadius: 2 }, animatedStyle]} />
  );
}

export default function TransactionPager() {
  const [activeTab, setActiveTab] = useState(0);
  // Chỉ mount tab 0 lúc đầu; các tab khác mount khi người dùng lướt/chuyển tới lần đầu
  const [visitedTabs, setVisitedTabs] = useState(() => new Set([0]));
  const { setIsTabActive } = useGlobalState();
  const pagerRef = useRef(null);

  const scrollY0 = useSharedValue(0);
  const scrollY1 = useSharedValue(0);
  const scrollY2 = useSharedValue(0);
  const scrollY3 = useSharedValue(0);

  const scrollYList = [scrollY0, scrollY1, scrollY2, scrollY3];
  const currentScrollY = scrollYList[activeTab] || scrollY0;

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

  const handlePageSelected = useCallback(
    (e) => {
      const pos = e.nativeEvent.position;
      setActiveTab(pos);
      setIsTabActive(pos === 3);
      setVisitedTabs((prev) => {
        if (prev.has(pos)) return prev;
        const next = new Set(prev);
        next.add(pos);
        return next;
      });
    },
    [setIsTabActive],
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
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
        onPageSelected={handlePageSelected}
      >
        <View key="0" style={{ flex: 1 }}>
          {visitedTabs.has(0) && (
            <CoffeeHarvest isActive={activeTab === 0} scrollY={scrollY0} />
          )}
        </View>
        <View key="1" style={{ flex: 1 }}>
          {visitedTabs.has(1) && (
            <CoffeeTransaction isActive={activeTab === 1} scrollY={scrollY1} />
          )}
        </View>
        <View key="2" style={{ flex: 1 }}>
          {visitedTabs.has(2) && (
            <DurianTransaction isActive={activeTab === 2} scrollY={scrollY2} />
          )}
        </View>
        <View key="3" style={{ flex: 1 }}>
          {visitedTabs.has(3) && (
            <HarvestPager isActive={activeTab === 3} scrollY={scrollY3} />
          )}
        </View>
      </PagerView>
    </View>
  );
}
