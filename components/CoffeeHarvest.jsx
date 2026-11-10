import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalState } from "../context";
import TransactionCard from "./TransactionCard";

export default function CoffeeHarvest({ scrollY }) {
  const { getTransactions } = useGlobalState();
  const [loading, setLoading] = useState(true);
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
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 250,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
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
