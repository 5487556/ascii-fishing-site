import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export function useLocalRecords<T>(
  key: string,
  initial: T[],
  isRecord: (value: unknown) => value is T,
): [T[], Dispatch<SetStateAction<T[]>>, string | null] {
  const [loaded] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return { records: initial, writable: true, error: null as string | null };
      const value: unknown = JSON.parse(raw);
      if (!Array.isArray(value) || !value.every(isRecord)) throw new Error('invalid schema');
      return { records: value as T[], writable: true, error: null as string | null };
    } catch {
      return { records: initial, writable: false, error: '無法讀取既有圖鑑資料，原資料已保留；本次變更暫不保存。' };
    }
  });
  const [records, setRecords] = useState<T[]>(loaded.records);
  const [error, setError] = useState<string | null>(loaded.error);

  useEffect(() => {
    if (!loaded.writable) return;
    try {
      localStorage.setItem(key, JSON.stringify(records));
      setError(null);
    } catch {
      setError('目前無法保存圖鑑資料，重新整理可能會失去本次紀錄。');
    }
  }, [key, records, loaded.writable]);

  return [records, setRecords, error];
}
