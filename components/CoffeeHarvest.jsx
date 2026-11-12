import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { RefreshControl, Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalState } from "../context";
import TransactionCard from "./TransactionCard";

export default function CoffeeHarvest({ scrollY }) {
  const { getTransactions } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // 1. Thêm state quản lý trạng thái pull-to-refresh
  const [transactionArray, setTransactionsArray] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setLoading(true);

      (async () => {
        const rows = await getTransactions(0);
        if (isMounted) {
          setTransactionsArray(rows);
          setLoading(false);
        }
      })();

      return () => {
        isMounted = false;
      };
    }, [getTransactions]),
  );

  // 2. Hàm xử lý khi người dùng kéo xuống để refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const rows = await getTransactions(0);
      setTransactionsArray(rows);
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
    } finally {
      setRefreshing(false);
    }
  }, [getTransactions]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={true} // 👈 Bắt buộc có để iOS cho phép kéo âm (over-scroll)
        overScrollMode="always"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 250,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
        // 3. Gắn RefreshControl vào Animated.ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
            }}
          >
            <Text style={{ fontWeight: "600", fontSize: 16 }}>Loading...</Text>
          </View>
        ) : (
          transactionArray?.map((item, index) => (
            <TransactionCard
              key={item.id}
              item={item}
              index={index}
              scrollY={scrollY}
            />
          ))
        )}
      </Animated.ScrollView>
    </View>
  );
}
