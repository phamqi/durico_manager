import { useMemo } from "react";
import { TouchableOpacity } from "react-native";
import { useGlobalState } from "../context";

// Nhận thêm `showPalette` (nếu cần dùng) và `setShowPalette` từ props
export default function ButtonShowColor({ isTouch }) {
  const { colorArray, currentWorker } = useGlobalState();

  const TouchShowPalette = () => {
    isTouch();
  };

  useMemo(() => {
    console.log("button show color rerender");
  }, [colorArray]);
  return (
    <TouchableOpacity
      onPress={TouchShowPalette}
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: currentWorker?.color || "#bd3273",
        overflow: "hidden",
      }}
    ></TouchableOpacity>
  );
}
