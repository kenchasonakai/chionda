// ひらがな → ローマ字変換テーブル（複数パターン対応）
const ROMAJI_MAP: Record<string, string[][]> = {
  // 基本母音
  'あ': [['a']], 'い': [['i']], 'う': [['u']], 'え': [['e']], 'お': [['o']],
  // か行
  'か': [['ka']], 'き': [['ki']], 'く': [['ku']], 'け': [['ke']], 'こ': [['ko']],
  // さ行
  'さ': [['sa']], 'し': [['shi'], ['si']], 'す': [['su']], 'せ': [['se']], 'そ': [['so']],
  // た行
  'た': [['ta']], 'ち': [['chi'], ['ti']], 'つ': [['tsu'], ['tu']], 'て': [['te']], 'と': [['to']],
  // な行
  'な': [['na']], 'に': [['ni']], 'ぬ': [['nu']], 'ね': [['ne']], 'の': [['no']],
  // は行
  'は': [['ha']], 'ひ': [['hi']], 'ふ': [['fu'], ['hu']], 'へ': [['he']], 'ほ': [['ho']],
  // ま行
  'ま': [['ma']], 'み': [['mi']], 'む': [['mu']], 'め': [['me']], 'も': [['mo']],
  // や行
  'や': [['ya']], 'ゆ': [['yu']], 'よ': [['yo']],
  // ら行
  'ら': [['ra']], 'り': [['ri']], 'る': [['ru']], 'れ': [['re']], 'ろ': [['ro']],
  // わ行
  'わ': [['wa']], 'を': [['wo']], 'ん': [['nn'], ['n']],
  // が行
  'が': [['ga']], 'ぎ': [['gi']], 'ぐ': [['gu']], 'げ': [['ge']], 'ご': [['go']],
  // ざ行
  'ざ': [['za']], 'じ': [['ji'], ['zi']], 'ず': [['zu']], 'ぜ': [['ze']], 'ぞ': [['zo']],
  // だ行
  'だ': [['da']], 'ぢ': [['di']], 'づ': [['du'], ['zu']], 'で': [['de']], 'ど': [['do']],
  // ば行
  'ば': [['ba']], 'び': [['bi']], 'ぶ': [['bu']], 'べ': [['be']], 'ぼ': [['bo']],
  // ぱ行
  'ぱ': [['pa']], 'ぴ': [['pi']], 'ぷ': [['pu']], 'ぺ': [['pe']], 'ぽ': [['po']],
  // 拗音 - きゃ行
  'きゃ': [['kya']], 'きゅ': [['kyu']], 'きょ': [['kyo']],
  // 拗音 - しゃ行
  'しゃ': [['sha'], ['sya']], 'しゅ': [['shu'], ['syu']], 'しょ': [['sho'], ['syo']],
  // 拗音 - ちゃ行
  'ちゃ': [['cha'], ['tya']], 'ちゅ': [['chu'], ['tyu']], 'ちょ': [['cho'], ['tyo']],
  // 拗音 - にゃ行
  'にゃ': [['nya']], 'にゅ': [['nyu']], 'にょ': [['nyo']],
  // 拗音 - ひゃ行
  'ひゃ': [['hya']], 'ひゅ': [['hyu']], 'ひょ': [['hyo']],
  // 拗音 - みゃ行
  'みゃ': [['mya']], 'みゅ': [['myu']], 'みょ': [['myo']],
  // 拗音 - りゃ行
  'りゃ': [['rya']], 'りゅ': [['ryu']], 'りょ': [['ryo']],
  // 拗音 - ぎゃ行
  'ぎゃ': [['gya']], 'ぎゅ': [['gyu']], 'ぎょ': [['gyo']],
  // 拗音 - じゃ行
  'じゃ': [['ja'], ['zya']], 'じゅ': [['ju'], ['zyu']], 'じょ': [['jo'], ['zyo']],
  // 拗音 - びゃ行
  'びゃ': [['bya']], 'びゅ': [['byu']], 'びょ': [['byo']],
  // 拗音 - ぴゃ行
  'ぴゃ': [['pya']], 'ぴゅ': [['pyu']], 'ぴょ': [['pyo']],
  // 記号
  '、': [[',']], '。': [['.']], 'ー': [['-']],
  '　': [[' ']],
};

// 「ん」の後に母音・や行が来る場合は "nn" 必須
const VOWELS_AND_Y = new Set(['a', 'i', 'u', 'e', 'o', 'y', 'n']);

export type RomajiChar = {
  kana: string;
  patterns: string[]; // 受け付け可能なローマ字パターン
};

// ひらがな文字列をローマ字パターンのリストに変換
export function kanaToRomajiChars(reading: string): RomajiChar[] {
  const result: RomajiChar[] = [];
  let i = 0;

  while (i < reading.length) {
    const char = reading[i];

    // 促音「っ」の処理
    if (char === 'っ') {
      // 次の文字のローマ字の先頭子音を重ねる
      const nextChars = reading.slice(i + 1);
      let nextKana = '';
      let nextPatterns: string[][] = [];

      // 次の文字を取得（拗音チェック）
      if (nextChars.length >= 2 && ROMAJI_MAP[nextChars.slice(0, 2)]) {
        nextKana = nextChars.slice(0, 2);
        nextPatterns = ROMAJI_MAP[nextKana];
      } else if (nextChars.length >= 1 && ROMAJI_MAP[nextChars[0]]) {
        nextKana = nextChars[0];
        nextPatterns = ROMAJI_MAP[nextKana];
      }

      if (nextPatterns.length > 0) {
        // 促音 + 次の文字をまとめて1エントリに
        const combinedPatterns: string[] = [];
        for (const pattern of nextPatterns) {
          const consonant = pattern[0][0];
          combinedPatterns.push(consonant + pattern[0]);
        }
        // xtu/xtsuパターンも追加
        for (const pattern of nextPatterns) {
          combinedPatterns.push('xtu' + pattern[0]);
          combinedPatterns.push('xtsu' + pattern[0]);
        }
        result.push({ kana: 'っ' + nextKana, patterns: combinedPatterns });
        i += 1 + nextKana.length;
        continue;
      }

      result.push({ kana: 'っ', patterns: ['xtu', 'xtsu'] });
      i++;
      continue;
    }

    // 拗音チェック（2文字）
    if (i + 1 < reading.length) {
      const twoChars = reading.slice(i, i + 2);
      if (ROMAJI_MAP[twoChars]) {
        const patterns = ROMAJI_MAP[twoChars].map(p => p[0]);
        result.push({ kana: twoChars, patterns });
        i += 2;
        continue;
      }
    }

    // 「ん」の特別処理
    if (char === 'ん') {
      const nextChar = reading[i + 1];
      // 次の文字の最初のローマ字が母音・y・nで始まる場合は "nn" 必須
      if (nextChar) {
        let nextRomaji = '';
        // 次の文字のローマ字を取得
        if (i + 2 < reading.length && ROMAJI_MAP[reading.slice(i + 1, i + 3)]) {
          nextRomaji = ROMAJI_MAP[reading.slice(i + 1, i + 3)][0][0];
        } else if (ROMAJI_MAP[nextChar]) {
          nextRomaji = ROMAJI_MAP[nextChar][0][0];
        }
        if (nextRomaji && VOWELS_AND_Y.has(nextRomaji[0])) {
          result.push({ kana: 'ん', patterns: ['nn'] });
          i++;
          continue;
        }
      }
      // 文末 or 次が子音の場合は n/nn どちらもOK
      result.push({ kana: 'ん', patterns: ['nn', 'n'] });
      i++;
      continue;
    }

    // 通常の1文字
    if (ROMAJI_MAP[char]) {
      const patterns = ROMAJI_MAP[char].map(p => p[0]);
      result.push({ kana: char, patterns });
      i++;
      continue;
    }

    // マッピングにない文字はそのまま
    result.push({ kana: char, patterns: [char] });
    i++;
  }

  return result;
}

// 入力チェック: 現在のRomajiCharに対して、入力文字列が有効かチェック
export function checkInput(
  romajiChar: RomajiChar,
  currentInput: string,
  newChar: string
): { valid: boolean; completed: boolean; matchedPattern: string | null } {
  const input = currentInput + newChar;

  for (const pattern of romajiChar.patterns) {
    if (pattern === input) {
      return { valid: true, completed: true, matchedPattern: pattern };
    }
    if (pattern.startsWith(input)) {
      return { valid: true, completed: false, matchedPattern: null };
    }
  }

  return { valid: false, completed: false, matchedPattern: null };
}

// 全体のローマ字テキストを生成（表示用、最初のパターンを使用）
export function getDisplayRomaji(chars: RomajiChar[]): string {
  return chars.map(c => c.patterns[0]).join('');
}
