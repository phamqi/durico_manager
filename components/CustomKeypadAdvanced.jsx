import { useDuricoAlert, useGlobalState } from "@/context";
import {
  ChevronDown,
  ChevronUp,
  Delete,
  KeyboardOff,
  Plus,
  RotateCcw,
  ScanText,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CustomKeypadAdvanced({
  onKeyPress,
  onDelete,
  onPrevInput,
  onNextInput,
  onHideKeyboard,
}) {
  const { selectedType, setSelectedType, handleReset, addColumn } =
    useGlobalState();
  const alert = useDuricoAlert();
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [typeBtnLayout, setTypeBtnLayout] = useState(null);
  const typeBtnRef = useRef(null);

  // Animation riêng cho popup Chọn Type
  const popupScale = useRef(new Animated.Value(0.1)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const btnScaleX = useRef(new Animated.Value(1)).current;
  const btnScaleY = useRef(new Animated.Value(1)).current;
  const btnOpacity = useRef(new Animated.Value(1)).current;

  const transactionTypes = [
    { label: "Thu nhập", value: 0 },
    { label: "Ca phe", value: 1 },
    { label: "Sau rieng", value: 2 },
  ];

  const currentSelectedLabel =
    transactionTypes.find((t) => t.value === selectedType)?.label ||
    "Chọn loại";

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
      handleReset();
      setIsConfirmingReset(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#DFE3E6",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        overflow: "hidden",
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
          style={{ flex: 3, justifyContent: "space-between", marginRight: 6 }}
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
                  style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
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
                  style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
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
                  style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}
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
              <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
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
            onPress={addColumn}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold", color: "#333" }}>
              <Plus size={24} />
            </Text>
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

          {/* Bấm 1 lần ăn ngay, ẩn bàn phím lập tức */}
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#CFD8DC",
              margin: 3,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 6,
            }}
            onPress={onHideKeyboard}
          >
            <KeyboardOff />
          </TouchableOpacity>
        </View>
      </View>

      {/* POPUP CHỌN TYPE */}
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
                        color: selectedType === type.value ? "#137333" : "#333",
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
  );
}
