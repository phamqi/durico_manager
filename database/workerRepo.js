import { getDB } from "./database";

export const insertWorker = async (
  year,
  name,
  color,
  totalWeightning,
  price
) => {
  const db = getDB();
  if (!db) throw new Error("DB not ready");
  await db.runAsync(
    `
    INSERT INTO worker (year, name, color, total_weightning, price)
    VALUES (?, ?, ?, ?, ?)
    `,
    year,
    name,
    color,
    totalWeightning,
    price
  );
};

export const getWorkersByYear = async (year) => {
  const db = getDB();
  if (!db) return [];
  const rows = await db.getAllAsync(
    `
    SELECT *
    FROM worker
    WHERE year = ?
    ORDER BY name
    `,
    year
  );
  return rows;
};