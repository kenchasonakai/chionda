import type { GameMode, GameResult } from '../types';

export type Record = GameResult & {
  date: string;
};

const MAX_RECORDS = 10;

function storageKey(mode: GameMode): string {
  return `chionda-records-${mode}`;
}

export function getRecords(mode: GameMode): Record[] {
  try {
    const raw = localStorage.getItem(storageKey(mode));
    if (!raw) return [];
    return JSON.parse(raw) as Record[];
  } catch {
    return [];
  }
}

export function getBestTime(mode: GameMode): number | null {
  const records = getRecords(mode);
  if (records.length === 0) return null;
  return Math.min(...records.map(r => r.elapsedTime));
}

// 記録を保存し、新記録かどうかを返す
export function saveRecord(result: GameResult): boolean {
  const prevBest = getBestTime(result.mode);
  const isNewRecord = prevBest === null || result.elapsedTime < prevBest;

  const record: Record = {
    ...result,
    date: new Date().toLocaleDateString('ja-JP'),
  };

  const records = getRecords(result.mode);
  records.unshift(record);
  if (records.length > MAX_RECORDS) {
    records.length = MAX_RECORDS;
  }

  localStorage.setItem(storageKey(result.mode), JSON.stringify(records));
  return isNewRecord;
}
