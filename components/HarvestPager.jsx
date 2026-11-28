import { useFocusEffect, useRouter } from "expo-router"; // 👈 Thêm useRouter
import { MoveRight } from "lucide-react-native";
import { useCallback, useState } from "react";
import { RefreshControl, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalState, useWorkerStore } from "../context";
import WorkerHistorySessionList from "./HistoryColumnCard";

export default function CoffeeHarvest({ scrollY }) {
  const currentWorker = useWorkerStore((state) => state.currentWorker);

  const { getDetailsByWorker, getTotalWeightByYear } = useGlobalState();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactionArray, setTransactionsArray] = useState([]);
  const [totalWeight, setTotalWeight] = useState();

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setLoading(true);

      (async () => {
        const rows = await getDetailsByWorker(0, currentWorker.id);
        const total = await getTotalWeightByYear(currentWorker.id);
        if (isMounted) {
          setTransactionsArray(Array.isArray(rows) ? rows : []);
          setTotalWeight(total);
          setLoading(false);
          console.log("Data Harvest", currentWorker.id, total);
        }
      })();
      return () => {
        isMounted = false;
      };
    }, [currentWorker.id]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const rows = await getDetailsByWorker(0, currentWorker.id);
      setTransactionsArray(Array.isArray(rows) ? rows : []);
    } catch (error) {
      console.error("Failed to refresh transactions:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {!loading && transactionArray.length > 0 && (
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#e1e4e8",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 15, color: "#555", fontWeight: "600" }}>
            Tổng sản lượng năm:
          </Text>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#137333" }}>
            {totalWeight}
          </Text>
        </View>
      )}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={{
          paddingHorizontal: 10,
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
          <>
            <WorkerHistorySessionList rawRows={transactionArray} />
          </>
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
