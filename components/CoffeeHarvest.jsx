import { useFocusEffect, useRouter } from "expo-router"; // 👈 Thêm useRouter
import { MoveRight } from "lucide-react-native";
import { useCallback, useState } from "react";
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalState } from "../context";
import TransactionCard from "./TransactionCard";

export default function CoffeeHarvest({ scrollY }) {
  const { getTransactions } = useGlobalState();
  const router = useRouter(); // 👈 Khởi tạo router để điều hướng
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactionArray, setTransactionsArray] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setLoading(true);

      (async () => {
        const rows = await getTransactions(0);
        if (isMounted) {
          setTransactionsArray(Array.isArray(rows) ? rows : []);
          setLoading(false);
        }
      })();

      return () => {
        isMounted = false;
      };
    }, [getTransactions]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const rows = await getTransactions(0);
      setTransactionsArray(Array.isArray(rows) ? rows : []);
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
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 250,
          paddingTop: 10,
          flexGrow: 1, // 👈 Giúp căn giữa theo chiều dọc khi màn hình trống
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
          // Trường hợp có dữ liệu: Hiển thị danh sách card
          transactionArray.map((item, index) => (
            <TransactionCard
              key={item.id}
              item={item}
              index={index}
              scrollY={scrollY}
            />
          ))
        ) : (
          // Trường hợp KHÔNG có giao dịch nào (Mảng rỗng)
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
