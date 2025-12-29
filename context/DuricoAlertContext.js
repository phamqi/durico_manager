import { createContext, useContext, useRef, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal } from "react-native-paper";

const DuricoAlertContext = createContext(null);

export const DuricoAlertProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [toastConfig, setToastConfig] = useState(null);
  const toastTimer = useRef(null);

  const hide = () => setConfig(null);
  const show = (cfg) => {
    setConfig(cfg);
  };

  const toast = (cfg) => {
  const duration = cfg?.duration ?? 2000;
  const message =
    typeof cfg === "string" ? cfg : cfg.message;

  if (toastTimer.current) {
    clearTimeout(toastTimer.current);
    toastTimer.current = null;
  }

  setToastConfig(null);

  requestAnimationFrame(() => {
    setToastConfig({ message });

    toastTimer.current = setTimeout(() => {
      setToastConfig(null);
      toastTimer.current = null;
    }, duration);
  });
};

  return (
    <DuricoAlertContext.Provider value={{ show , toast}}>
      {children}

      <Modal
        visible={!!config}
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.35)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 270,
              backgroundColor: "#fff",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                {config?.title}
              </Text>

              {config?.message ? (
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 13,
                    color: "#555",
                    textAlign: "center",
                  }}
                >
                  {config.message}
                </Text>
              ) : null}
            </View>

            <View
              style={{
                flexDirection: "row",
                borderTopWidth: 1,
                borderColor: "#e5e5e5",
              }}
            >
              {config?.buttons?.map((btn, index) => {
                const color =
                  btn.style === "destructive"
                    ? "#ff3b30"
                    : "#007aff";

                return (
                  <TouchableOpacity
                    key={index}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      alignItems: "center",
                      borderLeftWidth: index > 0 ? 1 : 0,
                      borderColor: "#e5e5e5",
                    }}
                    onPress={() => {
                      hide();
                      btn.onPress && btn.onPress();
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight:
                          btn.style === "cancel"
                            ? "600"
                            : "500",
                        color,
                      }}
                    >
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
      {toastConfig && (
        <Portal>
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: 60,
              left: 20,
              right: 20,
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <View
              style={{
                backgroundColor: "#333",
                paddingHorizontal: 22,
                paddingVertical: 10,
                borderRadius: 8,
                maxWidth: "90%",
              }}
            >
              <Text style={{ color: "#fff", fontSize: 14 }}>
                {toastConfig.message}
              </Text>
            </View>
          </View>
        </Portal>  
      )}
    </DuricoAlertContext.Provider>
  );
};
export const useDuricoAlert = () => {
  const ctx = useContext(DuricoAlertContext);
  if (!ctx) {
    throw new Error(
      "useDuricoAlert must be used inside DuricoAlertProvider"
    );
  }
  return ctx;
};