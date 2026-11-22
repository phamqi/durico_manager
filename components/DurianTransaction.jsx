import { useFocusEffect, useRouter } from "expo-router";
import { MoveRight } from "lucide-react-native";
import { useCallback, useState } from "react";
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalState } from "../context";
import TransactionCard from "./TransactionCard";

export default function CoffeeHarvest({ isActive = true, scrollY }) {
  const { getTransactions } = useGlobalState();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [transactionArray, setTransactionsArray] = useState([]);
  const types = 2;

  const fetchTransactions = useCallback(
    async (showLoading) => {
      if (showLoading) setLoading(true);
      try {
        const rows = await getTransactions(types);
        setTransactionsArray(Array.isArray(rows) ? rows : []);
        setHasLoadedOnce(true);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [getTransactions],
  );

  useFocusEffect(
    useCallback(() => {
      if (!isActive) return;
      let isMounted = true;

      (async () => {
        if (!hasLoadedOnce) setLoading(true);
        try {
          const rows = await getTransactions(types);
          if (isMounted) {
            setTransactionsArray(Array.isArray(rows) ? rows : []);
            setHasLoadedOnce(true);
          }
        } catch (error) {
          console.error("Failed to load transactions:", error);
        } finally {
          if (isMounted) {
            setLoading(false);
          }
        }
      })();

      return () => {
        isMounted = false;
      };
    }, [isActive, hasLoadedOnce, getTransactions]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchTransactions(false);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTransactions]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  console.log("TABS 3 rerender");

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 250,
          paddingTop: 10,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
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
        ) : transactionArray.length > 0 ? (
          transactionArray.map((item, index) => (
            <TransactionCard
              key={item.id}
              item={item}
              index={index}
              scrollY={scrollY}
            />
          ))
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#333",
                textAlign: "center",
                marginBottom: 6,
              }}
            >
              Chưa có giao dịch nào
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Bắt đầu ngay
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/add")}
              style={{
                backgroundColor: "transparent",
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: "600",
                }}
              >
                <MoveRight />
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}
