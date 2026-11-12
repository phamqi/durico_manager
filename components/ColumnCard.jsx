import { DEFAULT_WORKER_COLOR } from "@/constants";
import React, { useCallback, useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

const ColumnCard = React.memo(
  ({
    colIdx,
    columnData,
    activeColIndex,
    activeInputIndex,
    isKeyboardVisible,
    inputRefs,
    onFocusInput,
    cardStyle,
  }) => {
    // Local state cho các input bên trong cột này để gõ phím cực mượt mà không làm rớt frame ở màn hình ngoài
    const [inputs, setInputs] = useState(columnData.inputs || []);
    const [result, setResult] = useState(columnData.result || "0");

    // Đồng bộ lại nếu Global/Cha thay đổi dữ liệu từ bên ngoài
    useEffect(() => {
      setInputs(columnData.inputs || []);
      setResult(columnData.result || "0");
    }, [columnData]);

    // Tính tổng ngay tại local của cột
    const updateInputWeight = useCallback(
      (inputIdx, newValue, currentWorker) => {
        setInputs((prevInputs) => {
          const updated = [...prevInputs];
          updated[inputIdx] = {
            ...updated[inputIdx],
            weight: newValue,
            worker_id: currentWorker ? currentWorker.id : null,
            worker_name: currentWorker ? currentWorker.name : null,
            worker_color: currentWorker ? currentWorker.color : null,
          };

          // Tính kết quả tạm thời của cột
          const sum = updated.reduce(
            (acc, item) => acc + (Number(item.weight) || 0),
            0,
          );
          setResult(sum.toString());

          return updated;
        });
      },
      [],
    );
    console.log("column card rerender");
    return (
      <View style={cardStyle}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Cụm #{colIdx + 1}
        </Text>

        {inputs.map((inputItem, inputIdx) => {
          const isActive =
            isKeyboardVisible &&
            activeColIndex === colIdx &&
            activeInputIndex === inputIdx;
          const key = `${colIdx}-${inputIdx}`;

          return (
            <TextInput
              key={inputItem.id || inputIdx}
              ref={(el) => (inputRefs.current[key] = el)}
              style={{
                height: 28,
                borderWidth: 2,
                borderColor: isActive ? "#333" : "transparent",
                borderRadius: 6,
                paddingHorizontal: 10,
                marginBottom: 4,
                fontSize: 16,
                backgroundColor: inputItem.weight
                  ? inputItem.worker_color === DEFAULT_WORKER_COLOR
                    ? "#fff"
                    : inputItem.worker_color
                  : "#fff",
                color: "#333333",
                fontWeight: "600",
              }}
              placeholder={`Ô ${inputIdx + 1}`}
              placeholderTextColor="#aaa"
              keyboardType="numeric"
              value={inputItem.weight || ""}
              showSoftInputOnFocus={false}
              contextMenuHidden={true}
              selectTextOnFocus={false}
              caretHidden={true}
              onFocus={() =>
                onFocusInput(colIdx, inputIdx, inputItem, updateInputWeight)
              }
            />
          );
        })}

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
          <Text style={{ fontSize: 14, color: "#137333", fontWeight: "600" }}>
            Kết quả:
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#137333" }}>
            {result}
          </Text>
        </View>
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Tối ưu React.memo: Chỉ render lại cột này khi data thay đổi hoặc trạng thái active thay đổi
    return (
      prevProps.columnData === nextProps.columnData &&
      prevProps.activeColIndex === nextProps.activeColIndex &&
      prevProps.activeInputIndex === nextProps.activeInputIndex &&
      prevProps.isKeyboardVisible === nextProps.isKeyboardVisible
    );
  },
);
export default ColumnCard;
