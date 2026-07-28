/**
 * data.js
 * Dữ liệu bảng chữ cái Hiragana và Katakana cơ bản (46 chữ mỗi bảng).
 * Mỗi phần tử: { char, romaji, type, group, strokeLevel?, lookalike? }
 *   - char:        ký tự tiếng Nhật
 *   - romaji:      cách đọc La-tinh hóa
 *   - type:        "hiragana" | "katakana"
 *   - group:       nhóm phụ âm (vowel, k, s, t, n, h, m, y, r, w) — dùng cho 10 bài học theo hàng
 *   - strokeLevel: "easy" | "mid" | "hard" — độ phức tạp nét vẽ, chỉ gắn cho một số chữ tiêu biểu
 *                  (dùng cho 3 bài luyện nét). Không phải chữ nào cũng có field này.
 *   - lookalike:   true — chữ nằm trong nhóm kinh điển hay bị nhầm hình dạng (dùng cho bài 14).
 *
 * strokeLevel/lookalike được chọn thủ công dựa trên số nét thật của từng chữ (không phải suy ra
 * tự động), rải đều trên nhiều hàng phụ âm khác nhau để bài luyện nét vẫn có đủ chữ để học dù
 * người dùng mới hoàn thành một phần các bài 1–10.
 */

const HIRAGANA = [
  { char: "あ", romaji: "a", type: "hiragana", group: "vowel", strokeLevel: "hard" },
  { char: "い", romaji: "i", type: "hiragana", group: "vowel", strokeLevel: "easy", lookalike: true },
  { char: "う", romaji: "u", type: "hiragana", group: "vowel", strokeLevel: "mid" },
  { char: "え", romaji: "e", type: "hiragana", group: "vowel" },
  { char: "お", romaji: "o", type: "hiragana", group: "vowel" },

  { char: "か", romaji: "ka", type: "hiragana", group: "k" },
  { char: "き", romaji: "ki", type: "hiragana", group: "k", strokeLevel: "hard" },
  { char: "く", romaji: "ku", type: "hiragana", group: "k", strokeLevel: "easy" },
  { char: "け", romaji: "ke", type: "hiragana", group: "k" },
  { char: "こ", romaji: "ko", type: "hiragana", group: "k", strokeLevel: "mid" },

  { char: "さ", romaji: "sa", type: "hiragana", group: "s" },
  { char: "し", romaji: "shi", type: "hiragana", group: "s", strokeLevel: "easy" },
  { char: "す", romaji: "su", type: "hiragana", group: "s", strokeLevel: "mid" },
  { char: "せ", romaji: "se", type: "hiragana", group: "s", strokeLevel: "hard" },
  { char: "そ", romaji: "so", type: "hiragana", group: "s" },

  { char: "た", romaji: "ta", type: "hiragana", group: "t", strokeLevel: "hard" },
  { char: "ち", romaji: "chi", type: "hiragana", group: "t" },
  { char: "つ", romaji: "tsu", type: "hiragana", group: "t", strokeLevel: "easy" },
  { char: "て", romaji: "te", type: "hiragana", group: "t" },
  { char: "と", romaji: "to", type: "hiragana", group: "t", strokeLevel: "mid" },

  { char: "な", romaji: "na", type: "hiragana", group: "n", strokeLevel: "hard" },
  { char: "に", romaji: "ni", type: "hiragana", group: "n" },
  { char: "ぬ", romaji: "nu", type: "hiragana", group: "n", lookalike: true },
  { char: "ね", romaji: "ne", type: "hiragana", group: "n", strokeLevel: "mid", lookalike: true },
  { char: "の", romaji: "no", type: "hiragana", group: "n", strokeLevel: "easy" },

  { char: "は", romaji: "ha", type: "hiragana", group: "h", strokeLevel: "mid", lookalike: true },
  { char: "ひ", romaji: "hi", type: "hiragana", group: "h" },
  { char: "ふ", romaji: "fu", type: "hiragana", group: "h" },
  { char: "へ", romaji: "he", type: "hiragana", group: "h", strokeLevel: "easy" },
  { char: "ほ", romaji: "ho", type: "hiragana", group: "h", strokeLevel: "hard", lookalike: true },

  { char: "ま", romaji: "ma", type: "hiragana", group: "m" },
  { char: "み", romaji: "mi", type: "hiragana", group: "m", strokeLevel: "easy" },
  { char: "む", romaji: "mu", type: "hiragana", group: "m" },
  { char: "め", romaji: "me", type: "hiragana", group: "m", strokeLevel: "mid", lookalike: true },
  { char: "も", romaji: "mo", type: "hiragana", group: "m", strokeLevel: "hard" },

  { char: "や", romaji: "ya", type: "hiragana", group: "y", strokeLevel: "hard" },
  { char: "ゆ", romaji: "yu", type: "hiragana", group: "y", strokeLevel: "easy" },
  { char: "よ", romaji: "yo", type: "hiragana", group: "y", strokeLevel: "mid" },

  { char: "ら", romaji: "ra", type: "hiragana", group: "r" },
  { char: "り", romaji: "ri", type: "hiragana", group: "r", strokeLevel: "mid", lookalike: true },
  { char: "る", romaji: "ru", type: "hiragana", group: "r", strokeLevel: "easy", lookalike: true },
  { char: "れ", romaji: "re", type: "hiragana", group: "r" },
  { char: "ろ", romaji: "ro", type: "hiragana", group: "r", lookalike: true },

  { char: "わ", romaji: "wa", type: "hiragana", group: "w", strokeLevel: "mid", lookalike: true },
  { char: "を", romaji: "wo", type: "hiragana", group: "w", strokeLevel: "hard" },
  { char: "ん", romaji: "n", type: "hiragana", group: "w", strokeLevel: "easy" },
];

const KATAKANA = [
  { char: "ア", romaji: "a", type: "katakana", group: "vowel", strokeLevel: "easy" },
  { char: "イ", romaji: "i", type: "katakana", group: "vowel", strokeLevel: "mid" },
  { char: "ウ", romaji: "u", type: "katakana", group: "vowel", strokeLevel: "hard" },
  { char: "エ", romaji: "e", type: "katakana", group: "vowel" },
  { char: "オ", romaji: "o", type: "katakana", group: "vowel" },

  { char: "カ", romaji: "ka", type: "katakana", group: "k" },
  { char: "キ", romaji: "ki", type: "katakana", group: "k", strokeLevel: "hard" },
  { char: "ク", romaji: "ku", type: "katakana", group: "k", strokeLevel: "easy", lookalike: true },
  { char: "ケ", romaji: "ke", type: "katakana", group: "k", lookalike: true },
  { char: "コ", romaji: "ko", type: "katakana", group: "k", strokeLevel: "mid" },

  { char: "サ", romaji: "sa", type: "katakana", group: "s" },
  { char: "シ", romaji: "shi", type: "katakana", group: "s", strokeLevel: "hard", lookalike: true },
  { char: "ス", romaji: "su", type: "katakana", group: "s", strokeLevel: "easy" },
  { char: "セ", romaji: "se", type: "katakana", group: "s" },
  { char: "ソ", romaji: "so", type: "katakana", group: "s", strokeLevel: "mid", lookalike: true },

  { char: "タ", romaji: "ta", type: "katakana", group: "t", strokeLevel: "mid" },
  { char: "チ", romaji: "chi", type: "katakana", group: "t", lookalike: true },
  { char: "ツ", romaji: "tsu", type: "katakana", group: "t", strokeLevel: "hard", lookalike: true },
  { char: "テ", romaji: "te", type: "katakana", group: "t", lookalike: true },
  { char: "ト", romaji: "to", type: "katakana", group: "t", strokeLevel: "easy" },

  { char: "ナ", romaji: "na", type: "katakana", group: "n", strokeLevel: "mid" },
  { char: "ニ", romaji: "ni", type: "katakana", group: "n" },
  { char: "ヌ", romaji: "nu", type: "katakana", group: "n" },
  { char: "ネ", romaji: "ne", type: "katakana", group: "n", strokeLevel: "hard" },
  { char: "ノ", romaji: "no", type: "katakana", group: "n", strokeLevel: "easy" },

  { char: "ハ", romaji: "ha", type: "katakana", group: "h", strokeLevel: "mid" },
  { char: "ヒ", romaji: "hi", type: "katakana", group: "h" },
  { char: "フ", romaji: "fu", type: "katakana", group: "h", strokeLevel: "easy" },
  { char: "ヘ", romaji: "he", type: "katakana", group: "h" },
  { char: "ホ", romaji: "ho", type: "katakana", group: "h", strokeLevel: "hard" },

  { char: "マ", romaji: "ma", type: "katakana", group: "m" },
  { char: "ミ", romaji: "mi", type: "katakana", group: "m" },
  { char: "ム", romaji: "mu", type: "katakana", group: "m", strokeLevel: "easy" },
  { char: "メ", romaji: "me", type: "katakana", group: "m", strokeLevel: "mid" },
  { char: "モ", romaji: "mo", type: "katakana", group: "m", strokeLevel: "hard" },

  { char: "ヤ", romaji: "ya", type: "katakana", group: "y", strokeLevel: "mid" },
  { char: "ユ", romaji: "yu", type: "katakana", group: "y", strokeLevel: "easy" },
  { char: "ヨ", romaji: "yo", type: "katakana", group: "y", strokeLevel: "hard" },

  { char: "ラ", romaji: "ra", type: "katakana", group: "r" },
  { char: "リ", romaji: "ri", type: "katakana", group: "r", strokeLevel: "mid" },
  { char: "ル", romaji: "ru", type: "katakana", group: "r", strokeLevel: "easy" },
  { char: "レ", romaji: "re", type: "katakana", group: "r" },
  { char: "ロ", romaji: "ro", type: "katakana", group: "r", strokeLevel: "hard" },

  { char: "ワ", romaji: "wa", type: "katakana", group: "w", strokeLevel: "easy", lookalike: true },
  { char: "ヲ", romaji: "wo", type: "katakana", group: "w", strokeLevel: "hard", lookalike: true },
  { char: "ン", romaji: "n", type: "katakana", group: "w", strokeLevel: "mid", lookalike: true },
];

// Danh sách nhóm phụ âm — dùng làm nền cho 10 bài học đầu (bài 1–10)
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

/**
 * LESSONS — cấu trúc 14 bài học cố định (áp dụng như nhau cho Hiragana/Katakana/Cả hai).
 *   - kind: "row"    → bài 1–10, dạy chữ mới theo nhóm phụ âm (dùng field `group`)
 *   - kind: "stroke" → bài 11–14, chỉ ôn lại chữ ĐÃ HỌC, lọc theo `strokeLevel`/`lookalike`
 *                      (field `filterKey` trỏ tới giá trị cần so khớp trên mỗi chữ)
 */
const LESSONS = [
  { id: 1, kind: "row", key: "vowel", title: "Nguyên Âm", subtitle: "Dễ như ăn kẹo, đừng có than" },
  { id: 2, kind: "row", key: "k", title: "Hàng K", subtitle: "Học lẹ lên não cá" },
  { id: 3, kind: "row", key: "s", title: "Hàng S", subtitle: "Sương sương thôi mà kêu" },
  { id: 4, kind: "row", key: "t", title: "Hàng T", subtitle: "Thử thách nhẹ, đừng khóc" },
  { id: 5, kind: "row", key: "n", title: "Hàng N", subtitle: "Ráng nhớ, đừng não cá" },
  { id: 6, kind: "row", key: "h", title: "Hàng H", subtitle: "Hại não xíu thôi, ráng lên" },
  { id: 7, kind: "row", key: "m", title: "Hàng M", subtitle: "Mệt hả? Học tiếp đi" },
  { id: 8, kind: "row", key: "y", title: "Hàng Y", subtitle: "Có 3 chữ thôi mà cũng kêu" },
  { id: 9, kind: "row", key: "r", title: "Hàng R", subtitle: "Ráng lên, sắp thoát rồi" },
  { id: 10, kind: "row", key: "w", title: "Hàng W + N", subtitle: "Chốt đơn, xong 10 bài rồi đấy" },
  {
    id: 11,
    kind: "stroke",
    key: "stroke_easy",
    filterField: "strokeLevel",
    filterValue: "easy",
    title: "Nét Dễ Ẹc",
    subtitle: "1–2 nét thôi, dễ như ăn cháo",
  },
  {
    id: 12,
    kind: "stroke",
    key: "stroke_mid",
    filterField: "strokeLevel",
    filterValue: "mid",
    title: "Nét Tàm Tạm",
    subtitle: "2–3 nét, bắt đầu nhức não nhẹ",
  },
  {
    id: 13,
    kind: "stroke",
    key: "stroke_hard",
    filterField: "strokeLevel",
    filterValue: "hard",
    title: "Nét Khó Nhai",
    subtitle: "3–4 nét, cắn răng mà học",
  },
  {
    id: 14,
    kind: "stroke",
    key: "lookalike",
    filterField: "lookalike",
    filterValue: true,
    title: "Chữ Dễ Lú",
    subtitle: "Phân biệt đi kẻo lú lẫn banh nóc",
  },
];

// Số bài (trong 10 bài 1–10) cần hoàn thành trước khi mở khóa bài 11–14
const STROKE_LESSONS_UNLOCK_COUNT = 5;
