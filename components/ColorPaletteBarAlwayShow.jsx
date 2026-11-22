import { TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useGlobalState } from "../context";

export default function ColorPaletteBarAlwayShow() {
  const { setColor, colorArray, currentWorker, setCurrentWorker } =
    useGlobalState();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Animated.View
        style={[{ flexDirection: "row", alignItems: "center", gap: 8 }]}
      >
        {colorArray.map((c, i) => (
          <TouchableOpacity
            key={c.id || i}
            onPress={() => {
              setColor(c.color);
              setCurrentWorker(c);
            }}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: c.color,
              borderWidth: c.id == currentWorker.id ? 2 : 0,
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}
