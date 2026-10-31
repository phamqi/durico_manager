import { useRef, useState } from "react";
import { Text, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, {
  useAnimatedStyle,
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
      width: withSpring(isActive ? 24 : 8, {
        damping: 15,
        stiffness: 150,
      }),
      backgroundColor: isActive ? "#059669" : "#D1D5DB",
    };
  });

  return (
    <Animated.View
      style={[
        {
          height: 4,
          borderRadius: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

export default function TransactionPager() {
  const [activeTab, setActiveTab] = useState(0);
  const pagerRef = useRef(null);

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
          paddingTop: 60,
        }}
      >
        <Text
          style={{
            color: "#333",
            fontSize: 22,
            fontWeight: "bold",
            marginBottom: 8,
          }}
        >
          {TABS[activeTab].title}
        </Text>

        {/* Cụm vạch gạch ngang: Thêm flexDirection mặc định 'row' để các vạch luôn xếp chuẩn từ trái sang phải */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {TABS.map((tab, index) => {
            const isActive = activeTab === index;
            return <IndicatorBar key={tab.key} isActive={isActive} />;
          })}
        </View>
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={0}
        onPageSelected={(e) => setActiveTab(e.nativeEvent.position)}
      >
        <View key="0" style={{ flex: 1 }}>
          <CoffeeHarvest />
        </View>
        <View key="1" style={{ flex: 1 }}>
          <CoffeeTransaction />
        </View>
        <View key="2" style={{ flex: 1 }}>
          <DurianTransaction />
        </View>
      </PagerView>
    </View>
  );
}
