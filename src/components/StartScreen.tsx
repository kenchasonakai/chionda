import { useState } from 'react';
import type { GameMode } from '../types';
import { getBestTime } from '../utils/records';
import { MODE_LABELS } from '../data/promises';

type Props = {
  onStart: (mode: GameMode) => void;
  onShowRecords: () => void;
};

const MODES: GameMode[] = ['promises', 'philosophy'];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

export function StartScreen({ onStart, onShowRecords }: Props) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('promises');
  const bestTime = getBestTime(selectedMode);

  return (
    <div className="start-screen">
      <div className="title-area">
        <h1 className="title">チオンダ</h1>
      </div>

      <div className="mode-select">
        {MODES.map(mode => (
          <button
            key={mode}
            className={`mode-btn ${selectedMode === mode ? 'selected' : ''}`}
            onClick={() => setSelectedMode(mode)}
          >
            <span className="mode-name">{MODE_LABELS[mode].title}</span>
            <span className="mode-desc">{MODE_LABELS[mode].description}</span>
          </button>
        ))}
      </div>

      {bestTime !== null && (
        <div className="best-time">
          <span className="best-time-label">最高記録</span>
          <span className="best-time-value">{formatTime(bestTime)}</span>
        </div>
      )}

      <button className="start-btn" onClick={() => onStart(selectedMode)}>
        スタート
      </button>

      <button className="link-btn" onClick={onShowRecords}>記録一覧</button>
    </div>
  );
}
