import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAnchoredModalReanimated } from "../hooks/useAnchoreModal";

import { Portal } from "react-native-paper";
import { PRESET_COLORS } from "../constants";
import { useDuricoAlert, useGlobalState } from "../context";

export default function CustomTabBar() {
  const pathname = usePathname();
  const isAddScreen = pathname === "/add";
  const insets = useSafeAreaInsets(); 

  const { color, setColor, colorArray, setColorArray, addWorker } = useGlobalState();
  const [showPalette, setShowPalette] = useState(false);

  const [showAddColor, setShowAddColor] = useState(false);
  const [tempColor, setTempColor] = useState(null);
  const [tempName, setTempName] = useState("");
  const getColorName = (hex) => {
  const found = colorArray.find((c) => c.color === hex);
    return found ? found.name : "";
  };

  const alert = useDuricoAlert();
  const addColorModal = useAnchoredModalReanimated();

  useEffect(() => {
    if (colorArray.length > 0 && !tempColor) {
      setColor(colorArray[0].color);
      setTempColor(colorArray[0].color);
      setTempName(colorArray[0].name || "");
    }
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        height: 44 + insets.bottom,
        paddingBottom: insets.bottom,
        borderTopWidth: 1,
        borderColor: "#ddd",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 28,
      }}
    >
      {isAddScreen ? (
        <View style={{ position: "relative" }}>
          <TouchableOpacity onPress={() => setShowPalette((v) => !v)}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: color || "black",
              }}
            />
          </TouchableOpacity>

          {showPalette && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                transform: [{translateY: -40}],
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
                  >
                  <MaterialCommunityIcons name="plus" size={22} />
                </TouchableOpacity>
              </View>
              {colorArray.map((c, i) => (
                c.color !== color && (
                  <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setColor(c.color);
                    setShowPalette(false);
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
                )
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={{ width: 28 }} />
      )}
      <TouchableOpacity
        hitSlop={10}
        onPress={() => {
          if (isAddScreen) {
            alert.show({
              title: "Alert Title",
              message: "Lorem ipsum dolor sit amet",
              buttons: [{ text: "OK" }],
  //             buttons: [
  //   { text: "Huỷ" },
  //   { text: "OK", onPress: addWorker },
  // ],

            })
          } else {
            router.push("/add");
          }
        }}
        style={{ marginLeft: "auto" }}
      >
        <MaterialCommunityIcons
          name={
            isAddScreen
              ? "checkbox-marked-outline"
              : "square-edit-outline"
          }
          size={28}
          color="black"
        />
      </TouchableOpacity>
      {addColorModal.visible && 
        (
          <Portal>
            <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Animated.View 
            style={[
              {
                width: 260,
                backgroundColor: "#fff",
                borderRadius: 12,
                padding: 16,
                gap: 12,
              }, addColorModal.animatedStyle,
            ]
            }
            
          >
              <Text style={{ fontWeight: "600", fontSize: 16 }}>
                Thêm màu mới
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 8,
                }}
              >
                {PRESET_COLORS.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => {
                      setTempColor(c);
                      const name = getColorName(c);
                      setTempName(name);
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: c,
                        borderWidth: c === tempColor ? 3 : 1,
                        borderColor: c === tempColor ? "#000" : "#ccc",
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                placeholder={
                  tempName ? undefined : "Nhập tên cho màu này"
                }
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={tempName}
                onChangeText={setTempName}
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  height: 40,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  gap: 20,
                }}
              >
                <TouchableOpacity onPress={() => addColorModal.close()}>
                  <Text>Huỷ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!tempName) {
                      Alert.alert("Lỗi", "Vui lòng nhập tên màu");
                      return;
                    }
                    setColorArray((prev) => {
                      const existed = prev.find((c) => c.color === tempColor);
                      if (existed) {
                        return prev.map((c) =>
                          c.color === tempColor
                            ? { ...c, name: tempName }
                            : c
                        );
                      }
                      return [...prev, { color: tempColor, name: tempName }];
                    });
                    setColor(tempColor);
                    addColorModal.close();
                    addWorker(tempName, tempColor, 0, 0);
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>Lưu</Text>
                </TouchableOpacity>
              </View>
          </Animated.View>
        </View>
        </Portal>
        )
      }
    </View>
  );
}