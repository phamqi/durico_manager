import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { useGlobalState } from "../../context";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

export default function AddScreen() {
  const { color, setColor, colorArray, currentWorker, setCurrentWorker } =
    useGlobalState();
  console.log("current worker", currentWorker);
  useEffect(() => {
    console.log("colorArray in add.jsx", colorArray);
  }, []);
  const animatedStyle = useAddScreenEnterAnimation();

  const [columnsData, setColumnsData] = useState([
    {
      id: "1",
      inputs: [
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
      ],
      result: "0",
    },
    {
      id: "2",
      inputs: [
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
        { value: "", workerId: null, color: null },
      ],
      result: "0",
    },
  ]);

  const handleInputChange = (text, colIndex, inputIndex) => {
    const updatedData = [...columnsData];
    updatedData[colIndex].inputs[inputIndex] = {
      ...updatedData[colIndex].inputs[inputIndex],
      value: text,
      workerId: currentWorker ? currentWorker.id : null,
      color: currentWorker ? currentWorker.color : null,
    };

    const sum = updatedData[colIndex].inputs.reduce(
      (acc, item) => acc + (parseFloat(item.value) || 0),
      0,
    );
    updatedData[colIndex].result = sum.toString();

    setColumnsData(updatedData);
  };

  // Hàm thêm một cụm mới (tăng số lượng cột/tổ hợp)
  const addColumn = () => {
    const newCol = {
      id: Date.now().toString(),
      inputs: ["", "", "", "", ""],
      result: "0",
    };
    setColumnsData([...columnsData, newCol]);
  };
  const renderColumnItem = ({ item, index }) => (
    <View
      style={{
        width: "48%",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: "#e1e4e8",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold",
          color: "#333",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        Cụm #{index + 1}
      </Text>

      {/* 5 ô tính xếp dọc */}
      {item.inputs.map((inputItem, inputIdx) => (
        <TextInput
          key={inputIdx}
          style={{
            height: 38,
            borderWidth: 1.5,
            borderColor: "#d0d7de",
            borderRadius: 6,
            paddingHorizontal: 8,
            fontSize: 14,
            backgroundColor: "#fff",
            color: inputItem.color || "#333333",
            fontWeight: "600",
          }}
          placeholder={`Ô ${inputIdx + 1}`}
          placeholderTextColor="#aaa"
          keyboardType="numeric"
          value={inputItem.value}
          onChangeText={(text) => handleInputChange(text, index, inputIdx)}
          onFocus={() => {
            // Nếu ô này đã từng được gán workerId trước đó, ta tìm lại thông tin worker và đổi currentWorker thành người đó
            if (inputItem.workerId) {
              const foundWorker = colorArray.find(
                (w) => w.id === inputItem.workerId,
              );
              if (foundWorker) {
                setCurrentWorker(foundWorker); // Cập nhật currentWorker / color ở Global State
              }
            }
          }}
        />
      ))}

      {/* 1 ô kết quả ở dưới cùng */}
      <View
        style={{
          marginTop: 4,
          padding: 6,
          backgroundColor: "#e6f4ea",
          borderRadius: 6,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 12, color: "#137333", fontWeight: "600" }}>
          Kết quả:
        </Text>
        <Text style={{ fontSize: 14, fontWeight: "bold", color: "#137333" }}>
          {item.result}
        </Text>
      </View>
    </View>
  );
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
        {/* <TextInput
          placeholder="Nhập nội dung..."
          style={{
            borderWidth: 1,
            borderColor: "#aaa",
            borderRadius: 10,
            padding: 12,
          }}
        /> */}
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#f8f9fa",
            padding: 10,
            paddingTop: 40,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#007AFF",
              padding: 12,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 15,
            }}
            onPress={addColumn}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              + Thêm tổ hợp cột
            </Text>
          </TouchableOpacity>

          <FlatList
            data={columnsData}
            renderItem={renderColumnItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={{
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          />
        </ScrollView>
      </Animated.View>
    </View>
  );
}
