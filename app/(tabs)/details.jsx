import { ColumnCard } from "@/components";
import { useLocalSearchParams, usePathname } from "expo-router";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAnchoredModalReanimated } from "../../hooks/useAnchoreModal";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

const db = SQLite.openDatabaseSync("durico_app.db");

export default function DetailsScreen() {
  const typeModal = useAnchoredModalReanimated();
  const animatedStyle = useAddScreenEnterAnimation();
  const pathname = usePathname();
  const { id: transactionId } = useLocalSearchParams();

  const [ArrayColumn, setArrayColumn] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeModal?.visible) {
      typeModal.close();
    }
  }, [pathname]);
  useEffect(() => {
    async function fetchTransactionDetails() {
      try {
        setLoading(true);
        const rows = await db.getAllAsync(
          `SELECT * FROM transaction_details WHERE transaction_id = ? ORDER BY column_index, row_index`,
          [transactionId || 8],
        );
        const groupedColumns = {};
        rows.forEach((item) => {
          if (!groupedColumns[item.column_index]) {
            groupedColumns[item.column_index] = [];
          }
          groupedColumns[item.column_index].push(item);
        });
        const formattedColumns = Object.keys(groupedColumns).map(
          (colIndex) => ({
            colIndex: Number(colIndex),
            items: groupedColumns[colIndex],
          }),
        );
        setArrayColumn(formattedColumns);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết transaction:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactionDetails();
  }, [transactionId]);

  console.log("detailsScreen rerender");

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
        <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "bold" }}>
          Chi tiết lịch sử (ID: {transactionId || 8})
        </Text>

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
            {loading ? (
              <Text style={{ textAlign: "center", width: "100%", padding: 20 }}>
                Đang tải dữ liệu chi tiết...
              </Text>
            ) : ArrayColumn && ArrayColumn.length > 0 ? (
              ArrayColumn.map((colData, index) => (
                <ColumnCard
                  key={colData.colIndex || index}
                  colIdx={colData.colIndex}
                  initialData={colData.items}
                  disabled={true}
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", width: "100%", padding: 20 }}>
                Không có dữ liệu chi tiết cho giao dịch này.
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
                    {ArrayColumn.reduce(
                      (acc, col) =>
                        acc +
                        col.items.reduce(
                          (sum, item) => sum + (item.result || 0),
                          0,
                        ),
                      0,
                    )}
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
