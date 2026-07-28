/**
 * data.js
 * Dữ liệu bảng chữ cái Hiragana và Katakana cơ bản (46 chữ mỗi bảng).
 * Mỗi phần tử: { char, romaji, type, group }
 *   - char:   ký tự tiếng Nhật
 *   - romaji: cách đọc La-tinh hóa
 *   - type:   "hiragana" | "katakana"
 *   - group:  nhóm phụ âm dùng để lọc học & chọn đáp án nhiễu (vowel, k, s, t, n, h, m, y, r, w)
 */

const HIRAGANA = [
  { char: "あ", romaji: "a", type: "hiragana", group: "vowel" },
  { char: "い", romaji: "i", type: "hiragana", group: "vowel" },
  { char: "う", romaji: "u", type: "hiragana", group: "vowel" },
  { char: "え", romaji: "e", type: "hiragana", group: "vowel" },
  { char: "お", romaji: "o", type: "hiragana", group: "vowel" },

  { char: "か", romaji: "ka", type: "hiragana", group: "k" },
  { char: "き", romaji: "ki", type: "hiragana", group: "k" },
  { char: "く", romaji: "ku", type: "hiragana", group: "k" },
  { char: "け", romaji: "ke", type: "hiragana", group: "k" },
  { char: "こ", romaji: "ko", type: "hiragana", group: "k" },

  { char: "さ", romaji: "sa", type: "hiragana", group: "s" },
  { char: "し", romaji: "shi", type: "hiragana", group: "s" },
  { char: "す", romaji: "su", type: "hiragana", group: "s" },
  { char: "せ", romaji: "se", type: "hiragana", group: "s" },
  { char: "そ", romaji: "so", type: "hiragana", group: "s" },

  { char: "た", romaji: "ta", type: "hiragana", group: "t" },
  { char: "ち", romaji: "chi", type: "hiragana", group: "t" },
  { char: "つ", romaji: "tsu", type: "hiragana", group: "t" },
  { char: "て", romaji: "te", type: "hiragana", group: "t" },
  { char: "と", romaji: "to", type: "hiragana", group: "t" },

  { char: "な", romaji: "na", type: "hiragana", group: "n" },
  { char: "に", romaji: "ni", type: "hiragana", group: "n" },
  { char: "ぬ", romaji: "nu", type: "hiragana", group: "n" },
  { char: "ね", romaji: "ne", type: "hiragana", group: "n" },
  { char: "の", romaji: "no", type: "hiragana", group: "n" },

  { char: "は", romaji: "ha", type: "hiragana", group: "h" },
  { char: "ひ", romaji: "hi", type: "hiragana", group: "h" },
  { char: "ふ", romaji: "fu", type: "hiragana", group: "h" },
  { char: "へ", romaji: "he", type: "hiragana", group: "h" },
  { char: "ほ", romaji: "ho", type: "hiragana", group: "h" },

  { char: "ま", romaji: "ma", type: "hiragana", group: "m" },
  { char: "み", romaji: "mi", type: "hiragana", group: "m" },
  { char: "む", romaji: "mu", type: "hiragana", group: "m" },
  { char: "め", romaji: "me", type: "hiragana", group: "m" },
  { char: "も", romaji: "mo", type: "hiragana", group: "m" },

  { char: "や", romaji: "ya", type: "hiragana", group: "y" },
  { char: "ゆ", romaji: "yu", type: "hiragana", group: "y" },
  { char: "よ", romaji: "yo", type: "hiragana", group: "y" },

  { char: "ら", romaji: "ra", type: "hiragana", group: "r" },
  { char: "り", romaji: "ri", type: "hiragana", group: "r" },
  { char: "る", romaji: "ru", type: "hiragana", group: "r" },
  { char: "れ", romaji: "re", type: "hiragana", group: "r" },
  { char: "ろ", romaji: "ro", type: "hiragana", group: "r" },

  { char: "わ", romaji: "wa", type: "hiragana", group: "w" },
  { char: "を", romaji: "wo", type: "hiragana", group: "w" },
  { char: "ん", romaji: "n", type: "hiragana", group: "w" },
];

const KATAKANA = [
  { char: "ア", romaji: "a", type: "katakana", group: "vowel" },
  { char: "イ", romaji: "i", type: "katakana", group: "vowel" },
  { char: "ウ", romaji: "u", type: "katakana", group: "vowel" },
  { char: "エ", romaji: "e", type: "katakana", group: "vowel" },
  { char: "オ", romaji: "o", type: "katakana", group: "vowel" },

  { char: "カ", romaji: "ka", type: "katakana", group: "k" },
  { char: "キ", romaji: "ki", type: "katakana", group: "k" },
  { char: "ク", romaji: "ku", type: "katakana", group: "k" },
  { char: "ケ", romaji: "ke", type: "katakana", group: "k" },
  { char: "コ", romaji: "ko", type: "katakana", group: "k" },

  { char: "サ", romaji: "sa", type: "katakana", group: "s" },
  { char: "シ", romaji: "shi", type: "katakana", group: "s" },
  { char: "ス", romaji: "su", type: "katakana", group: "s" },
  { char: "セ", romaji: "se", type: "katakana", group: "s" },
  { char: "ソ", romaji: "so", type: "katakana", group: "s" },

  { char: "タ", romaji: "ta", type: "katakana", group: "t" },
  { char: "チ", romaji: "chi", type: "katakana", group: "t" },
  { char: "ツ", romaji: "tsu", type: "katakana", group: "t" },
  { char: "テ", romaji: "te", type: "katakana", group: "t" },
  { char: "ト", romaji: "to", type: "katakana", group: "t" },

  { char: "ナ", romaji: "na", type: "katakana", group: "n" },
  { char: "ニ", romaji: "ni", type: "katakana", group: "n" },
  { char: "ヌ", romaji: "nu", type: "katakana", group: "n" },
  { char: "ネ", romaji: "ne", type: "katakana", group: "n" },
  { char: "ノ", romaji: "no", type: "katakana", group: "n" },

  { char: "ハ", romaji: "ha", type: "katakana", group: "h" },
  { char: "ヒ", romaji: "hi", type: "katakana", group: "h" },
  { char: "フ", romaji: "fu", type: "katakana", group: "h" },
  { char: "ヘ", romaji: "he", type: "katakana", group: "h" },
  { char: "ホ", romaji: "ho", type: "katakana", group: "h" },

  { char: "マ", romaji: "ma", type: "katakana", group: "m" },
  { char: "ミ", romaji: "mi", type: "katakana", group: "m" },
  { char: "ム", romaji: "mu", type: "katakana", group: "m" },
  { char: "メ", romaji: "me", type: "katakana", group: "m" },
  { char: "モ", romaji: "mo", type: "katakana", group: "m" },

  { char: "ヤ", romaji: "ya", type: "katakana", group: "y" },
  { char: "ユ", romaji: "yu", type: "katakana", group: "y" },
  { char: "ヨ", romaji: "yo", type: "katakana", group: "y" },

  { char: "ラ", romaji: "ra", type: "katakana", group: "r" },
  { char: "リ", romaji: "ri", type: "katakana", group: "r" },
  { char: "ル", romaji: "ru", type: "katakana", group: "r" },
  { char: "レ", romaji: "re", type: "katakana", group: "r" },
  { char: "ロ", romaji: "ro", type: "katakana", group: "r" },

  { char: "ワ", romaji: "wa", type: "katakana", group: "w" },
  { char: "ヲ", romaji: "wo", type: "katakana", group: "w" },
  { char: "ン", romaji: "n", type: "katakana", group: "w" },
];

// Danh sách nhóm dùng để hiển thị bộ lọc trong màn Học
const GROUPS = [
  { key: "vowel", label: "Nguyên âm" },
  { key: "k", label: "K" },
  { key: "s", label: "S" },
  { key: "t", label: "T" },
  { key: "n", label: "N" },
  { key: "h", label: "H" },
  { key: "m", label: "M" },
  { key: "y", label: "Y" },
  { key: "r", label: "R" },
  { key: "w", label: "W+N" },
];
