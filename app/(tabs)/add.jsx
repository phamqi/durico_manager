import { ColumnCard } from "@/components";
import { useDuricoAlert } from "@/context";
import { usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAnchoredModalReanimated } from "../../hooks/useAnchoreModal";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

export default function AddScreen() {
  const alert = useDuricoAlert();
  const typeModal = useAnchoredModalReanimated();
  const animatedStyle = useAddScreenEnterAnimation();
  const pathname = usePathname();

  const [ArrayColumn, setArrayColumn] = useState([1]);

  useEffect(() => {
    if (typeModal?.visible) {
      typeModal.close();
    }
  }, [pathname]);

  const handleAddColumn = useCallback(() => {
    setArrayColumn((prevColumns) => [...prevColumns, {}]);
  }, []);

  console.log("addScreen rerender");

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#fff",
            paddingTop: 50,
            paddingHorizontal: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Thêm lịch sử</Text>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#f8f9fa",
            padding: 10,
            paddingTop: 20,
            borderRadius: 8,
          }}
          contentContainerStyle={{ paddingBottom: 260 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {ArrayColumn && ArrayColumn.length > 0 ? (
              ArrayColumn.map((_, colIdx) => (
                <ColumnCard
                  key={colIdx}
                  colIdx={colIdx}
                  handleAddColumn={handleAddColumn}
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", width: "100%", padding: 20 }}>
                Đang tải dữ liệu cột...
              </Text>
            )}

            <View
              style={{
                width: "48%",
                height: 248,
                backgroundColor: "#fff",
                borderRadius: 8,
                padding: 12,
                borderWidth: 1,
                borderColor: "#e1e4e8",
                elevation: 2,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                marginBottom: 10,
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#333",
                    marginBottom: 8,
                    textAlign: "center",
                  }}
                >
                  Tổng kết chung
                </Text>
              </View>

              <View>
                <View
                  style={{
                    padding: 6,
                    backgroundColor: "#e6f4ea",
                    borderRadius: 6,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      color: "#137333",
                      fontWeight: "600",
                    }}
                  >
                    Tổng:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#137333",
                    }}
                  >
                    1000
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
