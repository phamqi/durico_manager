import { router, usePathname } from "expo-router";
import { PiggyBank, SquareCheckBig, SquarePen } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DELETE_PIN, PRESET_COLORS, PRICE_COLOR } from "../constants";
import { useGlobalState } from "../context";
import { useAnchoredModalReanimated } from "../hooks/useAnchoreModal";
import Palette from "./Palette";

export default function CustomTabBar() {
  const pathname = usePathname();
  const isAddScreen = pathname === "/add";
  const insets = useSafeAreaInsets();

  const {
    color,
    setColor,
    colorArray,
    addWorker,
    updateWorker,
    removeWorker,
    createAmountContext,
    amount,
    currentWorker,
    setCurrentWorker,
    columnsData,
    createTransaction,
    getTransactionsData,
  } = useGlobalState();
  const [showPalette, setShowPalette] = useState(false);

  const [tempColor, setTempColor] = useState(null);
  const [tempName, setTempName] = useState("");
  const [isPrice, setIsPrice] = useState(false);

  const getColorName = (hex) => {
    const found = colorArray.find((c) => c.color === hex);
    return found ? found.name : "";
  };

  const addColorModal = useAnchoredModalReanimated();

  useEffect(() => {
    if (colorArray.length > 0 && !tempColor) {
      setColor(colorArray[0].color);
      setTempColor(colorArray[0].color);
      setTempName(colorArray[0].name || "");
    } else {
      setColor(PRESET_COLORS[0]);
      setTempColor(PRESET_COLORS[0]);
      setTempName("");
    }
  }, []);
  useEffect(() => {
    if (addColorModal?.visible) {
      addColorModal.close();
    }
  }, [pathname]);
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
              backgroundColor: currentWorker?.color || PRESET_COLORS[0],
              overflow: "hidden",
            }}
          ></TouchableOpacity>

          {showPalette && (
            <Palette
              setShowPalette={setShowPalette}
              addColorModal={addColorModal}
            />
            // <View
            //   style={{
            //     position: "absolute",
            //     bottom: 0,
            //     left: 0,
            //     transform: [{ translateY: -40 }],
            //     alignItems: "center",
            //     backgroundColor: "transparent",
            //     elevation: 6,
            //     gap: 10,
            //   }}
            // >
            //   <View ref={addColorModal.anchorRef}>
            //     <TouchableOpacity
            //       onPress={() => {
            //         setShowPalette(false);
            //         addColorModal.open();
            //       }}
            //       style={{
            //         alignItems: "center",
            //         justifyContent: "center",
            //         width: 28,
            //       }}
            //     >
            //       <Plus size={22} />
            //     </TouchableOpacity>
            //   </View>
            //   {colorArray.map(
            //     (c, i) =>
            //       c.color !== color && (
            //         <TouchableOpacity
            //           key={i}
            //           onPress={() => {
            //             setColor(c.color);
            //             setShowPalette(false);
            //             setCurrentWorker(c);
            //           }}
            //         >
            //           <View
            //             style={{
            //               width: 28,
            //               height: 28,
            //               borderRadius: 14,
            //               backgroundColor: c.color,
            //             }}
            //           />
            //         </TouchableOpacity>
            //       ),
            //   )}
            // </View>
          )}
        </View>
      ) : (
        <View style={{ width: 28 }} />
      )}
      <TouchableOpacity
        hitSlop={10}
        onPress={() => {
          if (isAddScreen) {
            createTransaction();
          } else {
            router.push("/add");
          }
        }}
        style={{ marginLeft: "auto" }}
      >
        {isAddScreen ? <SquareCheckBig size={28} /> : <SquarePen size={28} />}
      </TouchableOpacity>

      {addColorModal.visible && (
        <Portal>
          <Animated.View
            style={[
              {
                position: "absolute",
                width: addColorModal.MAX_RADIUS * 2,
                height: addColorModal.MAX_RADIUS * 2,
                borderRadius: addColorModal.MAX_RADIUS,
                backgroundColor: "#00000022",
                left: addColorModal.SCREEN_WIDTH / 2 - addColorModal.MAX_RADIUS,
                top: addColorModal.SCREEN_HEIGHT / 2 - addColorModal.MAX_RADIUS,
              },
              addColorModal.backdropStyle,
            ]}
          >
            <Pressable
              onPress={() => addColorModal.close()}
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                backgroundColor: "#00000022",
              }}
            />
          </Animated.View>
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
                },
                addColorModal.animatedStyle,
              ]}
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
                        borderColor:
                          c === tempColor && !isPrice ? "#000" : "#ccc",
                      }}
                    />
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => {
                    setIsPrice(true);
                    setTempName(
                      amount !== undefined && amount !== null
                        ? amount.toString()
                        : "",
                    );
                  }}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isPrice
                      ? PRICE_COLOR.active
                      : PRICE_COLOR.blur,
                    borderWidth: 1,
                    borderWidth: isPrice ? 2 : 1,
                    borderColor: isPrice ? "#000" : "#ccc",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PiggyBank size={20} color={PRICE_COLOR.icon} />
                </TouchableOpacity>
              </View>
              <TextInput
                placeholder={
                  tempName
                    ? undefined
                    : isPrice
                      ? "Nhập giá tiền"
                      : "Nhập tên cho màu này"
                }
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={tempName}
                keyboardType={isPrice ? "numeric" : "default"}
                onChangeText={setTempName}
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                textContentType="none"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  height: 40,
                  fontSize: 14,
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
                    const existed = colorArray.find(
                      (c) => c.color === tempColor,
                    );
                    if (tempName === DELETE_PIN) {
                      removeWorker(existed.id);
                      setTempName("");
                      setColor(colorArray[0]);
                    } else {
                      addColorModal.close();
                    }
                  }}
                >
                  <Text
                    style={{ color: tempName === DELETE_PIN ? "red" : "black" }}
                  >
                    {tempName === DELETE_PIN ? "Xóa" : "Huỷ"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const existed = colorArray.find(
                      (c) => c.color === tempColor,
                    );
                    if (isPrice) {
                      createAmountContext(tempName);
                    } else {
                      if (!existed) {
                        addWorker(tempName, tempColor, 0);
                      } else {
                        updateWorker(existed.id, tempName);
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
      )}
    </View>
  );
}
