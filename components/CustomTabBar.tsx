import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router, usePathname } from "expo-router";
import { TouchableOpacity, View } from "react-native";
export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const pathname = usePathname();
  const isAddScreen = pathname === "/add";

  return (
    <View
      style={{
        flexDirection: "row",
        height: 48,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
      }}
    >
      {isAddScreen ? (
        <TouchableOpacity onPress={() => console.log("Pick color")}>
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 20,
              backgroundColor: "red",
            }}
          />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}

      <TouchableOpacity
        onPress={() => {
          if (isAddScreen) {
            console.log("Save data");
            // Gửi event nếu cần
          } else {
            router.push("./add");
          }
        }}
        style={{
            marginLeft: 'auto',
        }}
      >
            <FontAwesome6 name={isAddScreen ? "square-check" : "pen-to-square"} size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}