import { createContext, useContext, useState } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const DuricoAlertContext = createContext(null);

export const DuricoAlertProvider = ({ children }) => {
  const [config, setConfig] = useState(null);

  const hide = () => setConfig(null);

  const show = (cfg) => {
    setConfig(cfg);
  };

  return (
    <DuricoAlertContext.Provider value={{ show }}>
      {children}

      <Modal
        visible={!!config}
        transparent
        animationType="fade"
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
            {/* CONTENT */}
            <View style={{ padding: 16 }}>
              <Text
                style={{
                  fontSize: 17,
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

            {/* BUTTONS */}
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