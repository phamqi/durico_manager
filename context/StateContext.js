import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import {
  createAmount,
  createTransactionWithDetails,
  deleteWorker,
  getAmountByYear,
  getTransactions,
  getTransactionsDetails,
  getWorkersByYear,
  initDB,
  insertWorker,
  updateWorkerName,
} from "../database";
import { useDuricoAlert } from "./DuricoAlertContext";
const StateContext = createContext(null);

export const StateProvider = ({ children }) => {
  const [colorArray, setColorArray] = useState([]);
  const [color, setColor] = useState("black");
  const [currentWorker, setCurrentWorker] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const alert = useDuricoAlert();
  const getDate = () => {
    const date = new Date().toLocaleDateString("vi-VN");
    const id = date.toString() + Date.now().toString(36);
    return id;
  };
  const [columnsData, setColumnsData] = useState([
    {
      id: Date.now(),
      inputs: [
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
      ],
      result: 0,
    },
  ]);
  const addColumn = () => {
    const newCol = {
      id: Date.now(),
      inputs: [
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
        { weight: 0, worker_id: null, worker_name: null, worker_color: null },
      ],
      result: 0,
    };
    setColumnsData([...columnsData, newCol]);
  };

  useEffect(() => {
    setLoading(true);
    (async () => {
      await initDB();
      const rows = await getWorkersByYear();
      setColorArray(rows);
      const amount = await getAmountByYear();
      setAmount(amount);
      setLoading(false);
    })();
  }, []);

  const addWorker = async (name, color, totalWeightning) => {
    try {
      await insertWorker(name, color, totalWeightning);
      const rows = await getWorkersByYear();
      setColorArray(rows);
      alert.toast("Thêm thành công");
      console.log("add wordker", rows);
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm thất bại");
      console.log("sateContext.js addworker", error);
    }
  };

  const updateWorker = async (id, name) => {
    try {
      await updateWorkerName(id, name);
      const rows = await getWorkersByYear();
      setColorArray(rows);
      alert.toast("Cập nhập thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, cập nhập thất bại");
      console.log("sateContext.js updateworker", error);
    }
  };
  const removeWorker = async (id) => {
    try {
      await deleteWorker(id);
      const rows = await getWorkersByYear();
      setColorArray(rows);
      alert.toast("Xoá thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, xoá thất bại");
      console.log("sateContext.js removeworker", error);
    }
  };
  const createAmountContext = async (amount) => {
    try {
      const parseAmount = parseInt(amount, 10);
      await createAmount(parseAmount);
      const rows = await getAmountByYear();
      setAmount(rows);
      alert.toast("Thêm giá thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm giá thất bại");
      console.log("sateContext.js addPrice", error);
    }
  };
  const createTransaction = async (details) => {
    try {
      await createTransactionWithDetails(details);
      alert.toast("Thêm lich su thành công");
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm giá thất bại");
      console.log("sateContext.js addPrice", error);
    }
  };
  const getTransactionsData = async () => {
    try {
      const rows = await getTransactions();
      const row = await getTransactionsDetails();
      console.log("bcd", row.toString());
      console.log("hjlk", rows.toString());
    } catch (error) {
      console.log("getTransec stateContext", error);
    }
  };
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <StateContext.Provider
      value={{
        colorArray,
        setColorArray,
        color,
        setColor,
        addWorker,
        updateWorker,
        removeWorker,
        createAmountContext,
        amount,
        currentWorker,
        setCurrentWorker,
        columnsData,
        setColumnsData,
        addColumn,
        createTransaction,
        getTransactionsData,
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
