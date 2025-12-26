import { Text, TextInput, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAddScreenEnterAnimation } from '../../hooks/useAnchoreTab';
export default function AddScreen() {
  const animatedStyle = useAddScreenEnterAnimation()  

  return (
    <View style={{ flex: 1 }}>
        <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#fff",
            paddingVertical: 50,
            paddingHorizontal: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
          animatedStyle,
        ]}
      >
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
      </Animated.View>
    </View>
  );
}