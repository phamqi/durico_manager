import { getDB } from "./database";

export const insertWorker = async (name, color, totalWeightning) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");
    await db.runAsync(
      `
      INSERT INTO worker (year, create_at, name, color, total_weightning )
      VALUES (strftime('%Y', 'now'), CURRENT_TIMESTAMP, ?, ?, ?)
      `,
      [name, color, totalWeightning],
    );
  } catch (error) {
    console.log("workerRepo/insertWorker", error);
  }
};

export const getWorkersByYear = async () => {
  try {
    const db = getDB();
    if (!db) return [];
    const rows = await db.getAllAsync(
      `
      SELECT * 
      FROM worker 
      WHERE year = strftime('%Y', 'now') 
      OR year = '1975';
      `,
    );
    return rows;
  } catch (error) {
    console.log("workerRepo/getWorkerByYear", error);
  }
};
export const updateWorkerName = async (id, name) => {
  try {
    const db = getDB();
    if (!db) return false;

    await db.runAsync(
      `
      UPDATE worker
      SET name = ?
      WHERE id = ?
      `,
      [name, id],
    );
    return true;
  } catch (error) {
    console.log("workerRepo/updateWorkerName", error);
  }
};
export const deleteWorker = async (id) => {
  try {
    const db = getDB();
    if (!db) return;
    const res = await db.runAsync(`DELETE FROM worker WHERE id = ?`, [id]);
    console.log("rowsDeleted:", res.changes);
  } catch (error) {
    console.log("workerRepo/deleteWorker", error);
  }
};
function formatLocalDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}
export const getTotalWeight = async (id, year) => {
  try {
    const db = getDB();
    if (!db) return 0;
    const numericYear = Number(year) || new Date().getFullYear();
    const startStr = formatLocalDateTime(new Date(numericYear, 0, 1, 0, 0, 0));
    const endStr = formatLocalDateTime(
      new Date(numericYear + 1, 0, 1, 0, 0, 0),
    );

    const row = await db.getFirstAsync(
      `
      SELECT COALESCE(SUM(td.weight), 0) AS total_weight
      FROM transaction_details td
      INNER JOIN transactions t ON t.id = td.transaction_id
      WHERE td.worker_id = ?
        AND t.created_at >= ?
        AND t.created_at < ?;
      `,
      [id, startStr, endStr],
    );
    console.log("getTotal stateContext", id, row, startStr, endStr);
    return Number(row?.total_weight) || 0;
  } catch (error) {
    console.log("workerRepo/getTotalWeight", error);
    return 0;
  }
};
