import { getDB } from "./database";

/**
 * 1. INSERT TRANSACTION & DETAILS (Tạo mới phiếu cân bao gồm các cột/dòng)
 * @param {string} transactionDate - Ngày giao dịch (VD: '2026-10-30')
 * @param {string} note - Ghi chú
 * @param {Array} details - Mảng chứa các ô dữ liệu [{ column_index, row_index, worker_id, worker_name, color_code, weight }]
 */

export const createTransactionWithDetails = async (details) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");

    await db.withTransactionAsync(async () => {
      const results = await db.runAsync(
        `INSERT INTO transactions ( is_hidden, created_at) 
         VALUES ( 0, CURRENT_TIMESTAMP);`,
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

    console.log("Tạo transaction và details thành công!");
  } catch (error) {
    console.log("transactionRepo/createTransactionWithDetails", error);
    throw error;
  }
};

/**
 * 3. HIDDEN / UNHIDDEN TRANSACTION (Ẩn hoặc Hiện giao dịch thay vì xóa vĩnh viễn)
 * @param {number} transactionId - ID phiếu
 * @param {boolean} isHidden - true (ẩn), false (hiện lại)
 */
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

    console.log(
      `Đã chuyển trạng thái ẩn/hiện cho transaction ${transactionId}`,
    );
  } catch (error) {
    console.log("transactionRepo/toggleTransactionHidden", error);
  }
};

/**
 * 4. Lấy danh sách giao dịch (Chỉ lấy những cái không bị ẩn nếu cần)
 * @param {boolean} includeHidden - Có muốn lấy cả các phiếu đang ẩn không (mặc định false)
 */
export const getTransactions = async (includeHidden = false) => {
  try {
    const db = getDB();
    if (!db) return [];

    let query = `SELECT * FROM transactions`;
    if (!includeHidden) {
      query += ` WHERE is_hidden = 0`;
    }
    const rows = await db.getAllAsync(query);
    console.log("transaction.js log getTransac", rows);
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
    console.log("transaction.js log get transaction_details", rows);
    return rows;
  } catch (error) {
    console.log("transactionRepo/getTransactions", error);
  }
};
