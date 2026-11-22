import { useMemo } from "react";

function parseDateTime(dateTimeStr = "") {
  // Hỗ trợ dạng "2026-11-16 14:09:19" hoặc "2026-11-16T14:09:19"
  const normalized = String(dateTimeStr).trim().replace("T", " ");
  const [datePart = "Không rõ ngày", timePart = ""] = normalized.split(" ");
  return {
    date: datePart,
    time: timePart, // ví dụ "14:09:19"
    fullDateTime: normalized,
  };
}

export function useWorkerBySession(rawRows = []) {
  return useMemo(() => {
    const sessionMap = new Map();

    for (const row of rawRows) {
      const { date, time, fullDateTime } = parseDateTime(
        row.transaction_created_at,
      );
      const txId = row.transaction_id;
      const sessionKey = `${date}__tx_${txId}`;
      const colIdx = Number(row.column_index) || 1;
      const rowIdx = Number(row.row_index) || 1;
      const weightNum = Number(row.weight) || 0;

      if (!sessionMap.has(sessionKey)) {
        sessionMap.set(sessionKey, {
          key: sessionKey,
          date,
          time,
          fullDateTime,
          transaction_id: txId,
          totalWeight: 0,
          columnsMap: new Map(),
        });
      }

      const session = sessionMap.get(sessionKey);
      session.totalWeight += weightNum;

      if (!session.columnsMap.has(colIdx)) {
        session.columnsMap.set(colIdx, {
          column_index: colIdx,
          totalWeight: 0,
          cellsMap: new Map(),
        });
      }

      const colGroup = session.columnsMap.get(colIdx);
      colGroup.totalWeight += weightNum;

      const prevCell = colGroup.cellsMap.get(rowIdx);
      colGroup.cellsMap.set(rowIdx, {
        ...row,
        row_index: rowIdx,
        weight: (prevCell ? Number(prevCell.weight) || 0 : 0) + weightNum,
      });
    }

    return (
      Array.from(sessionMap.values())
        // Sắp xếp giao dịch mới nhất lên trước
        .sort((a, b) => b.fullDateTime.localeCompare(a.fullDateTime))
        .map((session) => {
          const columns = Array.from(session.columnsMap.values())
            .sort((a, b) => a.column_index - b.column_index)
            .map((col) => {
              const maxRow = Math.max(5, ...col.cellsMap.keys());
              const slots = Array.from({ length: maxRow }, (_, idx) => {
                const rIdx = idx + 1;
                return (
                  col.cellsMap.get(rIdx) || {
                    id: `empty-${session.key}-${col.column_index}-${rIdx}`,
                    row_index: rIdx,
                    column_index: col.column_index,
                    weight: "",
                    worker_color: null,
                  }
                );
              });

              return {
                column_index: col.column_index,
                totalWeight: col.totalWeight,
                slots,
              };
            });

          return {
            key: session.key,
            date: session.date,
            time: session.time,
            transaction_id: session.transaction_id,
            totalWeight: session.totalWeight,
            columns,
          };
        })
    );
  }, [rawRows]);
}
