import { ThemedView } from "@/components/themed-view";
import { StyleSheet } from "react-native";
import TransactionPager from "../../components/TransactionPager"; // Chỉnh lại đường dẫn import cho đúng thư mục components của bạn

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <TransactionPager />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Bắt buộc phải là flex: 1 theo chiều dọc để TransactionPager trải dài hết màn hình
  },
});
