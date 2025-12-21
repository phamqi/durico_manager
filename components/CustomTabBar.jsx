import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAnchoredModalReanimated } from "../hooks/useAnchoreModal";

import { Portal } from "react-native-paper";
import { DELETE_PIN, PRESET_COLORS, PRICE_COLOR } from "../constants";
import { useDuricoAlert, useGlobalState } from "../context";

export default function CustomTabBar() {
  const pathname = usePathname();
  const isAddScreen = pathname === "/add";
  const insets = useSafeAreaInsets(); 

  const { color, setColor, colorArray, addWorker, updateWorker, removeWorker, addPrice } = useGlobalState();
  const [showPalette, setShowPalette] = useState(false);

  const [tempColor, setTempColor] = useState(null);
  const [tempName, setTempName] = useState("");
  const [isPrice, setIsPrice] = useState(false);

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
    } else {
      setColor("black");
      setTempColor("black");
      setTempName("");
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
          <TouchableOpacity 
            onPress={() => setShowPalette((v) => !v)}
            style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: color || "black",
                overflow: 'hidden'
              }}
            >
          </TouchableOpacity>

          {showPalette && !addColorModal.visible && (
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

      {/* modal them mau */}
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
                      setIsPrice(false);
                      setColor(c);
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
                        borderWidth: c === tempColor && !isPrice ? 2 : 1,
                        borderColor: c === tempColor && !isPrice ? "#000" : "#ccc",
                      }}
                    />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    setIsPrice(true);
                    setTempName("");
                  } }
                  style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: isPrice ? PRICE_COLOR.active : PRICE_COLOR.blur,
                        borderWidth: 1,
                        borderWidth: isPrice ? 2 : 1,
                        borderColor: isPrice ? "#000" : "#ccc",
                        alignItems: "center",
                        justifyContent: 'center'
                      }}
                  >
                  <MaterialIcons name="attach-money" size={24} color={PRICE_COLOR.icon} />
                </TouchableOpacity>
                </View>
                <TextInput
                  placeholder={
                    tempName ? undefined : isPrice ? "Nhập giá tiền" : "Nhập tên cho màu này"
                  }
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  value={tempName}
                  keyboardType={isPrice ? "numeric" : "default"}
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
                  <TouchableOpacity 
                  onPress={() => {
                    const existed = colorArray.find((c) => c.color === tempColor);
                    if (tempName === DELETE_PIN){
                      removeWorker(existed.id);
                      setTempName("");
                      setColor(colorArray[0]);
                      }else{
                      addColorModal.close();
                    }}}>
                    <Text>Huỷ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!tempName || tempName.trim() === "") {
                        alert.show(
                          {
                            title: "Thông báo",
                            message: isPrice ? "Vui lòng nhập giá tiền" : "Vui lòng nhập tên màu",
                            buttons: [{ text: "OK" }],
                //             buttons: [
                //   { text: "Huỷ" },
                //   { text: "OK", onPress: addWorker },
                // ],
                          }
                        )
                        return;
                      }
                      const existed = colorArray.find((c) => c.color === tempColor);
                      if(isPrice){
                        addPrice(tempName);
                        } else {
                          setColor(tempColor)
                          if(!existed){
                            addWorker(tempName.trim(), tempColor, 0);
                          } else {
                            updateWorker(existed.id, tempName.trim());
                          }
                      }
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