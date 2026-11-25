import { CustomKeypadAdvanced } from "@/components";
import { DEFAULT_WORKER_COLOR } from "@/constants";
import {
  normalizeColumnData,
  useColumnStore,
  useColumnSumStore,
  useGlobalState,
} from "@/context";
import { usePathname } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ColumnCardDetail = ({
  colIdx,
  handleAddColumn,
  handleResetColumn,
  dataColumn,
}) => {
  const { currentWorker, setCurrentWorker, colorArray } = useGlobalState();

  const isActiveColumn = useColumnStore(
    (state) => state.activeColumnIndex === colIdx,
  );
  const setColumnSum = useColumnSumStore((state) => state.setColumnSum);
  const resetColumnSum = useColumnSumStore((state) => state.resetColumnSum);

  const setActiveColumn = useColumnStore((state) => state.setActiveColumn);
  const createEmptyInputs = (count = 5) =>
    Array.from({ length: count }, () => ({
      weight: "",
      worker_id: null,
      worker_name: null,
      worker_color: null,
    }));
  const [columnData, setColumnData] = useState(() =>
    normalizeColumnData(dataColumn),
  );

  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const translateY = useSharedValue(300);
  const inputRefs = useRef({});

  const showKeyboard = () => {
    setIsKeyboardVisible(true);
    translateY.value = withTiming(0, { duration: 200 });
  };

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const focusInput = useCallback(
    (inputIdx) => {
      setActiveInputIndex(inputIdx);
      const key = `${colIdx}-${inputIdx}`;
      if (inputRefs.current[key]) {
        inputRefs.current[key].focus();
      }
    },
    [colIdx],
  );

  const handleInputFocus = useCallback(
    (inputIdx, inputItem) => {
      setActiveColumn(colIdx);
      Keyboard.dismiss();
      setActiveInputIndex(inputIdx);
      showKeyboard();
      if (inputItem.worker_id && colorArray) {
        const foundWorker = colorArray.find(
          (w) => w.id === inputItem.worker_id,
        );
        if (foundWorker) {
          setCurrentWorker(foundWorker);
        }
      }
    },
    [colorArray, setCurrentWorker],
  );

  const hideKeyboard = () => {
    const key = `${colIdx}-${activeInputIndex}`;
    if (inputRefs.current[key]) {
      inputRefs.current[key].blur();
    }
  };
  const updateWeightValue = (newValue) => {
    setColumnData((prevData) => {
      const updatedInputs = prevData.inputs.map((item, idx) =>
        idx === activeInputIndex
          ? {
              ...item,
              weight: newValue,
              worker_id: currentWorker ? currentWorker.id : null,
              worker_name: currentWorker ? currentWorker.name : null,
              worker_color: currentWorker ? currentWorker.color : null,
            }
          : item,
      );

      const sum = updatedInputs.reduce(
        (acc, item) => acc + (Number(item.weight) || 0),
        0,
      );

      setColumnSum(prevData.id, sum);

      return {
        ...prevData,
        inputs: updatedInputs,
        result: sum.toString(),
      };
    });
  };
  const handleKeyPress = (num) => {
    const keyStr = String(num);

    setColumnData((prevData) => {
      const currentVal = String(
        prevData.inputs[activeInputIndex]?.weight ?? "",
      );

      // Đang là "0" mà bấm tiếp "0" -> bỏ qua, không nhận thêm
      if (currentVal === "0" && keyStr === "0") {
        return prevData;
      }

      // Đang là "0" mà bấm số khác -> thay hẳn thành số mới (vd: "0" + "5" -> "5")
      const nextVal = currentVal === "0" ? keyStr : currentVal + keyStr;

      const updatedInputs = prevData.inputs.map((item, idx) =>
        idx === activeInputIndex
          ? {
              ...item,
              weight: nextVal,
              worker_id: currentWorker ? currentWorker.id : null,
              worker_name: currentWorker ? currentWorker.name : null,
              worker_color: currentWorker ? currentWorker.color : null,
            }
          : item,
      );

      const sum = updatedInputs.reduce(
        (acc, item) => acc + (Number(item.weight) || 0),
        0,
      );

      setColumnSum(prevData.id, sum);

      return {
        ...prevData,
        inputs: updatedInputs,
        result: sum.toString(),
      };
    });
  };
  const handleDelete = () => {
    const currentVal = columnData.inputs[activeInputIndex]?.weight || "";
    if (currentVal.length > 0) {
      updateWeightValue(currentVal.slice(0, -1));
    }
  };

  const handlePrevInput = () => {
    if (activeInputIndex > 0) {
      focusInput(activeInputIndex - 1);
    }
  };

  const handleNextInput = () => {
    if (activeInputIndex < columnData.inputs.length - 1) {
      focusInput(activeInputIndex + 1);
    }
  };

  const addColumn = () => {
    handleAddColumn();
  };
  const resetColumn = () => {
    handleResetColumn();
    resetColumnSum(columnData.id);
    setColumnData({
      id: Date.now(),
      inputs: createEmptyInputs(5),
      result: 0,
    });
  };
  const pathname = usePathname();
  useEffect(() => {
    setIsKeyboardVisible(false);
  }, [pathname]);
  console.log("Column card rerender:", colIdx);

  useEffect(() => {
    if (dataColumn) {
      const normalized = normalizeColumnData(dataColumn);
      setColumnData(normalized);
      setColumnSum(normalized.id, Number(normalized.result) || 0);
    }
  }, []);
  return (
    <View style={{ width: "48%", marginBottom: 10 }}>
      <View
        style={{
          width: "100%",
          height: 248,
          backgroundColor: "#fff",
          borderRadius: 18,
          padding: 12,
          borderWidth: 1,
          borderColor: "#e1e4e8",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          marginBottom: 10,
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
          Cụm {colIdx + 1}
        </Text>

        {columnData.inputs &&
          columnData.inputs.map((inputItem, inputIdx) => {
            const isActive =
              isKeyboardVisible &&
              activeInputIndex === inputIdx &&
              isActiveColumn;
            const key = `${colIdx}-${inputIdx}`;

            return (
              <TextInput
                key={key}
                ref={(el) => (inputRefs.current[key] = el)}
                style={{
                  height: 28,
                  borderWidth: 2,
                  borderColor: isActive ? "#333" : "transparent",
                  borderRadius: 10,
                  paddingBottom: 0,
                  paddingTop: 0,
                  paddingLeft: 10,
                  textAlignVertical: "center",
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
                onFocus={() => handleInputFocus(inputIdx, inputItem)}
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
            {columnData.result || "0"}
          </Text>
        </View>
      </View>

      {isKeyboardVisible && isActiveColumn && (
        <CustomKeypadAdvanced
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onPrevInput={handlePrevInput}
          onNextInput={handleNextInput}
          onHideKeyboard={hideKeyboard}
          currentWorkerId={currentWorker?.id}
          isAdColumn={addColumn}
          isReset={resetColumn}
          isKeyboardVisible={isKeyboardVisible}
          setIsKeyboardVisible={setIsKeyboardVisible}
        />
      )}
    </View>
  );
};

export default memo(ColumnCardDetail);
