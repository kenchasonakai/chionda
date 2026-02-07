import { useState, useCallback } from 'react';
import type { GameMode, GameResult, GameState, SavedResult } from './types';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { RecordsScreen } from './components/RecordsScreen';
import { saveRecord } from './utils/records';

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [mode, setMode] = useState<GameMode>('promises');
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);

  const handleStart = useCallback((selectedMode: GameMode) => {
    setMode(selectedMode);
    setGameState('playing');
  }, []);

  const handleFinish = useCallback((gameResult: GameResult) => {
    const isNewRecord = saveRecord(gameResult);
    setSavedResult({ ...gameResult, isNewRecord });
    setGameState('result');
  }, []);

  const handleRetry = useCallback(() => {
    setSavedResult(null);
    setGameState('playing');
  }, []);

  const handleBackToStart = useCallback(() => {
    setSavedResult(null);
    setGameState('start');
  }, []);

  return (
    <div className="app">
      {gameState === 'start' && (
        <StartScreen onStart={handleStart} onShowRecords={() => setGameState('records')} />
      )}
      {gameState === 'playing' && (
        <GameScreen key={Date.now()} mode={mode} onFinish={handleFinish} />
      )}
      {gameState === 'result' && savedResult && (
        <ResultScreen result={savedResult} onRetry={handleRetry} onBackToStart={handleBackToStart} />
      )}
      {gameState === 'records' && (
        <RecordsScreen onBack={handleBackToStart} />
      )}
    </div>
  );
}

export default App;
