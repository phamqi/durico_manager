import { createContext, useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getRandomColor } from "@/constants";
import {
  createAmount,
  createTransactionWithDetails,
  deleteWorker,
  getAmountByYear,
  getTransactionsByTypes,
  getTransactionsDetailsByID,
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
  const [loading, setLoading] = useState(true);
  const alert = useDuricoAlert();
  const createColumn = () => ({
    id: Date.now(),
    inputs: Array(5).fill({
      weight: 0,
      worker_id: null,
      worker_name: null,
      worker_color: null,
    }),
    result: 0,
  });

  const [columnsData, setColumnsData] = useState(() => [createColumn()]);

  const handleReset = () => setColumnsData([createColumn()]);

  const addColumn = () => setColumnsData((prev) => [...prev, createColumn()]);
  const totalSummary = columnsData.reduce(
    (acc, col) => acc + (parseFloat(col.result) || 0),
    0,
  );
  const [selectedType, setSelectedType] = useState(0);
  const cacheRef = useRef({
    totalSummary: 0,
    transaction_types: 0,
  });
  useEffect(() => {
    setLoading(true);
    (async () => {
      await initDB();
      const rows = await getWorkersByYear();
      setColorArray(rows);
      setCurrentWorker(rows[0]);
      const amount = await getAmountByYear();
      setAmount(amount);
      setLoading(false);
    })();
  }, []);

  const addWorker = async (name, color, totalWeightning) => {
    try {
      if (!name || name.trim() === "") {
        alert.toast("Vui lòng nhập tên");
      } else {
        await insertWorker(name.trim(), color, totalWeightning);
        const rows = await getWorkersByYear();
        setColorArray(rows);
        alert.toast("Thêm thành công");
      }
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm thất bại");
      console.log("sateContext.js addWorker", error);
    }
  };

  const updateWorker = async (id, name) => {
    try {
      if (!name || name.trim() === "") {
        alert.toast("Vui lòng nhập tên");
      } else {
        await updateWorkerName(id, name.trim());
        const rows = await getWorkersByYear();
        setColorArray(rows);
        alert.toast("Cập nhập thành công");
      }
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
      console.log("sateContext.js removeWorker", error);
    }
  };
  const createAmountContext = async (amount) => {
    try {
      const isValidNumber = (value) => /^[1-9][0-9]*$/.test(value);
      if (!amount || amount.trim() === "") {
        alert.toast("Vui lòng nhập giá tiền");
      } else {
        if (!isValidNumber(amount)) {
          alert.toast("Là số nguyên dương, khác 0");
          return;
        } else {
          const parseAmount = parseInt(amount, 10);
          await createAmount(parseAmount);
          const rows = await getAmountByYear();
          setAmount(rows);
          alert.toast("Thêm giá thành công");
        }
      }
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm giá thất bại");
      console.log("sateContext.js addPrice", error);
    }
  };
  const createTransaction = async () => {
    try {
      if (totalSummary > 0) {
        const isChanged =
          cacheRef.current.totalSummary !== totalSummary ||
          cacheRef.current.transaction_types !== selectedType;
        if (isChanged) {
          const randomValue = getRandomColor();
          await createTransactionWithDetails(
            columnsData,
            totalSummary,
            selectedType,
            randomValue,
          );
          alert.toast("Thêm giao dịch thành công");
          cacheRef.current.totalSummary = totalSummary;
          cacheRef.current.transaction_types = selectedType;
        } else {
          alert.toast("Giao dịch đã được thêm");
        }
      } else {
        alert.toast("Vui lòng nhập đầy đủ thông tin");
      }
    } catch (error) {
      alert.toast("Xảy ra lỗi, thêm thất bại");
      console.log("sateContext.js createTransatioin", error);
    }
  };
  const getTransactions = async (types) => {
    try {
      const rows = await getTransactionsByTypes(types);
      return rows;
    } catch (error) {
      console.log("getTransec stateContext", error);
    }
  };
  const getTransactionsDetails = async (transaction_id) => {
    try {
      const rows = await getTransactionsDetailsByID(transaction_id);
      console.log("state context get by id", rows);
      return rows;
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
        getTransactions,
        getTransactionsDetails,
        totalSummary,
        handleReset,
        selectedType,
        setSelectedType,
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
