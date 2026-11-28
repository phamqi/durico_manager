// import { useDuricoAlert, useTransactionTypeStore } from "@/context";
// import {
//   ChevronDown,
//   ChevronUp,
//   Delete,
//   KeyboardOff,
//   Plus,
//   RotateCcw,
//   ScanText,
// } from "lucide-react-native";
// import { useEffect, useRef, useState } from "react";
// import {
//   Animated,
//   Modal,
//   Pressable,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Portal } from "react-native-paper";
// import {
//   runOnJS,
//   useAnimatedStyle,
//   useSharedValue,
//   withTiming,
// } from "react-native-reanimated";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function CustomKeypadAdvanced({
//   onKeyPress,
//   onDelete,
//   onPrevInput,
//   onNextInput,
//   onHideKeyboard,
//   isAdColumn,
//   isKeyboardVisible,
//   setIsKeyboardVisible,
//   isReset,
// }) {
//   const alert = useDuricoAlert();
//   const [showTypeModal, setShowTypeModal] = useState(false);
//   const [typeBtnLayout, setTypeBtnLayout] = useState(null);
//   const typeBtnRef = useRef(null);

//   const popupScale = useRef(new Animated.Value(0.1)).current;
//   const popupOpacity = useRef(new Animated.Value(0)).current;
//   const btnScaleX = useRef(new Animated.Value(1)).current;
//   const btnScaleY = useRef(new Animated.Value(1)).current;
//   const btnOpacity = useRef(new Animated.Value(1)).current;

//   const transactionTypes = [
//     { label: "Thu nhập", value: 0 },
//     { label: "Ca phe", value: 1 },
//     { label: "Sau rieng", value: 2 },
//   ];

//   const selectedType = useTransactionTypeStore((state) => state.selectedType);
//   const setSelectedType = useTransactionTypeStore(
//     (state) => state.setSelectedType,
//   );
//   const insets = useSafeAreaInsets();

//   const currentSelectedLabel =
//     transactionTypes.find((t) => t.value === selectedType)?.label ||
//     "Chọn loại";

//   const handleHideKeypad = () => {
//     translateY.value = withTiming(300, { duration: 200 }, (finished) => {
//       if (finished) {
//         runOnJS(setIsKeyboardVisible)(false);
//       }
//     });
//     onHideKeyboard();
//   };
//   const handleOpenTypeModal = () => {
//     if (typeBtnRef.current) {
//       typeBtnRef.current.measureInWindow((x, y, width, height) => {
//         setTypeBtnLayout({ x, y, width, height });

//         popupScale.setValue(0.1);
//         popupOpacity.setValue(0);
//         btnScaleX.setValue(1);
//         btnScaleY.setValue(1);
//         btnOpacity.setValue(1);

//         setShowTypeModal(true);

//         requestAnimationFrame(() => {
//           Animated.sequence([
//             Animated.parallel([
//               Animated.timing(btnScaleX, {
//                 toValue: 1.5,
//                 duration: 250,
//                 useNativeDriver: true,
//               }),
//               Animated.timing(btnScaleY, {
//                 toValue: 1.1,
//                 duration: 200,
//                 useNativeDriver: true,
//               }),
//               Animated.timing(btnOpacity, {
//                 toValue: 0,
//                 duration: 200,
//                 useNativeDriver: true,
//               }),
//             ]),
//             Animated.parallel([
//               Animated.spring(popupScale, {
//                 toValue: 1,
//                 friction: 6,
//                 tension: 80,
//                 useNativeDriver: true,
//               }),
//               Animated.timing(popupOpacity, {
//                 toValue: 1,
//                 duration: 250,
//                 useNativeDriver: true,
//               }),
//             ]),
//           ]).start();
//         });
//       });
//     }
//   };

//   const handleCloseTypeModal = () => {
//     Animated.parallel([
//       Animated.timing(popupScale, {
//         toValue: 0.15,
//         duration: 150,
//         useNativeDriver: true,
//       }),
//       Animated.timing(popupOpacity, {
//         toValue: 0,
//         duration: 120,
//         useNativeDriver: true,
//       }),
//       Animated.timing(btnScaleX, {
//         toValue: 1,
//         duration: 180,
//         useNativeDriver: true,
//       }),
//       Animated.timing(btnScaleY, {
//         toValue: 1,
//         duration: 180,
//         useNativeDriver: true,
//       }),
//       Animated.timing(btnOpacity, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setShowTypeModal(false);
//     });
//   };

//   const [isConfirmingReset, setIsConfirmingReset] = useState(false);

//   const handleResetPress = () => {
//     if (!isConfirmingReset) {
//       setIsConfirmingReset(true);
//       alert.toast("Chạm lần nữa để làm mới");
//       setTimeout(() => {
//         setIsConfirmingReset(false);
//       }, 3000);
//     } else {
//       isReset();
//       setIsConfirmingReset(false);
//     }
//   };

//   const translateY = useSharedValue(300);
//   console.log("custom keypad rerender");
//   const animatedKeyboardStyle = useAnimatedStyle(() => ({
//     transform: [{ translateY: translateY.value }],
//   }));
//   useEffect(() => {
//     if (isKeyboardVisible) {
//       translateY.value = withTiming(0, { duration: 200 });
//     }
//   }, [isKeyboardVisible]);

//   const handelAddColumn = () => {
//     isAdColumn();
//   };
//   return (
//     <Portal>
//       <Animated.View
//         style={[
//           {
//             position: "absolute",
//             bottom: 52 + insets.bottom,
//             left: 0,
//             right: 0,
//             zIndex: 999,
//           },
//           animatedKeyboardStyle,
//         ]}
//         pointerEvents="box-none"
//       >
//         <View
//           style={{
//             backgroundColor: "#DFE3E6",
//             // position: "absolute",
//             // bottom: 0,
//             // left: 0,
//             // right: 0,
//             borderTopLeftRadius: 15,
//             borderTopRightRadius: 15,
//             overflow: "hidden",
//             height: 270,
//           }}
//         >
//           {/* THANH CÔNG CỤ TRÊN CÙNG */}
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               backgroundColor: "#DFE3E6",
//               paddingHorizontal: 40,
//               paddingVertical: 8,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 14, fontWeight: "500", color: "#333" }}>
//               {currentSelectedLabel}
//             </Text>
//             <TouchableOpacity
//               style={{ backgroundColor: "transparent", borderRadius: 6 }}
//               onPress={handleResetPress}
//             >
//               <RotateCcw
//                 size={24}
//                 style={{
//                   color: "#FF3B30",
//                   opacity: isConfirmingReset ? 1 : 0.7,
//                 }}
//               />
//             </TouchableOpacity>
//           </View>

//           {/* KHU VỰC BÀN PHÍM */}
//           <View style={{ flexDirection: "row", height: 230, padding: 6 }}>
//             {/* KHỐI TRÁI: Bàn phím số (3 cột) */}
//             <View
//               style={{
//                 flex: 3,
//                 justifyContent: "space-between",
//                 marginRight: 6,
//               }}
//             >
//               <View style={{ flexDirection: "row", flex: 1 }}>
//                 {["1", "2", "3"].map((num) => (
//                   <TouchableOpacity
//                     key={num}
//                     style={{
//                       flex: 1,
//                       backgroundColor: "#FFF",
//                       margin: 3,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       borderRadius: 6,
//                       elevation: 1,
//                     }}
//                     onPress={() => onKeyPress(num)}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 18,
//                         fontWeight: "bold",
//                         color: "#333",
//                       }}
//                     >
//                       {num}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <View style={{ flexDirection: "row", flex: 1 }}>
//                 {["4", "5", "6"].map((num) => (
//                   <TouchableOpacity
//                     key={num}
//                     style={{
//                       flex: 1,
//                       backgroundColor: "#FFF",
//                       margin: 3,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       borderRadius: 6,
//                       elevation: 1,
//                     }}
//                     onPress={() => onKeyPress(num)}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 18,
//                         fontWeight: "bold",
//                         color: "#333",
//                       }}
//                     >
//                       {num}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <View style={{ flexDirection: "row", flex: 1 }}>
//                 {["7", "8", "9"].map((num) => (
//                   <TouchableOpacity
//                     key={num}
//                     style={{
//                       flex: 1,
//                       backgroundColor: "#FFF",
//                       margin: 3,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       borderRadius: 6,
//                       elevation: 1,
//                     }}
//                     onPress={() => onKeyPress(num)}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 18,
//                         fontWeight: "bold",
//                         color: "#333",
//                       }}
//                     >
//                       {num}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>

//               <View style={{ flexDirection: "row", flex: 1 }}>
//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#FFF",
//                     margin: 3,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: 6,
//                   }}
//                   onPress={onPrevInput}
//                 >
//                   <ChevronUp />
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#FFF",
//                     margin: 3,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: 6,
//                     elevation: 1,
//                   }}
//                   onPress={() => onKeyPress("0")}
//                 >
//                   <Text
//                     style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
//                   >
//                     0
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#FFF",
//                     margin: 3,
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: 6,
//                   }}
//                   onPress={onNextInput}
//                 >
//                   <ChevronDown />
//                 </TouchableOpacity>
//               </View>
//             </View>
//             <View style={{ flex: 1, justifyContent: "space-between" }}>
//               <Animated.View
//                 style={{
//                   flex: 1,
//                   margin: 3,
//                   transform: [{ scaleX: btnScaleX }, { scaleY: btnScaleY }],
//                   opacity: btnOpacity,
//                 }}
//               >
//                 <TouchableOpacity
//                   ref={typeBtnRef}
//                   collapsable={false}
//                   style={{
//                     flex: 1,
//                     backgroundColor: "#FFF",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     borderRadius: 6,
//                     width: "100%",
//                   }}
//                   onPress={handleOpenTypeModal}
//                 >
//                   <ScanText />
//                 </TouchableOpacity>
//               </Animated.View>

//               <TouchableOpacity
//                 style={{
//                   flex: 1,
//                   backgroundColor: "#BBDEFB",
//                   margin: 3,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: 6,
//                 }}
//                 onPress={handelAddColumn}
//               >
//                 <Text
//                   style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}
//                 >
//                   <Plus size={24} />
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={{
//                   flex: 1,
//                   backgroundColor: "#FFCDD2",
//                   margin: 3,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: 6,
//                 }}
//                 onPress={onDelete}
//               >
//                 <Delete />
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={{
//                   flex: 1,
//                   backgroundColor: "#CFD8DC",
//                   margin: 3,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   borderRadius: 6,
//                 }}
//                 onPress={handleHideKeypad}
//               >
//                 <KeyboardOff />
//               </TouchableOpacity>
//             </View>
//           </View>
//           <Modal visible={showTypeModal} transparent animationType="none">
//             <Pressable style={{ flex: 1 }} onPress={handleCloseTypeModal}>
//               {typeBtnLayout && (
//                 <Animated.View
//                   style={{
//                     position: "absolute",
//                     top: typeBtnLayout.y,
//                     left: typeBtnLayout.x + typeBtnLayout.width - 180,
//                     width: 180,
//                     backgroundColor: "rgba(255, 255, 255, 0.8)",
//                     borderRadius: 12,
//                     padding: 10,
//                     transform: [
//                       {
//                         translateX: popupScale.interpolate({
//                           inputRange: [0.15, 1],
//                           outputRange: [-20, 0],
//                         }),
//                       },
//                       {
//                         translateY: popupScale.interpolate({
//                           inputRange: [0.15, 1],
//                           outputRange: [35, 0],
//                         }),
//                       },
//                       { scale: popupScale },
//                     ],
//                     opacity: popupOpacity,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontWeight: "600",
//                       fontSize: 13,
//                       textAlign: "center",
//                       marginBottom: 4,
//                       color: "#444",
//                     }}
//                   >
//                     Chọn giao dịch
//                   </Text>
//                   {transactionTypes.map((type) => (
//                     <View
//                       key={type.value}
//                       style={{ backgroundColor: "transparent" }}
//                     >
//                       <TouchableOpacity
//                         style={{
//                           padding: 10,
//                           borderRadius: 6,
//                           backgroundColor: "transparent",
//                         }}
//                         onPress={() => {
//                           setSelectedType(type.value);
//                           handleCloseTypeModal();
//                         }}
//                       >
//                         <Text
//                           style={{
//                             fontSize: 13,
//                             color:
//                               selectedType === type.value ? "#137333" : "#333",
//                             fontWeight:
//                               selectedType === type.value ? "bold" : "normal",
//                           }}
//                         >
//                           {type.label}
//                         </Text>
//                       </TouchableOpacity>
//                     </View>
//                   ))}
//                 </Animated.View>
//               )}
//             </Pressable>
//           </Modal>
//         </View>
//       </Animated.View>
//     </Portal>
//   );
// }
import {
  useColumnStore,
  useDuricoAlert,
  useTransactionTypeStore,
} from "@/context";
import { BlurMask, Canvas, Path, Skia } from "@shopify/react-native-skia";
import {
  ChevronDown,
  ChevronUp,
  Delete,
  KeyboardOff,
  RotateCcw,
  ScanText,
} from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";
import {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PATH_PLUS = Skia.Path.MakeFromSVGString("M12 5v14 M5 12h14");
const PATH_X = Skia.Path.MakeFromSVGString("M18 6 6 18 M6 6l12 12");
const PATH_K = Skia.Path.MakeFromSVGString(
  "M 7 5 v 14 M 17 5 l -10 9 M 11 11 L 17 19",
);
const modeToIndex = (mode) => {
  if (mode === "add") return 0;
  if (mode === "multiply") return 1;
  return 2;
};

const indexToPath = (idx) => {
  "worklet";
  if (idx === 0) return PATH_PLUS;
  if (idx === 1) return PATH_X;
  return PATH_K;
};

// Giữ index icon lần cuối cùng across mount/unmount của Portal bàn phím
let globalLastModeIndex = null;

const MorphKeyIcon = ({ mode }) => {
  const targetIndex = modeToIndex(mode);
  const initialStart =
    globalLastModeIndex !== null ? globalLastModeIndex : targetIndex;
  const shouldAnimateOnMount = initialStart !== targetIndex;

  const prevModeIndexRef = useRef(initialStart);
  const startIndex = useSharedValue(initialStart);
  const endIndex = useSharedValue(targetIndex);
  const progress = useSharedValue(shouldAnimateOnMount ? 0 : 1);

  useEffect(() => {
    if (shouldAnimateOnMount && prevModeIndexRef.current !== targetIndex) {
      startIndex.value = prevModeIndexRef.current;
      endIndex.value = targetIndex;
      prevModeIndexRef.current = targetIndex;
      globalLastModeIndex = targetIndex;

      progress.value = 0;
      progress.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      return;
    }

    globalLastModeIndex = targetIndex;

    if (prevModeIndexRef.current === targetIndex) return;

    startIndex.value = prevModeIndexRef.current;
    endIndex.value = targetIndex;
    prevModeIndexRef.current = targetIndex;

    progress.value = 0;
    progress.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [targetIndex, shouldAnimateOnMount, startIndex, endIndex, progress]);

  const blurRadius = useDerivedValue(() => {
    return interpolate(progress.value, [0, 0.5, 1], [0, 4, 0], "clamp");
  });

  const activePath = useDerivedValue(() => {
    const idx = progress.value >= 0.5 ? endIndex.value : startIndex.value;
    return indexToPath(idx);
  });

  return (
    <Canvas style={{ width: 24, height: 24 }}>
      <Path
        path={activePath}
        style="stroke"
        strokeWidth={2}
        strokeCap="round"
        strokeJoin="round"
        color="#333333"
      >
        <BlurMask blur={blurRadius} style="normal" />
      </Path>
    </Canvas>
  );
};

export default function CustomKeypadAdvanced({
  onKeyPress,
  onDelete,
  onPrevInput,
  onNextInput,
  onHideKeyboard,
  isAdColumn,
  isKeyboardVisible,
  setIsKeyboardVisible,
  isReset,
}) {
  const alert = useDuricoAlert();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeBtnLayout, setTypeBtnLayout] = useState(null);
  const typeBtnRef = useRef(null);

  const popupScale = useRef(new Animated.Value(0.1)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const btnScaleX = useRef(new Animated.Value(1)).current;
  const btnScaleY = useRef(new Animated.Value(1)).current;
  const btnOpacity = useRef(new Animated.Value(1)).current;

  const transactionTypes = [
    { label: "Thu nhập", value: 0 },
    { label: "Cà phê", value: 1 },
    { label: "Sầu riêng", value: 2 },
  ];

  const selectedType = useTransactionTypeStore((state) => state.selectedType);
  const setSelectedType = useTransactionTypeStore(
    (state) => state.setSelectedType,
  );
  const keyMode = useColumnStore((state) => state.keyMode ?? "add");
  const insets = useSafeAreaInsets();

  const currentSelectedLabel =
    transactionTypes.find((t) => t.value === selectedType)?.label ||
    "Chọn loại";

  const translateY = useSharedValue(300);

  const handleHideKeypad = () => {
    translateY.value = withTiming(300, { duration: 200 }, (finished) => {
      if (finished) {
        runOnJS(setIsKeyboardVisible)(false);
      }
    });
    onHideKeyboard();
  };

  const handleOpenTypeModal = () => {
    if (typeBtnRef.current) {
      typeBtnRef.current.measureInWindow((x, y, width, height) => {
        setTypeBtnLayout({ x, y, width, height });

        popupScale.setValue(0.1);
        popupOpacity.setValue(0);
        btnScaleX.setValue(1);
        btnScaleY.setValue(1);
        btnOpacity.setValue(1);

        setShowTypeModal(true);

        requestAnimationFrame(() => {
          Animated.sequence([
            Animated.parallel([
              Animated.timing(btnScaleX, {
                toValue: 1.5,
                duration: 250,
                useNativeDriver: true,
              }),
              Animated.timing(btnScaleY, {
                toValue: 1.1,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(btnOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
              }),
            ]),
            Animated.parallel([
              Animated.spring(popupScale, {
                toValue: 1,
                friction: 6,
                tension: 80,
                useNativeDriver: true,
              }),
              Animated.timing(popupOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
              }),
            ]),
          ]).start();
        });
      });
    }
  };

  const handleCloseTypeModal = () => {
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 0.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(btnScaleX, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(btnScaleY, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(btnOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowTypeModal(false);
    });
  };

  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  const handleResetPress = () => {
    if (!isConfirmingReset) {
      setIsConfirmingReset(true);
      alert.toast("Chạm lần nữa để làm mới");
      setTimeout(() => {
        setIsConfirmingReset(false);
      }, 3000);
    } else {
      isReset();
      setIsConfirmingReset(false);
    }
  };

  const animatedKeyboardStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (isKeyboardVisible) {
      translateY.value = withTiming(0, { duration: 200 });
    }
  }, [isKeyboardVisible]);

  const handleSpecialKeyPress = () => {
    if (keyMode === "add") {
      isAdColumn?.();
      return;
    }
    onKeyPress(keyMode === "multiply" ? "x" : "k");
  };

  return (
    <Portal>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 52 + insets.bottom,
            left: 0,
            right: 0,
            zIndex: 999,
          },
          animatedKeyboardStyle,
        ]}
        pointerEvents="box-none"
      >
        <View
          style={{
            backgroundColor: "#DFE3E6",
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            overflow: "hidden",
            height: 270,
          }}
        >
          {/* THANH CÔNG CỤ TRÊN CÙNG */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#DFE3E6",
              paddingHorizontal: 40,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: "500", color: "#333" }}>
              {currentSelectedLabel}
            </Text>
            <TouchableOpacity
              style={{ backgroundColor: "transparent", borderRadius: 6 }}
              onPress={handleResetPress}
            >
              <RotateCcw
                size={24}
                style={{
                  color: "#FF3B30",
                  opacity: isConfirmingReset ? 1 : 0.7,
                }}
              />
            </TouchableOpacity>
          </View>

          {/* KHU VỰC BÀN PHÍM */}
          <View style={{ flexDirection: "row", height: 230, padding: 6 }}>
            {/* KHỐI TRÁI: Bàn phím số (3 cột) */}
            <View
              style={{
                flex: 3,
                justifyContent: "space-between",
                marginRight: 6,
              }}
            >
              <View style={{ flexDirection: "row", flex: 1 }}>
                {["1", "2", "3"].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF",
                      margin: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      elevation: 1,
                    }}
                    onPress={() => onKeyPress(num)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                {["4", "5", "6"].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF",
                      margin: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      elevation: 1,
                    }}
                    onPress={() => onKeyPress(num)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                {["7", "8", "9"].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={{
                      flex: 1,
                      backgroundColor: "#FFF",
                      margin: 3,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 6,
                      elevation: 1,
                    }}
                    onPress={() => onKeyPress(num)}
                  >
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        color: "#333",
                      }}
                    >
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: "row", flex: 1 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    margin: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                  }}
                  onPress={onPrevInput}
                >
                  <ChevronUp />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    margin: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                    elevation: 1,
                  }}
                  onPress={() => onKeyPress("0")}
                >
                  <Text
                    style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
                  >
                    0
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    margin: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                  }}
                  onPress={onNextInput}
                >
                  <ChevronDown />
                </TouchableOpacity>
              </View>
            </View>

            {/* KHỐI PHẢI */}
            <View style={{ flex: 1, justifyContent: "space-between" }}>
              <Animated.View
                style={{
                  flex: 1,
                  margin: 3,
                  transform: [{ scaleX: btnScaleX }, { scaleY: btnScaleY }],
                  opacity: btnOpacity,
                }}
              >
                <TouchableOpacity
                  ref={typeBtnRef}
                  collapsable={false}
                  style={{
                    flex: 1,
                    backgroundColor: "#FFF",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 6,
                    width: "100%",
                  }}
                  onPress={handleOpenTypeModal}
                >
                  <ScanText />
                </TouchableOpacity>
              </Animated.View>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#BBDEFB",
                  margin: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
                onPress={handleSpecialKeyPress}
              >
                <MorphKeyIcon mode={keyMode} />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#FFCDD2",
                  margin: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
                onPress={onDelete}
              >
                <Delete />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#CFD8DC",
                  margin: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 6,
                }}
                onPress={handleHideKeypad}
              >
                <KeyboardOff />
              </TouchableOpacity>
            </View>
          </View>

          <Modal visible={showTypeModal} transparent animationType="none">
            <Pressable style={{ flex: 1 }} onPress={handleCloseTypeModal}>
              {typeBtnLayout && (
                <Animated.View
                  style={{
                    position: "absolute",
                    top: typeBtnLayout.y,
                    left: typeBtnLayout.x + typeBtnLayout.width - 180,
                    width: 180,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 12,
                    padding: 10,
                    transform: [
                      {
                        translateX: popupScale.interpolate({
                          inputRange: [0.15, 1],
                          outputRange: [-20, 0],
                        }),
                      },
                      {
                        translateY: popupScale.interpolate({
                          inputRange: [0.15, 1],
                          outputRange: [35, 0],
                        }),
                      },
                      { scale: popupScale },
                    ],
                    opacity: popupOpacity,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "600",
                      fontSize: 13,
                      textAlign: "center",
                      marginBottom: 4,
                      color: "#444",
                    }}
                  >
                    Chọn giao dịch
                  </Text>
                  {transactionTypes.map((type) => (
                    <View
                      key={type.value}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          backgroundColor: "transparent",
                        }}
                        onPress={() => {
                          setSelectedType(type.value);
                          handleCloseTypeModal();
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color:
                              selectedType === type.value ? "#137333" : "#333",
                            fontWeight:
                              selectedType === type.value ? "bold" : "normal",
                          }}
                        >
                          {type.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </Animated.View>
              )}
            </Pressable>
          </Modal>
        </View>
      </Animated.View>
    </Portal>
  );
}
