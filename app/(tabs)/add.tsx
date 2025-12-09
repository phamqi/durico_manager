import { useEffect } from "react";
import { View, Text, TextInput } from "react-native";
import { useNavigation } from "expo-router";

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