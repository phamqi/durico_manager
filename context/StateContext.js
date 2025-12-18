import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getWorkersByYear, initDB, insertWorker } from "../database";
const StateContext = createContext(null);

export const StateProvider = ({ children }) => {
  const [colorArray, setColorArray] = useState([]);
  const [color, setColor] = useState("black");
  const [loading,setLoading ] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    setLoading(true);
    (async () => {
      await initDB();
      const rows = await getWorkersByYear(selectedYear);
      setColorArray(rows);
      console.log(rows);
      setLoading(false);
    })();
  }, []);

  const addWorker = async ( name, color, totalWeightning, price) => {
    await insertWorker(
      selectedYear,
      name,
      color,
      totalWeightning,
      price
    );
    const rows = await getWorkersByYear(selectedYear);
    setColorArray(rows);
  };
  if(loading){
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size='large' />
      </View>
    ) 
  }
  return (
    <StateContext.Provider
      value={{
        colorArray,
        setColorArray,
        color,
        setColor,
        setSelectedYear,
        addWorker
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useGlobalState = () => {
  const ctx = useContext(StateContext);
  if (!ctx) {
    throw new Error("useGlobalState must be used inside StateProvider");
  }
  return ctx;
};