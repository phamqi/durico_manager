import { getDB } from "./database";

export const createAmount = async (amount) => {
  try {
    const db = getDB();
    if (!db) throw new Error("DB not ready");

    await db.runAsync(
      `
      INSERT INTO amount (year, amount, create_at, update_at)
      VALUES (strftime('%Y', 'now'), ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(year)
      DO UPDATE SET
        amount = excluded.amount,
        update_at = CURRENT_TIMESTAMP;
      `,
      [amount],
    );
  } catch (error) {
    console.log("amountRepo/createAmount", error);
  }
};
export const getAmountByYear = async () => {
  try {
    const db = getDB();
    if (!db) return [];
    const rows = await db.getFirstAsync(
      `
      SELECT amount
      FROM amount
      WHERE year = strftime('%Y', 'now');
      `,
    );
    return rows?.amount;
  } catch (error) {
    console.log("amountRepo/getAmountByYear", error);
  }
};
