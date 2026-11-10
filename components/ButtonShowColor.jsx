import { DEFAULT_WORKER_COLOR } from "@/constants";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { useGlobalState } from "../context";

export default function ButtonShowColor({ isTouch }) {
  const { colorArray, currentWorker } = useGlobalState();

  const TouchShowPalette = () => {
    isTouch();
  };

  useEffect(() => {}, [currentWorker]);
  return (
    <TouchableOpacity
      onPress={TouchShowPalette}
      style={{
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: currentWorker?.color || DEFAULT_WORKER_COLOR,
        overflow: "hidden",
      }}
    ></TouchableOpacity>
  );
}
