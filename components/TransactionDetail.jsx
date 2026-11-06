import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

export const TransactionDetail = () => {
  const route = useRoute();
  const { id } = route.params;
  return (
    <View>
      <Text>Chi tiết giao dịch ID: {id}</Text>
    </View>
  );
};
