// import { ColumnCard, ColumnSumCard } from "@/components";
// import { useColumnSumStore, useDuricoAlert } from "@/context";
// import { usePathname } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import { ScrollView, Text, View } from "react-native";
// import Animated from "react-native-reanimated";
// import { useAnchoredModalReanimated } from "../../hooks/useAnchoreModal";
// import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

// export default function AddScreen() {
//   const alert = useDuricoAlert();
//   const typeModal = useAnchoredModalReanimated();
//   const animatedStyle = useAddScreenEnterAnimation();
//   const pathname = usePathname();
//   const resetAllSums = useColumnSumStore((state) => state.resetAllSums);
//   const [ArrayColumn, setArrayColumn] = useState([{ id: Date.now() }]);

//   useEffect(() => {
//     if (typeModal?.visible) {
//       typeModal.close();
//     }
//   }, [pathname]);

//   const handleAddColumn = useCallback(() => {
//     setArrayColumn((prevColumns) => [...prevColumns, { id: Date.now() }]);
//   }, []);

//   const handleResetColumn = () => {
//     setArrayColumn([{ id: Date.now() }]);
//     resetAllSums();
//   };
//   const handleRemoveColumn = useCallback(
//     (colId) => {
//       setArrayColumn((prev) => {
//         if (prev.length <= 1) {
//           return [{ id: Date.now() }];
//         }
//         return prev.filter((col) => col.id !== colId);
//       });

//       if (ArrayColumn.length <= 1) {
//         resetAllSums();
//       }
//     },
//     [ArrayColumn.length, resetAllSums],
//   );
//   console.log("addScreen rerender");

//   return (
//     <View style={{ flex: 1 }}>
//       <Animated.View
//         style={[
//           {
//             flex: 1,
//             backgroundColor: "#fff",
//             paddingTop: 50,
//             paddingHorizontal: 20,
//             borderTopLeftRadius: 24,
//             borderTopRightRadius: 24,
//           },
//           animatedStyle,
//         ]}
//       >
//         <Text style={{ fontSize: 18, marginBottom: 10 }}>Thêm lịch sử</Text>
//         <ScrollView
//           style={{
//             flex: 1,
//             backgroundColor: "#f8f9fa",
//             padding: 10,
//             paddingTop: 20,
//             borderRadius: 8,
//           }}
//           contentContainerStyle={{ paddingBottom: 320 }}
//           showsVerticalScrollIndicator={false}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               flexWrap: "wrap",
//               justifyContent: "space-between",
//             }}
//           >
//             {ArrayColumn &&
//               ArrayColumn.length > 0 &&
//               ArrayColumn.map((item, colIdx) => (
//                 <ColumnCard
//                   key={item.id}
//                   colId={item.id}
//                   colIdx={colIdx}
//                   handleAddColumn={handleAddColumn}
//                   handleResetColumn={handleResetColumn}
//                   onRemoveColumn={handleRemoveColumn}
//                 />
//               ))}
//             <ColumnSumCard handleAddColumn={handleAddColumn} />
//           </View>
//         </ScrollView>
//       </Animated.View>
//     </View>
//   );
// }
import { ColumnCard, ColumnSumCard } from "@/components";
import { useColumnSumStore, useDuricoAlert } from "@/context";
import { usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { useAnchoredModalReanimated } from "../../hooks/useAnchoreModal";
import { useAddScreenEnterAnimation } from "../../hooks/useAnchoreTab";

export default function AddScreen() {
  const alert = useDuricoAlert();
  const typeModal = useAnchoredModalReanimated();
  const animatedStyle = useAddScreenEnterAnimation();
  const pathname = usePathname();
  const resetAllSums = useColumnSumStore((state) => state.resetAllSums);
  const [ArrayColumn, setArrayColumn] = useState([{ id: Date.now() }]);
  const [gridWidth, setGridWidth] = useState(0);

  useEffect(() => {
    if (typeModal?.visible) {
      typeModal.close();
    }
  }, [pathname]);

  const handleAddColumn = useCallback(() => {
    setArrayColumn((prevColumns) => [
      ...prevColumns,
      { id: Date.now() + Math.random() },
    ]);
  }, []);

  const handleResetColumn = useCallback(() => {
    setArrayColumn([{ id: Date.now() + Math.random() }]);
    resetAllSums();
  }, [resetAllSums]);

  const handleRemoveColumn = useCallback(
    (colId) => {
      setArrayColumn((prev) => {
        if (prev.length <= 1) {
          resetAllSums();
          return [{ id: Date.now() + Math.random() }];
        }
        return prev.filter((col) => col.id !== colId);
      });
    },
    [resetAllSums],
  );

  console.log("addScreen rerender");

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          {
            flex: 1,
            backgroundColor: "#fff",
            paddingTop: 50,
            paddingHorizontal: 20,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
          animatedStyle,
        ]}
      >
        <Text style={{ fontSize: 18, marginBottom: 10 }}>Thêm lịch sử</Text>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: "#f8f9fa",
            padding: 10,
            paddingTop: 20,
            borderRadius: 8,
          }}
          contentContainerStyle={{ paddingBottom: 320 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            onLayout={(e) => {
              const w = e.nativeEvent.layout.width;
              if (w > 0 && w !== gridWidth) {
                setGridWidth(w);
              }
            }}
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {ArrayColumn &&
              ArrayColumn.length > 0 &&
              ArrayColumn.map((item, colIdx) => (
                <ColumnCard
                  key={item.id}
                  colId={item.id}
                  colIdx={colIdx}
                  handleAddColumn={handleAddColumn}
                  handleResetColumn={handleResetColumn}
                  onRemoveColumn={handleRemoveColumn}
                />
              ))}
            <ColumnSumCard
              handleAddColumn={handleAddColumn}
              handleResetColumn={handleResetColumn}
              rowWidth={gridWidth}
            />
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
