import type { RomajiChar } from '../utils/romaji';
import { getDisplayRomaji } from '../utils/romaji';

type Props = {
  text: string;
  romajiChars: RomajiChar[];
  currentCharIndex: number;
  currentInput: string;
  matchedPattern: string | null;
  isMiss: boolean;
};

export function TypingArea({
  text,
  romajiChars,
  currentCharIndex,
  currentInput,
  matchedPattern,
  isMiss,
}: Props) {
  // ローマ字表示を構築
  const romajiDisplay = buildRomajiDisplay(romajiChars, currentCharIndex, currentInput, matchedPattern);

  return (
    <div className={`typing-area ${isMiss ? 'miss-flash' : ''}`}>
      <div className="japanese-text">{text}</div>
      <div className="romaji-text">
        {romajiDisplay.map((segment, i) => (
          <span key={i} className={`romaji-char ${segment.state}`}>
            {segment.text}
          </span>
        ))}
      </div>
    </div>
  );
}

type RomajiSegment = {
  text: string;
  state: 'done' | 'current-done' | 'current-pending' | 'pending';
};

function buildRomajiDisplay(
  chars: RomajiChar[],
  currentIndex: number,
  currentInput: string,
  matchedPattern: string | null,
): RomajiSegment[] {
  const segments: RomajiSegment[] = [];

  for (let i = 0; i < chars.length; i++) {
    if (i < currentIndex) {
      // 完了済み
      const pattern = chars[i].patterns[0];
      segments.push({ text: pattern, state: 'done' });
    } else if (i === currentIndex) {
      // 現在入力中
      const displayPattern = matchedPattern ?? chars[i].patterns[0];
      if (currentInput.length > 0) {
        segments.push({ text: currentInput, state: 'current-done' });
        segments.push({ text: displayPattern.slice(currentInput.length), state: 'current-pending' });
      } else {
        segments.push({ text: displayPattern, state: 'current-pending' });
      }
    } else {
      // 未入力
      segments.push({ text: getDisplayRomaji([chars[i]]), state: 'pending' });
    }
  }

  return segments;
}
