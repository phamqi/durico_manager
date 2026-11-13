import { CustomKeypadAdvanced } from "@/components";
import { DEFAULT_WORKER_COLOR } from "@/constants";
import { useGlobalState } from "@/context";
import { usePathname } from "expo-router";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, Text, TextInput, View } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ColumnCard = ({ colIdx, handleAddColumn }) => {
  const {
    currentWorker,
    setCurrentWorker,
    colorArray,
    isActiveColumn,
    setIsActiveColumn,
  } = useGlobalState();

  const [columnData, setColumnData] = useState({
    id: Date.now(),
    inputs: Array(5).fill({
      weight: "",
      worker_id: null,
      worker_name: null,
      worker_color: null,
    }),
    result: "0",
  });

  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const lastWorkerIdRef = useRef(null);

  const translateY = useSharedValue(300);
  const inputRefs = useRef({});

  const showKeyboard = () => {
    if (isActiveColumn !== colIdx) {
      setIsKeyboardVisible(true);
      translateY.value = withTiming(0, { duration: 200 });
    }
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
      setIsActiveColumn(colIdx);
      Keyboard.dismiss();
      setActiveInputIndex(inputIdx);
      showKeyboard();
      if (inputItem.worker_id !== lastWorkerIdRef.current) {
        if (inputItem.worker_id && colorArray) {
          const foundWorker = colorArray.find(
            (w) => w.id === inputItem.worker_id,
          );
          if (foundWorker) {
            setCurrentWorker(foundWorker);
            lastWorkerIdRef.current = inputItem.worker_id;
          }
        }
      }
      // if (inputItem.worker_id && colorArray) {
      //   const foundWorker = colorArray.find(
      //     (w) => w.id === inputItem.worker_id,
      //   );
      //   if (foundWorker) {
      //     setCurrentWorker(foundWorker);
      //   }
      // }
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
      const updatedInputs = [...prevData.inputs];
      updatedInputs[activeInputIndex] = {
        ...updatedInputs[activeInputIndex],
        weight: newValue,
        worker_id: currentWorker ? currentWorker.id : null,
        worker_name: currentWorker ? currentWorker.name : null,
        worker_color: currentWorker ? currentWorker.color : null,
      };

      const sum = updatedInputs.reduce(
        (acc, item) => acc + (Number(item.weight) || 0),
        0,
      );

      const newData = {
        ...prevData,
        inputs: updatedInputs,
        result: sum.toString(),
      };
      return newData;
    });
  };

  const handleKeyPress = (num) => {
    const currentVal = columnData.inputs[activeInputIndex]?.weight || "";
    updateWeightValue(currentVal + num);
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

  const cardStyle = {
    width: "100%",
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
  };
  const addColumn = () => {
    handleAddColumn();
  };
  console.log("Column card rerender:", colIdx);
  const pathname = usePathname();

  useEffect(() => {
    setIsKeyboardVisible(false);
  }, [pathname]);
  return (
    <View style={{ width: "48%", marginBottom: 10 }}>
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

        {columnData.inputs &&
          columnData.inputs.map((inputItem, inputIdx) => {
            const isActive =
              isKeyboardVisible &&
              activeInputIndex === inputIdx &&
              isActiveColumn === colIdx;
            const key = `${colIdx}-${inputIdx}`;

            return (
              <TextInput
                key={key}
                ref={(el) => (inputRefs.current[key] = el)}
                style={{
                  height: 28,
                  borderWidth: 2,
                  borderColor: isActive ? "#333" : "transparent",
                  borderRadius: 6,
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

      {isKeyboardVisible && isActiveColumn === colIdx && (
        <CustomKeypadAdvanced
          onKeyPress={handleKeyPress}
          onDelete={handleDelete}
          onPrevInput={handlePrevInput}
          onNextInput={handleNextInput}
          onHideKeyboard={hideKeyboard}
          currentWorkerId={currentWorker?.id}
          isAdColumn={addColumn}
          isKeyboardVisible={isKeyboardVisible}
          setIsKeyboardVisible={setIsKeyboardVisible}
        />
      )}
    </View>
  );
};
function arePropsEqual(prevProps, nextProps) {
  return (
    prevProps.colIdx === nextProps.colIdx &&
    prevProps.isActiveColumn === nextProps.isActiveColumn &&
    prevProps.currentWorker === nextProps.currentWorker
  );
}
export default memo(ColumnCard, arePropsEqual);
