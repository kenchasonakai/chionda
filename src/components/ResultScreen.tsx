import type { SavedResult } from '../types';
import { getRecords } from '../utils/records';
import { MODE_LABELS } from '../data/promises';

type Props = {
  result: SavedResult;
  onRetry: () => void;
  onBackToStart: () => void;
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m > 0 ? `${m}分${s}秒` : `${s}秒`;
}

export function ResultScreen({ result, onRetry, onBackToStart }: Props) {
  const accuracy =
    result.correctCount + result.missCount > 0
      ? Math.round((result.correctCount / (result.correctCount + result.missCount)) * 100)
      : 0;

  const records = getRecords(result.mode);

  return (
    <div className="result-screen">
      <h1 className="result-title">全問クリア!</h1>
      <p className="result-mode">{MODE_LABELS[result.mode].title}</p>

      {result.isNewRecord && <div className="new-record">New Record!!</div>}

      <div className="result-stats">
        <div className="stat">
          <span className="stat-label">タイム</span>
          <span className="stat-value highlight">{formatTime(result.elapsedTime)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">正確率</span>
          <span className="stat-value">{accuracy}<small> %</small></span>
        </div>
        <div className="stat">
          <span className="stat-label">正しい入力数</span>
          <span className="stat-value">{result.correctCount}<small> 打</small></span>
        </div>
        <div className="stat">
          <span className="stat-label">ミス入力数</span>
          <span className="stat-value miss">{result.missCount}<small> 打</small></span>
        </div>
      </div>

      <div className="result-actions">
        <button className="start-btn" onClick={onRetry}>もう一度</button>
        <button className="back-btn" onClick={onBackToStart}>モード選択へ</button>
      </div>

      {records.length > 0 && (
        <div className="records">
          <h2 className="records-title">記録一覧</h2>
          <table className="records-table">
            <thead>
              <tr>
                <th>#</th>
                <th>タイム</th>
                <th>正確率</th>
                <th>日付</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => {
                const acc = r.correctCount + r.missCount > 0
                  ? Math.round((r.correctCount / (r.correctCount + r.missCount)) * 100)
                  : 0;
                return (
                  <tr key={i} className={r.elapsedTime === result.elapsedTime && r.date === new Date().toLocaleDateString('ja-JP') && i === 0 ? 'current-record' : ''}>
                    <td>{i + 1}</td>
                    <td>{formatTime(r.elapsedTime)}</td>
                    <td>{acc}%</td>
                    <td>{r.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
