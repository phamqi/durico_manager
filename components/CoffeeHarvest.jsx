import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { useGlobalState } from "../context";
import TransactionCard from "./TransactionCard";

export default function CoffeeHarvest({ scrollY }) {
  const { getTransactions } = useGlobalState();
  const [loading, setLoading] = useState(true);
  const [transactionArray, setTransactionsArray] = useState([]);
  useEffect(() => {
    setLoading(true);
    (async () => {
      const rows = await getTransactions(0);
      setTransactionsArray(rows);
      console.log("TransactionsArray harvest", rows);
      setLoading(false);
    })();
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#bc3c3c", paddingTop: 10 }}>
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
          <Text style={{ fontWeight: "600", fontSize: 16 }}>Loading...</Text>
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
