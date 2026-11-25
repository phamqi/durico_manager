export const columnDataRef = {};
export const normalizeColumnData = (rawData) => {
  const first = rawData[0];
  const columnId = `${first.transaction_id}-${first.column_index}`;

  const inputs = [...rawData]
    .sort((a, b) => a.row_index - b.row_index)
    .map((item) => ({
      id: item.id,
      row_index: item.row_index,
      weight: String(item.weight),
      worker_id: item.worker_id,
      worker_name: item.worker_name,
      worker_color: item.worker_color,
    }));

  return {
    id: columnId,
    transaction_id: first.transaction_id,
    column_index: first.column_index,
    inputs,
    result: String(first.result ?? 0),
  };
};
