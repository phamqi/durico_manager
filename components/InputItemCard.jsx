import { DEFAULT_WORKER_COLOR } from "@/constants";
import React from "react";
import { TextInput } from "react-native";

// Dùng React.memo để ngăn component re-render nếu props của nó không thay đổi
const InputItemCard = React.memo(
  ({ colIdx, inputIdx, inputItem, isActive, inputRefs, onFocusInput }) => {
    const key = `${colIdx}-${inputIdx}`;

    return (
      <TextInput
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
          backgroundColor:
            inputItem.worker_color === DEFAULT_WORKER_COLOR
              ? "#fff"
              : inputItem.worker_color || "#fff",
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
        onFocus={() => onFocusInput(colIdx, inputIdx, inputItem)}
      />
    );
  },
);

export default InputItemCard;
