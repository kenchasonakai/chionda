import { useState, useEffect, useCallback, useRef } from 'react';
import type { GameMode, GameResult } from '../types';
import { getItems } from '../data/promises';
import { kanaToRomajiChars, checkInput } from '../utils/romaji';
import type { RomajiChar } from '../utils/romaji';
import { TypingArea } from './TypingArea';

type Props = {
  mode: GameMode;
  onFinish: (result: GameResult) => void;
};

export function GameScreen({ mode, onFinish }: Props) {
  const queue = getItems(mode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [romajiChars, setRomajiChars] = useState<RomajiChar[]>([]);
  const [charIndex, setCharIndex] = useState(0);
  const [currentInput, setCurrentInput] = useState('');
  const [matchedPattern, setMatchedPattern] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [clearedCount, setClearedCount] = useState(0);
  const [isMiss, setIsMiss] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [elapsed, setElapsed] = useState(0);

  const gameActive = useRef(false);
  const startTime = useRef(0);

  useEffect(() => {
    if (currentIndex < queue.length) {
      const chars = kanaToRomajiChars(queue[currentIndex].reading);
      setRomajiChars(chars);
      setCharIndex(0);
      setCurrentInput('');
      setMatchedPattern(null);
    }
  }, [currentIndex, queue]);

  useEffect(() => {
    if (isStarted || countdown <= 0) return;
    const timer = setTimeout(() => {
      if (countdown === 1) {
        setIsStarted(true);
        gameActive.current = true;
        startTime.current = Date.now();
      }
      setCountdown(c => c - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, isStarted]);

  useEffect(() => {
    if (!isStarted) return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!gameActive.current) return;
      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;
      if (charIndex >= romajiChars.length) return;

      const currentChar = romajiChars[charIndex];
      const result = checkInput(currentChar, currentInput, e.key);

      if (result.valid) {
        setCorrectCount(c => c + 1);
        if (result.completed) {
          const nextCharIndex = charIndex + 1;
          if (nextCharIndex >= romajiChars.length) {
            const newClearedCount = clearedCount + 1;
            setClearedCount(newClearedCount);

            if (newClearedCount >= queue.length) {
              gameActive.current = false;
              const finalTime = (Date.now() - startTime.current) / 1000;
              onFinish({
                mode,
                elapsedTime: finalTime,
                correctCount: correctCount + 1,
                missCount,
              });
            } else {
              setCurrentIndex(i => i + 1);
            }
          } else {
            setCharIndex(nextCharIndex);
            setCurrentInput('');
            setMatchedPattern(null);
          }
        } else {
          setCurrentInput(prev => prev + e.key);
          const matchingPatterns = currentChar.patterns.filter(p =>
            p.startsWith(currentInput + e.key)
          );
          if (matchingPatterns.length > 0) {
            setMatchedPattern(matchingPatterns[0]);
          }
        }
      } else {
        setMissCount(c => c + 1);
        setIsMiss(true);
        setTimeout(() => setIsMiss(false), 200);
      }
    },
    [charIndex, romajiChars, currentInput, clearedCount, correctCount, missCount, onFinish, queue, mode],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const currentItem = queue[currentIndex];

  if (!isStarted) {
    return (
      <div className="game-screen">
        <div className="countdown">{countdown}</div>
      </div>
    );
  }

  if (!currentItem) return null;

  const progressPercent = (clearedCount / queue.length) * 100;
  const label = mode === 'promises'
    ? `約束 ${currentItem.id}`
    : `${currentItem.id <= 6 ? 'ミッション' : 'ビジョン'} ${currentItem.id} / ${queue.length}`;

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="timer-bar-container">
          <div
            className="timer-bar"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="game-info">
          <span className="time-text">{formatTime(elapsed)}</span>
          <span className="score-text">{clearedCount} / {queue.length} | 正確: {correctCount} | ミス: {missCount}</span>
        </div>
      </div>

      <div className="game-content">
        <div className="promise-number">{label}</div>
        <TypingArea
          text={currentItem.text}
          romajiChars={romajiChars}
          currentCharIndex={charIndex}
          currentInput={currentInput}
          matchedPattern={matchedPattern}
          isMiss={isMiss}
        />
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
