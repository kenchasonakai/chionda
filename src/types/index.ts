export type GameMode = 'promises' | 'philosophy';

export type TypingItem = {
  id: number;
  text: string;
  reading: string;
};

export type GameState = 'start' | 'playing' | 'result' | 'records';

export type GameResult = {
  mode: GameMode;
  elapsedTime: number;
  correctCount: number;
  missCount: number;
};

export type SavedResult = GameResult & {
  isNewRecord: boolean;
};
