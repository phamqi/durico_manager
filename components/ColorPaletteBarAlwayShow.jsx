import { TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useWorkerStore } from "../context";

export default function ColorPaletteBarAlwayShow() {
  const colorArray = useWorkerStore.getState().colorArray;
  const currentWorker = useWorkerStore((state) => state.currentWorker);
  const setCurrentWorker = useWorkerStore((state) => state.setCurrentWorker);
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Animated.View
        entering={FadeIn.duration(350)}
        style={[{ flexDirection: "row", alignItems: "center", gap: 8 }]}
      >
        {colorArray.map((c, i) => (
          <TouchableOpacity
            key={c.id || i}
            onPress={() => {
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
