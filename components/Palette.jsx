import { Plus } from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";

import { useGlobalState } from "../context";

export default function Palette({ setShowPalette, addColorModal }) {
  const { color, setColor, colorArray, setCurrentWorker } = useGlobalState();

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        transform: [{ translateY: -40 }],
        alignItems: "center",
        backgroundColor: "transparent",
        elevation: 6,
        gap: 10,
      }}
    >
      <View ref={addColorModal.anchorRef}>
        <TouchableOpacity
          onPress={() => {
            setShowPalette(false);
            addColorModal.open();
          }}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 28,
          }}
        >
          <Plus size={22} />
        </TouchableOpacity>
      </View>

      {colorArray.map(
        (c, i) =>
          c.color !== color && (
            <TouchableOpacity
              key={c.id || i}
              onPress={() => {
                setColor(c.color);
                setShowPalette(false);
                setCurrentWorker(c);
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: c.color,
                }}
              />
            </TouchableOpacity>
          ),
      )}
    </View>
  );
}
