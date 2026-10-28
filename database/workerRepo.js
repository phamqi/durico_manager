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

export const getWorkersByYear = async (year) => {
  try {
    const db = getDB();
    if (!db) return [];
    const rows = await db.getAllAsync(
      `
      SELECT *
      FROM worker
      WHERE year = strftime('%Y', 'now')
      ORDER BY name
      `,
    );
    console.log("getWorkerByYear workerRepo", rows);
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
    console.log("workerRepo/updateWorkerName");
  }
};
export const deleteWorker = async (id) => {
  try {
    const db = getDB();
    if (!db) return;
    const res = await db.runAsync(`DELETE FROM worker WHERE id = ?`, [id]);
    console.log("rowsDeleted:", res.changes);
  } catch (error) {
    console.log("workerRepo/deleteWorker");
  }
};
