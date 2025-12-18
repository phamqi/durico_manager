import { Text, TextInput, View } from "react-native";
import { useGlobalState } from "../../context/StateContext"

export default function AddScreen() {
    
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Thêm lịch sử</Text>
      <TextInput
        placeholder="Nhập nội dung..."
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 10,
          padding: 12,
        }}
      />
    </View>
  );
}