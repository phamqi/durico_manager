import { getDB } from "./database";

const getTodayString = () => {
  const d = new Date();
  return `${d.getDate().toString().padStart(2,'0')}/${
    (d.getMonth()+1).toString().padStart(2,'0')
  }/${d.getFullYear()}`;
};

export const insertPrice = async (year, amount) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");

    const createdAt = Date.now();
    const logEntry = `${getTodayString()}-${amount}`;

    await db.runAsync(
      `
      INSERT INTO price (year, amount, create_at, update_at)
      VALUES (?, ?, ?, ?)
      `,
      [year,
      amount,
      createdAt,
      logEntry]
    );
  } catch (error) {
    console.log("priceRepo/insertPrice", error);
  }
};

export const updatePrice = async (id, amount) => {
  try {
    const db = getDB();
    if (!db) return false;

    const logEntry = `${getTodayString()}-${amount}`;

    await db.runAsync(
      `
      UPDATE price
      SET
        amount = ?,
        update_at = COALESCE(update_at || '\n', '') || ?
      WHERE id = ?
      `,
      [amount,
      logEntry,
      id]
    );

    return true;
  } catch (error) {
    console.log("priceRepo/updatePrice", error);
    return false;
  }
};
export const getPriceByYear = async (year) => {
  try {
    const db = getDB();
    console.log('db', db)
    if (!db) return [];
    const rows = await db.getAllAsync(
      `
      SELECT *
      FROM price
      WHERE year = ?
      `,
      [year]
    );
    return rows;
  } catch (error) {
    console.log("priceRepo/getPriceByYear", error)
  }
};

