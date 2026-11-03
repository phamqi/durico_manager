export const PRESET_COLORS = [
  "#FF3B30",
  "#FFCC00",
  "#34C759",
  "#007AFF",
  "#AF52DE",
  "#9E9E9E",
];
export const DEFAULT_WORKER_COLOR = "#9E9E9E";
export const DEFAULT_WORKER = {
  id: 1,
  year: "1975",
  name: "Mặc định",
  color: DEFAULT_WORKER_COLOR,
  total_weightning: 0,
};
export const DELETE_PIN = "25251325";
export const PRICE_COLOR = {
  icon: "#FF9500",
  blur: "#FFE066",
  active: "#FFCC05",
};
export const TRANSACTION_TYPES = {
  income: 1,
  coffee: 2,
  durian: 3,
};
export const ARRAY_COLOR = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEEAD",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
];
export const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * ARRAY_COLOR.length);
  return ARRAY_COLOR[randomIndex];
};
