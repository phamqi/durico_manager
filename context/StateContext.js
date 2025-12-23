import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { deleteWorker, getPriceByYear, getWorkersByYear, initDB, insertPrice, insertWorker, updateWorkerName } from "../database";
import { useDuricoAlert } from "./DuricoAlertContext";
const StateContext = createContext(null);

export const StateProvider = ({ children }) => {
  const [colorArray, setColorArray] = useState([]);
  const [color, setColor] = useState("black");
  const [price, setPrice] = useState();
  const [loading,setLoading ] = useState(false);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const alert = useDuricoAlert()

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
    try {
      await insertWorker(
        selectedYear,
        name,
        color,
        totalWeightning
      );
      const rows = await getWorkersByYear(selectedYear);
      setColorArray(rows);
      alert.toast("Thêm thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm thất bại");
      console.log("addworker", error);
    }
  };

  const updateWorker = async ( id, name) => {
    try {
      await updateWorkerName(
        id, name
      );
      const rows = await getWorkersByYear(selectedYear);
      setColorArray(rows);
      alert.toast("Cập nhập thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, cập nhập thất bại")
    }
    
  }
  const removeWorker = async (id) => {
    try {
      await deleteWorker(id);
      const rows = await getWorkersByYear(selectedYear);
      setColorArray(rows);
      alert.toast("Xoá thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, xoá thất bại");
    }
  }
  const addPrice = async (amount)=> {
    try {
      const parseAmount = parseInt(amount, 10);
      await insertPrice(selectedYear, parseAmount);
      const rows = await getPriceByYear(selectedYear);
      console.log("price", typeof parseAmount, rows);
      setPrice(rows);
      alert.toast("Thêm giá thành công");
    } catch (error) {
     ấlert.show("Xảy ra lỗi, thêm giá thất bại");
    }
    
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