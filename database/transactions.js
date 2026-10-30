import { getDB } from "./database";

export const createTransactionWithDetails = async (details, totalSummary) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");
    await db.withTransactionAsync(async () => {
      const results = await db.runAsync(
        `INSERT INTO transactions ( is_hidden, created_at, total_summary) 
         VALUES ( 0, CURRENT_TIMESTAMP, ?);`,
        [parseInt(totalSummary, 10) || 0],
      );

      const transactionId = results.lastInsertRowId;
      for (let colIdx = 0; colIdx < details.length; colIdx++) {
        const columnItem = details[colIdx];
        const columnIndex = colIdx + 1;

        if (columnItem.inputs && Array.isArray(columnItem.inputs)) {
          for (let rowIdx = 0; rowIdx < columnItem.inputs.length; rowIdx++) {
            const inputItem = columnItem.inputs[rowIdx];
            const rowIndex = rowIdx + 1;
            await db.runAsync(
              `INSERT INTO transaction_details (transaction_id, column_index, row_index, worker_id, worker_name, worker_color, weight, result)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
              [
                transactionId,
                columnIndex,
                rowIndex,
                inputItem.worker_id || null,
                inputItem.worker_name || null,
                inputItem.worker_color || null,
                parseInt(inputItem.weight, 10) || 0,
                parseInt(columnItem.result, 10) || 0,
              ],
            );
          }
        }
      }
    });
  } catch (error) {
    console.log("transactionRepo/createTransactionWithDetails", error);
    throw error;
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

export const getTransactions = async (includeHidden = false) => {
  try {
    const db = getDB();
    if (!db) return [];
    let query = `SELECT * FROM transactions`;
    if (!includeHidden) {
      query += ` WHERE is_hidden = 0`;
    }
    const rows = await db.getAllAsync(query);
    return rows;
  } catch (error) {
    console.log("transactionRepo/getTransactions", error);
  }
};
export const getTransactionsDetails = async () => {
  try {
    const db = getDB();
    if (!db) return [];
    let query = `SELECT * FROM transaction_details`;
    const rows = await db.getAllAsync(query);
    return rows;
  } catch (error) {
    console.log("transactionRepo/getTransactions", error);
  }
};
