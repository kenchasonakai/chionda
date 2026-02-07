import type { GameMode } from '../types';
import { useState } from 'react';
import { getRecords } from '../utils/records';
import { MODE_LABELS } from '../data/promises';

type Props = {
  onBack: () => void;
};

const MODES: GameMode[] = ['promises', 'philosophy'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

export function RecordsScreen({ onBack }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('promises');
  const records = getRecords(selectedMode);

  return (
    <div className="records-screen">
      <h1 className="records-screen-title">記録一覧</h1>

      <div className="mode-select">
        {MODES.map(mode => (
          <button
            key={mode}
            className={`mode-btn ${selectedMode === mode ? 'selected' : ''}`}
            onClick={() => setSelectedMode(mode)}
          >
            <span className="mode-name">{MODE_LABELS[mode].title}</span>
          </button>
        ))}
      </div>

      {records.length === 0 ? (
        <p className="no-records">まだ記録がありません</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>#</th>
              <th>タイム</th>
              <th>正確率</th>
              <th>ミス</th>
              <th>日付</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const acc = r.correctCount + r.missCount > 0
                ? Math.round((r.correctCount / (r.correctCount + r.missCount)) * 100)
                : 0;
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{formatTime(r.elapsedTime)}</td>
                  <td>{acc}%</td>
                  <td>{r.missCount}</td>
                  <td>{r.date}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button className="back-btn" onClick={onBack}>戻る</button>
    </div>
  );
}
