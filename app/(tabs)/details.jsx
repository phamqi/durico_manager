import { DEFAULT_WORKER_COLOR } from "@/constants";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useGlobalState } from "../../context";

const TYPE_LABELS = {
  0: "Thu nhập",
  1: "Ca phe",
  2: "Sau rieng",
};

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const {
    getTransactionsDetails,
    colorArray,
    currentWorker,
    setCurrentWorker,
  } = useGlobalState();
  const [columnsData, setColumnsData] = useState([]);
  const [transactionType, setTransactionType] = useState(0);

  useEffect(() => {
    async function fetchDetails() {
      if (id) {
        const numericId = Number(id);
        const rows = await getTransactionsDetails(numericId);
        const validRows = Array.isArray(rows) ? rows : [];

        if (
          validRows.length > 0 &&
          validRows[0].transaction_types !== undefined
        ) {
          setTransactionType(validRows[0].transaction_types);
        }

        // 1. Nhóm dữ liệu thô từ database theo column_index
        const rawGrouped = validRows.reduce((acc, curr) => {
          if (!acc[curr.column_index]) {
            acc[curr.column_index] = [];
          }
          acc[curr.column_index].push(curr);
          return acc;
        }, {});

        // 2. Tái tạo danh sách cột với đủ 5 ô TextInput cho mỗi cụm
        const formattedColumns = Object.keys(rawGrouped).map((colIndex) => {
          const colRows = rawGrouped[colIndex];

          // Tạo sẵn 5 ô mặc định
          const inputs = Array.from({ length: 5 }, (_, inputIdx) => {
            const rowIndex = inputIdx + 1;
            // Tìm bản ghi tương ứng với row_index này trong DB
            const matchedRow = colRows.find((r) => r.row_index === rowIndex);

            if (matchedRow) {
              return {
                id: matchedRow.id,
                // Hiển thị cả 0 dưới dạng chuỗi "0"
                weight:
                  matchedRow.weight !== null && matchedRow.weight !== undefined
                    ? String(matchedRow.weight)
                    : "",
                row_index: rowIndex,
                worker_id: matchedRow.worker_id,
                worker_name: matchedRow.worker_name,
                worker_color: matchedRow.worker_color,
              };
            }

            return {
              id: null,
              weight: "",
              row_index: rowIndex,
              worker_id: null,
              worker_name: null,
              worker_color: null,
            };
          });

          // Lấy result của cột (hoặc tự tính lại)
          const resultSum = inputs.reduce(
            (sum, item) => sum + (parseFloat(item.weight) || 0),
            0,
          );

          return {
            id: Number(colIndex),
            inputs,
            result: String(resultSum),
          };
        });

        setColumnsData(formattedColumns);
      }
    }

    fetchDetails();
  }, [id]);

  const handleInputChange = (text, colIndex, inputIndex) => {
    const updatedData = [...columnsData];
    updatedData[colIndex].inputs[inputIndex] = {
      ...updatedData[colIndex].inputs[inputIndex],
      weight: text,
      worker_id: currentWorker
        ? currentWorker.id
        : updatedData[colIndex].inputs[inputIndex].worker_id,
      worker_name: currentWorker
        ? currentWorker.name
        : updatedData[colIndex].inputs[inputIndex].worker_name,
      worker_color: currentWorker
        ? currentWorker.color
        : updatedData[colIndex].inputs[inputIndex].worker_color,
    };

    const sum = updatedData[colIndex].inputs.reduce(
      (acc, item) => acc + (parseFloat(item.weight) || 0),
      0,
    );
    updatedData[colIndex].result = String(sum);

    setColumnsData(updatedData);
  };

  const cardStyle = {
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
  };

  const currentTypeLabel = TYPE_LABELS[transactionType] || "Thu nhập";

  const totalSummary = columnsData.reduce(
    (acc, col) => acc + (parseFloat(col.result) || 0),
    0,
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: 20,
          paddingHorizontal: 20,
        }}
      >
        <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: "bold" }}>
          Chi tiết giao dịch ID: {id}
        </Text>

        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#f8f9fa",
            padding: 10,
            paddingTop: 20,
            borderRadius: 8,
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {columnsData.map((item, index) => (
              <View key={item.id || index} style={cardStyle}>
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
                    Cụm #{index + 1}
                  </Text>

                  {item.inputs.map((inputItem, inputIdx) => (
                    <TextInput
                      key={inputIdx}
                      style={{
                        height: 28,
                        borderWidth: 0,
                        borderRadius: 6,
                        paddingBottom: 0,
                        paddingTop: 0,
                        paddingLeft: 10,
                        textAlignVertical: "center",
                        marginBottom: 4,
                        fontSize: 16,
                        backgroundColor:
                          !inputItem.worker_color ||
                          inputItem.worker_color === DEFAULT_WORKER_COLOR
                            ? "#fff"
                            : inputItem.worker_color,
                        color: "#333333",
                        fontWeight: "600",
                      }}
                      placeholder={`Ô ${inputIdx + 1}`}
                      placeholderTextColor="#aaa"
                      keyboardType="numeric"
                      value={inputItem.weight}
                      onChangeText={(text) =>
                        handleInputChange(text, index, inputIdx)
                      }
                      onFocus={() => {
                        if (inputItem.worker_id && colorArray) {
                          const foundWorker = colorArray.find(
                            (w) => w.id === inputItem.worker_id,
                          );
                          if (foundWorker) {
                            setCurrentWorker(foundWorker);
                          }
                        }
                      }}
                    />
                  ))}
                </View>

                {/* Kết quả từng cụm */}
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
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#137333",
                      fontWeight: "600",
                    }}
                  >
                    Kết quả:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: "#137333",
                    }}
                  >
                    {item.result}
                  </Text>
                </View>
              </View>
            ))}

            {/* Ô Tổng kết chung */}
            <View style={cardStyle}>
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

                <View style={{ marginBottom: 8 }}>
                  <View
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: 8,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#007AFF",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "#333",
                        fontWeight: "bold",
                        fontSize: 13,
                      }}
                    >
                      {currentTypeLabel}
                    </Text>
                  </View>
                </View>
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
                    {totalSummary}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
