import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { deleteWorker, getPriceByYear, getWorkersByYear, initDB, insertPrice, insertWorker, updateWorkerName } from "../database";
const StateContext = createContext(null);

export const StateProvider = ({ children }) => {
  const [colorArray, setColorArray] = useState([]);
  const [color, setColor] = useState("black");
  const [price, setPrice] = useState();
  const [loading,setLoading ] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  useEffect(() => {
    setLoading(true);
    (async () => {
      await initDB();
      const rows = await getWorkersByYear(selectedYear);
      setColorArray(rows);
      setLoading(false);
    })();
  }, []);

  const addWorker = async ( name, color, totalWeightning) => {
    
    await insertWorker(
      selectedYear,
      name,
      color,
      totalWeightning
    );
    const rows = await getWorkersByYear(selectedYear);
    setColorArray(rows);
  };

  const updateWorker = async ( id, name) => {
    await updateWorkerName(
      id, name
    );
    const rows = await getWorkersByYear(selectedYear);
    setColorArray(rows);
  }
  const removeWorker = async (id) => {
    await deleteWorker(id);
    const rows = await getWorkersByYear(selectedYear);
    setColorArray(rows);
  }
  const addPrice = async (amount)=> {
    const parseAmount = parseInt(amount, 10);
    await insertPrice(selectedYear, parseAmount);
    const rows = await getPriceByYear(selectedYear);
    console.log("price", typeof parseAmount, rows);
    setPrice(rows);
  }
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
        addWorker,
        updateWorker,
        removeWorker,
        addPrice,
        price
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