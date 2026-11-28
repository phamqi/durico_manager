import { memo } from "react";
import { ScrollView, Text, View } from "react-native";
import { useWorkerBySession } from "../context";

const HistoryColumnCard = memo(({ colGroup }) => {
  return (
    <View style={{ width: "48%", marginBottom: 10 }}>
      <View
        style={{
          width: "100%",
          height: 248,
          backgroundColor: "#fff",
          borderRadius: 8,
          padding: 12,
          borderWidth: 1,
          borderColor: "#e1e4e8",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "bold",
            color: "#333",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Cụm #{colGroup.column_index}
        </Text>

        {colGroup.slots.map((slot) => {
          const hasWeight =
            slot.weight !== "" &&
            slot.weight !== null &&
            slot.weight !== undefined;

          return (
            <View
              key={slot.id}
              style={{
                height: 28,
                borderWidth: 1,
                borderColor: "#eceff1",
                borderRadius: 6,
                paddingHorizontal: 10,
                marginBottom: 4,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: "#FFF",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: "#333333",
                  fontWeight: "600",
                }}
              >
                {hasWeight ? String(slot.weight) : ""}
              </Text>
            </View>
          );
        })}

        <View
          style={{
            marginTop: 4,
            padding: 6,
            backgroundColor: "#e6f4ea",
            borderRadius: 6,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: "#137333",
              fontWeight: "600",
            }}
          >
            Kết quả:
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#137333",
            }}
          >
            {colGroup.totalWeight || "0"}
          </Text>
        </View>
      </View>
    </View>
  );
});

/**
 * Danh sách lịch sử của 1 worker, tách riêng từng giao dịch (ngày + giờ + mã phiếu)
 */
export default function WorkerHistorySessionList({ rawRows = [] }) {
  const sessions = useWorkerBySession(rawRows);

  if (!sessions.length) {
    return (
      <View style={{ padding: 24, alignItems: "center" }}>
        <Text style={{ color: "#666", fontSize: 14 }}>
          Chưa có dữ liệu giao dịch.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ padding: 6, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {sessions.map((session) => (
        <View
          key={session.key}
          style={{
            backgroundColor: "#f8f9fa",
            borderRadius: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#e1e4e8",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 8,
              marginBottom: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#e1e4e8",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#222",
                }}
              >
                {session.date} • {session.time}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#137333",
              }}
            >
              Tổng: {session.totalWeight}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {session.columns.map((colGroup) => (
              <HistoryColumnCard
                key={`${session.key}-col-${colGroup.column_index}`}
                colGroup={colGroup}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
