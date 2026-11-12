import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { DEFAULT_WORKER, DELETE_PIN } from "../constants";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const AddColorInput = forwardRef(
  ({ isPrice, currentWorker, amount, onDelete }, ref) => {
    const [tempName, setTempName] = useState("");
    const animValue = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      getValue: () => {
        return tempName;
      },
    }));

    const isDeleteMode = tempName === DELETE_PIN;

    useEffect(() => {
      Animated.timing(animValue, {
        toValue: isDeleteMode ? 1 : 0,
        duration: 280,
        useNativeDriver: false, // Bắt buộc false vì animate width %
      }).start();
    }, [isDeleteMode]);

    const inputWidth = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["100%", "73%"],
    });

    const buttonOpacity = animValue;
    const buttonScale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 1],
    });
    const handleDelete = async () => {
      await onDelete();
      setTempName("");
    };
    useEffect(() => {
      if (isPrice) {
        if (amount !== undefined && amount !== null && amount !== "") {
          setTempName(String(amount));
        } else {
          setTempName("");
        }
      } else {
        if (currentWorker?.name) {
          setTempName(currentWorker.name);
        } else {
          setTempName("");
        }
      }
    }, [currentWorker, isPrice, amount]);

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 0,
          borderColor: isDeleteMode ? "red" : "#ccc",
          borderRadius: 0,
          height: 40,
          backgroundColor: "#fff",
          overflow: "hidden",
          gap: 4,
        }}
      >
        <AnimatedTextInput
          placeholder={isPrice ? "Nhập giá tiền" : "Nhập tên cho màu này"}
          placeholderTextColor="rgba(0,0,0,0.4)"
          value={tempName}
          keyboardType={isPrice ? "numeric" : "default"}
          onChangeText={setTempName}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          editable={tempName !== DEFAULT_WORKER.name}
          style={{
            width: inputWidth,
            fontSize: 14,
            height: "100%",
            borderWidth: 1,
            borderRadius: 8,
            paddingLeft: 10,
          }}
        />

        {isDeleteMode && (
          <Animated.View
            style={{
              flex: 1,
              height: "100%",
              opacity: buttonOpacity,
              transform: [{ scale: buttonScale }],
            }}
          >
            <TouchableOpacity
              onPress={handleDelete}
              style={{
                flex: 1,
                padding: 2,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "red",
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "white", fontSize: 14, fontWeight: "600" }}>
                Xóa
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  },
);

export default AddColorInput;
