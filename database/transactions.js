import { DEFAULT_WORKER_COLOR } from "@/constants";
import { getDB } from "./database";

//   details,
//   totalSummary,
//   selectedType,
//   randomValue,
// ) => {
//   try {
//     console.log(" create: ", totalSummary, selectedType, details, randomValue);
//     const db = getDB();
//     if (!db) throw new Error("DB not ready");
//     await db.withTransactionAsync(async () => {
//       const results = await db.runAsync(
//         `INSERT INTO transactions ( is_hidden, created_at, total_summary, transaction_types, background_color)
//          VALUES ( 0, CURRENT_TIMESTAMP, ?, ?, ?);`,
//         [
//           Number(totalSummary) || 0,
//           Number(selectedType) || 0,
//           Number(randomValue) || 0,
//         ],
//       );

//       const transactionId = results.lastInsertRowId;

//       for (let colIdx = 0; colIdx < details.length; colIdx++) {
//         const columnItem = details[colIdx];
//         const columnIndex = colIdx + 1;

//         if (columnItem.inputs && Array.isArray(columnItem.inputs)) {
//           for (let rowIdx = 0; rowIdx < columnItem.inputs.length; rowIdx++) {
//             const inputItem = columnItem.inputs[rowIdx];
//             const rowIndex = rowIdx + 1;
//             await db.runAsync(
//               `INSERT INTO transaction_details (transaction_id, column_index, row_index, worker_id, worker_name, worker_color, weight, result)
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
//               [
//                 transactionId,
//                 columnIndex,
//                 rowIndex,
//                 inputItem.worker_id || null,
//                 inputItem.worker_name || null,
//                 inputItem.worker_color || null,
//                 Number(inputItem.weight) || 0,
//                 Number(columnItem.result) || 0,
//               ],
//             );
//           }
//         }
//       }
//     });
//   } catch (error) {
//     console.log("transactionRepo/createTransactionWithDetails", error);
//     throw error;
//   }
// };
export const createTransactionWithDetails = async (
  details,
  totalSummary,
  selectedType,
  randomValue,
) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");
    await db.withTransactionAsync(async () => {
      const results = await db.runAsync(
        `INSERT INTO transactions ( is_hidden, created_at, total_summary, transaction_types, background_color) 
         VALUES ( 0, CURRENT_TIMESTAMP, ?, ?, ?);`,
        [
          Number(totalSummary) || 0,
          Number(selectedType) || 0,
          Number(randomValue) || 0,
        ],
      );

      const transactionId = results.lastInsertRowId;

      for (let colIdx = 0; colIdx < details.length; colIdx++) {
        const columnItem = details[colIdx];
        const columnIndex = colIdx + 1;

        const columnResult = Number(columnItem.result) || 0;
        if (columnResult === 0) continue;

        if (columnItem.inputs && Array.isArray(columnItem.inputs)) {
          for (let rowIdx = 0; rowIdx < columnItem.inputs.length; rowIdx++) {
            const inputItem = columnItem.inputs[rowIdx];
            const weightValue = Number(inputItem.weight) || 0;

            if (weightValue === 0) continue;

            const rowIndex = rowIdx + 1;
            await db.runAsync(
              `INSERT INTO transaction_details (transaction_id, column_index, row_index, worker_id, worker_name, worker_color, weight, result)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                transactionId,
                columnIndex,
                rowIndex,
                inputItem.worker_id || "none",
                inputItem.worker_name || "none",
                inputItem.worker_color || DEFAULT_WORKER_COLOR,
                weightValue,
                columnResult,
              ],
            );
          }
        }
      }
    });
  } catch (error) {
    console.log("transactionRepo/createTransactionWithDetails", error);
  }
};
export const toggleTransactionHidden = async (transactionId, isHidden) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");

    const hiddenVal = isHidden ? 1 : 0;
    await db.runAsync(
      `UPDATE transactions 
       SET is_hidden = ? 
       WHERE id = ?;`,
      [hiddenVal, transactionId],
    );
  } catch (error) {
    console.log("transactionRepo/toggleTransactionHidden", error);
  }
};

export const getTransactionsByTypes = async (types) => {
  try {
    const db = getDB();
    if (!db) return [];
    const rows = await db.getAllAsync(
      `
      SELECT * 
      FROM transactions 
      WHERE transaction_types = ? ;
      `,
      [types],
    );
    return rows;
  } catch (error) {
    console.log("workerRepo/getWorkerByYear", error);
  }
};
export const getTransactionsDetailsByID = async (transaction_id) => {
  try {
    const db = getDB();
    if (!db) return [];
    const rows = await db.getAllAsync(
      `
      SELECT * 
      FROM transaction_details 
      WHERE id = ? ;
      `,
      [transaction_id],
    );
    return rows;
  } catch (error) {
    console.log("workerRepo/getWorkerByYear", error);
  }
};
