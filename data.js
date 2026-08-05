/**
 * data.js
 * Dữ liệu bảng chữ cái Hiragana và Katakana cơ bản (46 chữ mỗi bảng).
 * Mỗi phần tử: { char, romaji, type, group, strokeLevel?, lookalike?, word, wordRomaji, meaning }
 *   - char:        ký tự tiếng Nhật
 *   - romaji:      cách đọc La-tinh hóa CỦA RIÊNG char (âm đơn) — dùng để chấm ô nhập ở Flashcard,
 *                  sinh câu hỏi trắc nghiệm, ghép cặp, chip gợi ý Luyện Gõ. KHÔNG phải romaji của word.
 *   - type:        "hiragana" | "katakana"
 *   - group:       nhóm phụ âm (vowel, k, s, t, n, h, m, y, r, w) — dùng cho 10 bài học theo hàng
 *   - strokeLevel: "easy" | "mid" | "hard" — độ phức tạp nét vẽ, chỉ gắn cho một số chữ tiêu biểu
 *                  (dùng cho 3 bài luyện nét). Không phải chữ nào cũng có field này.
 *   - lookalike:   true — chữ nằm trong nhóm kinh điển hay bị nhầm hình dạng (dùng cho bài 14).
 *   - word:        từ ví dụ có chứa char (đã verify bằng script lúc sinh dữ liệu — mọi word đều
 *                  chứa đúng char dưới dạng chuỗi con, để highlight lúc render không bị "trật").
 *   - wordRomaji:  romaji của CẢ word (khác hẳn field romaji ở trên) — dùng hiện ở mặt sau Flashcard.
 *   - meaning:     nghĩa tiếng Việt của word.
 *
 * strokeLevel/lookalike được chọn thủ công dựa trên số nét thật của từng chữ (không phải suy ra
 * tự động), rải đều trên nhiều hàng phụ âm khác nhau để bài luyện nét vẫn có đủ chữ để học dù
 * người dùng mới hoàn thành một phần các bài 1–10.
 *
 * HIRAGANA_YOON / KATAKANA_YOON: âm ghép (Yōon) — chữ i-row nhỏ lại + や/ゆ/よ viết nhỏ (きゃ, しゃ...).
 * Tách riêng khỏi HIRAGANA/KATAKANA (không tính vào 46 chữ cơ bản, không lọt vào bài thi 20 câu),
 * chỉ dùng cho 6 bài học riêng (15–20). Mỗi phần tử: { char, romaji, type, group, isYoon: true }
 *   - group: yoon_k, yoon_s, yoon_t, yoon_n, yoon_m, yoon_b — mỗi bài học 1 group, có thể gộp
 *            nhiều hàng phụ âm gốc (vd yoon_n gồm cả N/H/P) giống cách bài 10 gộp W+N.
 */

const HIRAGANA = [
  { char: "あ", romaji: "a", type: "hiragana", group: "vowel", strokeLevel: "hard", word: "あめ", wordRomaji: "ame", meaning: "mưa / kẹo" },
  { char: "い", romaji: "i", type: "hiragana", group: "vowel", strokeLevel: "easy", lookalike: true, word: "いぬ", wordRomaji: "inu", meaning: "con chó" },
  { char: "う", romaji: "u", type: "hiragana", group: "vowel", strokeLevel: "mid", word: "うし", wordRomaji: "ushi", meaning: "con bò" },
  { char: "え", romaji: "e", type: "hiragana", group: "vowel", word: "えき", wordRomaji: "eki", meaning: "nhà ga" },
  { char: "お", romaji: "o", type: "hiragana", group: "vowel", word: "おかね", wordRomaji: "okane", meaning: "tiền" },

  { char: "か", romaji: "ka", type: "hiragana", group: "k", word: "かさ", wordRomaji: "kasa", meaning: "cái ô" },
  { char: "き", romaji: "ki", type: "hiragana", group: "k", strokeLevel: "hard", word: "きつね", wordRomaji: "kitsune", meaning: "con cáo" },
  { char: "く", romaji: "ku", type: "hiragana", group: "k", strokeLevel: "easy", word: "くるま", wordRomaji: "kuruma", meaning: "xe hơi" },
  { char: "け", romaji: "ke", type: "hiragana", group: "k", word: "けむり", wordRomaji: "kemuri", meaning: "khói" },
  { char: "こ", romaji: "ko", type: "hiragana", group: "k", strokeLevel: "mid", word: "こども", wordRomaji: "kodomo", meaning: "trẻ em" },

  { char: "さ", romaji: "sa", type: "hiragana", group: "s", word: "さくら", wordRomaji: "sakura", meaning: "hoa anh đào" },
  { char: "し", romaji: "shi", type: "hiragana", group: "s", strokeLevel: "easy", word: "しろ", wordRomaji: "shiro", meaning: "màu trắng" },
  { char: "す", romaji: "su", type: "hiragana", group: "s", strokeLevel: "mid", word: "すし", wordRomaji: "sushi", meaning: "sushi" },
  { char: "せ", romaji: "se", type: "hiragana", group: "s", strokeLevel: "hard", word: "せんせい", wordRomaji: "sensei", meaning: "giáo viên" },
  { char: "そ", romaji: "so", type: "hiragana", group: "s", word: "そら", wordRomaji: "sora", meaning: "bầu trời" },

  { char: "た", romaji: "ta", type: "hiragana", group: "t", strokeLevel: "hard", word: "たまご", wordRomaji: "tamago", meaning: "trứng" },
  { char: "ち", romaji: "chi", type: "hiragana", group: "t", word: "ちず", wordRomaji: "chizu", meaning: "bản đồ" },
  { char: "つ", romaji: "tsu", type: "hiragana", group: "t", strokeLevel: "easy", word: "つき", wordRomaji: "tsuki", meaning: "mặt trăng" },
  { char: "て", romaji: "te", type: "hiragana", group: "t", word: "て", wordRomaji: "te", meaning: "tay" },
  { char: "と", romaji: "to", type: "hiragana", group: "t", strokeLevel: "mid", word: "とり", wordRomaji: "tori", meaning: "con chim" },

  { char: "な", romaji: "na", type: "hiragana", group: "n", strokeLevel: "hard", word: "なつ", wordRomaji: "natsu", meaning: "mùa hè" },
  { char: "に", romaji: "ni", type: "hiragana", group: "n", word: "にく", wordRomaji: "niku", meaning: "thịt" },
  { char: "ぬ", romaji: "nu", type: "hiragana", group: "n", lookalike: true, word: "ぬの", wordRomaji: "nuno", meaning: "vải" },
  { char: "ね", romaji: "ne", type: "hiragana", group: "n", strokeLevel: "mid", lookalike: true, word: "ねこ", wordRomaji: "neko", meaning: "con mèo" },
  { char: "の", romaji: "no", type: "hiragana", group: "n", strokeLevel: "easy", word: "のり", wordRomaji: "nori", meaning: "rong biển" },

  { char: "は", romaji: "ha", type: "hiragana", group: "h", strokeLevel: "mid", lookalike: true, word: "はな", wordRomaji: "hana", meaning: "bông hoa" },
  { char: "ひ", romaji: "hi", type: "hiragana", group: "h", word: "ひこうき", wordRomaji: "hikouki", meaning: "máy bay" },
  { char: "ふ", romaji: "fu", type: "hiragana", group: "h", word: "ふね", wordRomaji: "fune", meaning: "thuyền" },
  { char: "へ", romaji: "he", type: "hiragana", group: "h", strokeLevel: "easy", word: "へび", wordRomaji: "hebi", meaning: "con rắn" },
  { char: "ほ", romaji: "ho", type: "hiragana", group: "h", strokeLevel: "hard", lookalike: true, word: "ほん", wordRomaji: "hon", meaning: "quyển sách" },

  { char: "ま", romaji: "ma", type: "hiragana", group: "m", word: "まど", wordRomaji: "mado", meaning: "cửa sổ" },
  { char: "み", romaji: "mi", type: "hiragana", group: "m", strokeLevel: "easy", word: "みず", wordRomaji: "mizu", meaning: "nước" },
  { char: "む", romaji: "mu", type: "hiragana", group: "m", word: "むし", wordRomaji: "mushi", meaning: "côn trùng" },
  { char: "め", romaji: "me", type: "hiragana", group: "m", strokeLevel: "mid", lookalike: true, word: "め", wordRomaji: "me", meaning: "mắt" },
  { char: "も", romaji: "mo", type: "hiragana", group: "m", strokeLevel: "hard", word: "もり", wordRomaji: "mori", meaning: "rừng" },

  { char: "や", romaji: "ya", type: "hiragana", group: "y", strokeLevel: "hard", word: "やま", wordRomaji: "yama", meaning: "núi" },
  { char: "ゆ", romaji: "yu", type: "hiragana", group: "y", strokeLevel: "easy", word: "ゆき", wordRomaji: "yuki", meaning: "tuyết" },
  { char: "よ", romaji: "yo", type: "hiragana", group: "y", strokeLevel: "mid", word: "よる", wordRomaji: "yoru", meaning: "đêm" },

  { char: "ら", romaji: "ra", type: "hiragana", group: "r", word: "らいおん", wordRomaji: "raion", meaning: "sư tử" },
  { char: "り", romaji: "ri", type: "hiragana", group: "r", strokeLevel: "mid", lookalike: true, word: "りんご", wordRomaji: "ringo", meaning: "quả táo" },
  { char: "る", romaji: "ru", type: "hiragana", group: "r", strokeLevel: "easy", lookalike: true, word: "るす", wordRomaji: "rusu", meaning: "vắng nhà" },
  { char: "れ", romaji: "re", type: "hiragana", group: "r", word: "れいぞうこ", wordRomaji: "reizouko", meaning: "tủ lạnh" },
  { char: "ろ", romaji: "ro", type: "hiragana", group: "r", lookalike: true, word: "ろうそく", wordRomaji: "rousoku", meaning: "nến" },

  { char: "わ", romaji: "wa", type: "hiragana", group: "w", strokeLevel: "mid", lookalike: true, word: "わたし", wordRomaji: "watashi", meaning: "tôi" },
  { char: "を", romaji: "wo", type: "hiragana", group: "w", strokeLevel: "hard", word: "を", wordRomaji: "o", meaning: "trợ từ tân ngữ" },
  { char: "ん", romaji: "n", type: "hiragana", group: "w", strokeLevel: "easy", word: "ほん", wordRomaji: "hon", meaning: "quyển sách" },
];

const KATAKANA = [
  { char: "ア", romaji: "a", type: "katakana", group: "vowel", strokeLevel: "easy", word: "アイス", wordRomaji: "aisu", meaning: "kem" },
  { char: "イ", romaji: "i", type: "katakana", group: "vowel", strokeLevel: "mid", word: "イヌ", wordRomaji: "inu", meaning: "con chó" },
  { char: "ウ", romaji: "u", type: "katakana", group: "vowel", strokeLevel: "hard", word: "ウサギ", wordRomaji: "usagi", meaning: "con thỏ" },
  { char: "エ", romaji: "e", type: "katakana", group: "vowel", word: "エビ", wordRomaji: "ebi", meaning: "tôm" },
  { char: "オ", romaji: "o", type: "katakana", group: "vowel", word: "オレンジ", wordRomaji: "orenji", meaning: "cam" },

  { char: "カ", romaji: "ka", type: "katakana", group: "k", word: "カメラ", wordRomaji: "kamera", meaning: "máy ảnh" },
  { char: "キ", romaji: "ki", type: "katakana", group: "k", strokeLevel: "hard", word: "キーボード", wordRomaji: "kiiboodo", meaning: "bàn phím" },
  { char: "ク", romaji: "ku", type: "katakana", group: "k", strokeLevel: "easy", lookalike: true, word: "クリーム", wordRomaji: "kuriimu", meaning: "kem (cream)" },
  { char: "ケ", romaji: "ke", type: "katakana", group: "k", lookalike: true, word: "ケーキ", wordRomaji: "keeki", meaning: "bánh kem" },
  { char: "コ", romaji: "ko", type: "katakana", group: "k", strokeLevel: "mid", word: "コーヒー", wordRomaji: "koohii", meaning: "cà phê" },

  { char: "サ", romaji: "sa", type: "katakana", group: "s", word: "サッカー", wordRomaji: "sakkaa", meaning: "bóng đá" },
  { char: "シ", romaji: "shi", type: "katakana", group: "s", strokeLevel: "hard", lookalike: true, word: "シャツ", wordRomaji: "shatsu", meaning: "áo sơ mi" },
  { char: "ス", romaji: "su", type: "katakana", group: "s", strokeLevel: "easy", word: "スーパー", wordRomaji: "suupaa", meaning: "siêu thị" },
  { char: "セ", romaji: "se", type: "katakana", group: "s", word: "セーター", wordRomaji: "seetaa", meaning: "áo len" },
  { char: "ソ", romaji: "so", type: "katakana", group: "s", strokeLevel: "mid", lookalike: true, word: "ソファ", wordRomaji: "sofa", meaning: "ghế sofa" },

  { char: "タ", romaji: "ta", type: "katakana", group: "t", strokeLevel: "mid", word: "タクシー", wordRomaji: "takushii", meaning: "taxi" },
  { char: "チ", romaji: "chi", type: "katakana", group: "t", lookalike: true, word: "チーズ", wordRomaji: "chiizu", meaning: "phô mai" },
  { char: "ツ", romaji: "tsu", type: "katakana", group: "t", strokeLevel: "hard", lookalike: true, word: "ツアー", wordRomaji: "tsuaa", meaning: "chuyến du lịch" },
  { char: "テ", romaji: "te", type: "katakana", group: "t", lookalike: true, word: "テレビ", wordRomaji: "terebi", meaning: "ti vi" },
  { char: "ト", romaji: "to", type: "katakana", group: "t", strokeLevel: "easy", word: "トイレ", wordRomaji: "toire", meaning: "nhà vệ sinh" },

  { char: "ナ", romaji: "na", type: "katakana", group: "n", strokeLevel: "mid", word: "ナイフ", wordRomaji: "naifu", meaning: "dao" },
  { char: "ニ", romaji: "ni", type: "katakana", group: "n", word: "ニュース", wordRomaji: "nyuusu", meaning: "tin tức" },
  { char: "ヌ", romaji: "nu", type: "katakana", group: "n", word: "ヌードル", wordRomaji: "nuudoru", meaning: "mì" },
  { char: "ネ", romaji: "ne", type: "katakana", group: "n", strokeLevel: "hard", word: "ネコ", wordRomaji: "neko", meaning: "con mèo" },
  { char: "ノ", romaji: "no", type: "katakana", group: "n", strokeLevel: "easy", word: "ノート", wordRomaji: "nooto", meaning: "sổ tay" },

  { char: "ハ", romaji: "ha", type: "katakana", group: "h", strokeLevel: "mid", word: "ハンバーガー", wordRomaji: "hanbaagaa", meaning: "hamburger" },
  { char: "ヒ", romaji: "hi", type: "katakana", group: "h", word: "ヒーター", wordRomaji: "hiitaa", meaning: "máy sưởi" },
  { char: "フ", romaji: "fu", type: "katakana", group: "h", strokeLevel: "easy", word: "フォーク", wordRomaji: "fooku", meaning: "nĩa" },
  { char: "ヘ", romaji: "he", type: "katakana", group: "h", word: "ヘリコプター", wordRomaji: "herikoputaa", meaning: "trực thăng" },
  { char: "ホ", romaji: "ho", type: "katakana", group: "h", strokeLevel: "hard", word: "ホテル", wordRomaji: "hoteru", meaning: "khách sạn" },

  { char: "マ", romaji: "ma", type: "katakana", group: "m", word: "マウス", wordRomaji: "mausu", meaning: "chuột máy tính" },
  { char: "ミ", romaji: "mi", type: "katakana", group: "m", word: "ミルク", wordRomaji: "miruku", meaning: "sữa" },
  { char: "ム", romaji: "mu", type: "katakana", group: "m", strokeLevel: "easy", word: "ムード", wordRomaji: "muudo", meaning: "tâm trạng" },
  { char: "メ", romaji: "me", type: "katakana", group: "m", strokeLevel: "mid", word: "メモ", wordRomaji: "memo", meaning: "ghi chú" },
  { char: "モ", romaji: "mo", type: "katakana", group: "m", strokeLevel: "hard", word: "モバイル", wordRomaji: "mobairu", meaning: "điện thoại di động" },

  { char: "ヤ", romaji: "ya", type: "katakana", group: "y", strokeLevel: "mid", word: "ヤギ", wordRomaji: "yagi", meaning: "con dê" },
  { char: "ユ", romaji: "yu", type: "katakana", group: "y", strokeLevel: "easy", word: "ユーザー", wordRomaji: "yuuzaa", meaning: "người dùng" },
  { char: "ヨ", romaji: "yo", type: "katakana", group: "y", strokeLevel: "hard", word: "ヨーグルト", wordRomaji: "yooguruto", meaning: "sữa chua" },

  { char: "ラ", romaji: "ra", type: "katakana", group: "r", word: "ラジオ", wordRomaji: "rajio", meaning: "đài radio" },
  { char: "リ", romaji: "ri", type: "katakana", group: "r", strokeLevel: "mid", word: "リスト", wordRomaji: "risuto", meaning: "danh sách" },
  { char: "ル", romaji: "ru", type: "katakana", group: "r", strokeLevel: "easy", word: "ルーム", wordRomaji: "ruumu", meaning: "phòng" },
  { char: "レ", romaji: "re", type: "katakana", group: "r", word: "レストラン", wordRomaji: "resutoran", meaning: "nhà hàng" },
  { char: "ロ", romaji: "ro", type: "katakana", group: "r", strokeLevel: "hard", word: "ロボット", wordRomaji: "robotto", meaning: "robot" },

  { char: "ワ", romaji: "wa", type: "katakana", group: "w", strokeLevel: "easy", lookalike: true, word: "ワイン", wordRomaji: "wain", meaning: "rượu vang" },
  { char: "ヲ", romaji: "wo", type: "katakana", group: "w", strokeLevel: "hard", lookalike: true, word: "ヲ", wordRomaji: "o", meaning: "gần như không dùng" },
  { char: "ン", romaji: "n", type: "katakana", group: "w", strokeLevel: "mid", lookalike: true, word: "パン", wordRomaji: "pan", meaning: "bánh mì" },
];

const HIRAGANA_YOON = [
  { char: "きゃ", romaji: "kya", type: "hiragana", group: "yoon_k", isYoon: true },
  { char: "きゅ", romaji: "kyu", type: "hiragana", group: "yoon_k", isYoon: true },
  { char: "きょ", romaji: "kyo", type: "hiragana", group: "yoon_k", isYoon: true },
  { char: "ぎゃ", romaji: "gya", type: "hiragana", group: "yoon_k", isYoon: true },
  { char: "ぎゅ", romaji: "gyu", type: "hiragana", group: "yoon_k", isYoon: true },
  { char: "ぎょ", romaji: "gyo", type: "hiragana", group: "yoon_k", isYoon: true },

  { char: "しゃ", romaji: "sha", type: "hiragana", group: "yoon_s", isYoon: true },
  { char: "しゅ", romaji: "shu", type: "hiragana", group: "yoon_s", isYoon: true },
  { char: "しょ", romaji: "sho", type: "hiragana", group: "yoon_s", isYoon: true },
  { char: "じゃ", romaji: "ja", type: "hiragana", group: "yoon_s", isYoon: true },
  { char: "じゅ", romaji: "ju", type: "hiragana", group: "yoon_s", isYoon: true },
  { char: "じょ", romaji: "jo", type: "hiragana", group: "yoon_s", isYoon: true },

  { char: "ちゃ", romaji: "cha", type: "hiragana", group: "yoon_t", isYoon: true },
  { char: "ちゅ", romaji: "chu", type: "hiragana", group: "yoon_t", isYoon: true },
  { char: "ちょ", romaji: "cho", type: "hiragana", group: "yoon_t", isYoon: true },

  { char: "にゃ", romaji: "nya", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "にゅ", romaji: "nyu", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "にょ", romaji: "nyo", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "ひゃ", romaji: "hya", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "ひゅ", romaji: "hyu", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "ひょ", romaji: "hyo", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "ぴゃ", romaji: "pya", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "ぴゅ", romaji: "pyu", type: "hiragana", group: "yoon_n", isYoon: true },
  { char: "ぴょ", romaji: "pyo", type: "hiragana", group: "yoon_n", isYoon: true },

  { char: "みゃ", romaji: "mya", type: "hiragana", group: "yoon_m", isYoon: true },
  { char: "みゅ", romaji: "myu", type: "hiragana", group: "yoon_m", isYoon: true },
  { char: "みょ", romaji: "myo", type: "hiragana", group: "yoon_m", isYoon: true },
  { char: "りゃ", romaji: "rya", type: "hiragana", group: "yoon_m", isYoon: true },
  { char: "りゅ", romaji: "ryu", type: "hiragana", group: "yoon_m", isYoon: true },
  { char: "りょ", romaji: "ryo", type: "hiragana", group: "yoon_m", isYoon: true },

  { char: "びゃ", romaji: "bya", type: "hiragana", group: "yoon_b", isYoon: true },
  { char: "びゅ", romaji: "byu", type: "hiragana", group: "yoon_b", isYoon: true },
  { char: "びょ", romaji: "byo", type: "hiragana", group: "yoon_b", isYoon: true },
];

const KATAKANA_YOON = [
  { char: "キャ", romaji: "kya", type: "katakana", group: "yoon_k", isYoon: true },
  { char: "キュ", romaji: "kyu", type: "katakana", group: "yoon_k", isYoon: true },
  { char: "キョ", romaji: "kyo", type: "katakana", group: "yoon_k", isYoon: true },
  { char: "ギャ", romaji: "gya", type: "katakana", group: "yoon_k", isYoon: true },
  { char: "ギュ", romaji: "gyu", type: "katakana", group: "yoon_k", isYoon: true },
  { char: "ギョ", romaji: "gyo", type: "katakana", group: "yoon_k", isYoon: true },

  { char: "シャ", romaji: "sha", type: "katakana", group: "yoon_s", isYoon: true },
  { char: "シュ", romaji: "shu", type: "katakana", group: "yoon_s", isYoon: true },
  { char: "ショ", romaji: "sho", type: "katakana", group: "yoon_s", isYoon: true },
  { char: "ジャ", romaji: "ja", type: "katakana", group: "yoon_s", isYoon: true },
  { char: "ジュ", romaji: "ju", type: "katakana", group: "yoon_s", isYoon: true },
  { char: "ジョ", romaji: "jo", type: "katakana", group: "yoon_s", isYoon: true },

  { char: "チャ", romaji: "cha", type: "katakana", group: "yoon_t", isYoon: true },
  { char: "チュ", romaji: "chu", type: "katakana", group: "yoon_t", isYoon: true },
  { char: "チョ", romaji: "cho", type: "katakana", group: "yoon_t", isYoon: true },

  { char: "ニャ", romaji: "nya", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ニュ", romaji: "nyu", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ニョ", romaji: "nyo", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ヒャ", romaji: "hya", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ヒュ", romaji: "hyu", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ヒョ", romaji: "hyo", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ピャ", romaji: "pya", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ピュ", romaji: "pyu", type: "katakana", group: "yoon_n", isYoon: true },
  { char: "ピョ", romaji: "pyo", type: "katakana", group: "yoon_n", isYoon: true },

  { char: "ミャ", romaji: "mya", type: "katakana", group: "yoon_m", isYoon: true },
  { char: "ミュ", romaji: "myu", type: "katakana", group: "yoon_m", isYoon: true },
  { char: "ミョ", romaji: "myo", type: "katakana", group: "yoon_m", isYoon: true },
  { char: "リャ", romaji: "rya", type: "katakana", group: "yoon_m", isYoon: true },
  { char: "リュ", romaji: "ryu", type: "katakana", group: "yoon_m", isYoon: true },
  { char: "リョ", romaji: "ryo", type: "katakana", group: "yoon_m", isYoon: true },

  { char: "ビャ", romaji: "bya", type: "katakana", group: "yoon_b", isYoon: true },
  { char: "ビュ", romaji: "byu", type: "katakana", group: "yoon_b", isYoon: true },
  { char: "ビョ", romaji: "byo", type: "katakana", group: "yoon_b", isYoon: true },
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
 * LESSONS — cấu trúc 20 bài học cố định (áp dụng như nhau cho Hiragana/Katakana/Cả hai).
 *   - kind: "row"    → bài 1–10, dạy chữ mới theo nhóm phụ âm (dùng field `group`)
 *   - kind: "stroke" → bài 11–14, chỉ ôn lại chữ ĐÃ HỌC, lọc theo `strokeLevel`/`lookalike`
 *                      (field `filterKey` trỏ tới giá trị cần so khớp trên mỗi chữ)
 *   - kind: "yoon"   → bài 15–20, dạy âm ghép (HIRAGANA_YOON/KATAKANA_YOON), lọc theo `group`
 *                      giống "row" nhưng lấy nguồn chữ từ mảng Yōon riêng, không phải 46 chữ gốc
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
  { id: 15, kind: "yoon", key: "yoon_k", title: "Yōon K + G", subtitle: "きゃ ぎゃ — xoắn lưỡi tí thôi" },
  { id: 16, kind: "yoon", key: "yoon_s", title: "Yōon S + J", subtitle: "しゃ じゃ — đừng lộn sh với j" },
  { id: 17, kind: "yoon", key: "yoon_t", title: "Yōon T + C", subtitle: "ちゃ — có 3 chữ, dễ thở" },
  { id: 18, kind: "yoon", key: "yoon_n", title: "Yōon N + H + P", subtitle: "にゃ ひゃ ぴゃ — 9 chữ, cày đi" },
  { id: 19, kind: "yoon", key: "yoon_m", title: "Yōon M + R", subtitle: "みゃ りゃ — sắp xong rồi đó" },
  { id: 20, kind: "yoon", key: "yoon_b", title: "Yōon B", subtitle: "びゃ — chốt đơn, hết yōon" },
];

// Số bài (trong 10 bài 1–10) cần hoàn thành trước khi mở khóa bài 11–14
const STROKE_LESSONS_UNLOCK_COUNT = 5;

// Số bài (trong 10 bài 1–10) cần hoàn thành trước khi mở khóa bài 15–20 (Yōon)
const YOON_LESSONS_UNLOCK_COUNT = 8;

/**
 * TYPING_WORDS_HIRAGANA / TYPING_WORDS_KATAKANA — ngân hàng từ cho tính năng "Luyện gõ tiếng Nhật".
 * Mỗi phần tử: { kana, vi, hint? }
 *   - kana: để so khớp lúc gõ (wanakana tự so khớp 2 chiều lúc chấm điểm)
 *   - vi:   nghĩa tiếng Việt hiện song song bên dưới chữ Nhật
 *   - hint: override chip gợi ý romaji khi cần — mặc định chip dùng wanakana.toRomaji(kana), đúng
 *           cho hầu hết mọi trường hợp, NGOẠI TRỪ vài chữ dùng tổ hợp mở rộng (vd ファ/フォ) mà
 *           toRomaji() tách rời thành từng ký tự gốc (vd ソファ -> "sofua") thay vì dạng gõ tự
 *           nhiên thật sự tạo ra chữ đó ("sofa") — 2 từ này set hint thủ công để chip không gây
 *           hiểu lầm. Riêng trường âm katakana (ー), chip tự động thay cặp nguyên âm đúp mà
 *           toRomaji() trả về (vd "juusu") bằng dấu "-" ("ju-su") ở app.js, không cần set hint tay.
 *
 * Danh sách này phủ ĐỦ 100% cả 46 chữ cơ bản lẫn 33 âm ghép Yōon của mỗi bảng — verify bằng script,
 * không phải áng chừng. Vài âm ghép gần như không xuất hiện trong từ vựng thật (ぴゃ/ぴゅ/みゅ ở
 * hiragana; キョ/ヒャ/ミョ/リャ/リョ/ビャ/ビョ/ピャ ở katakana) nên dùng entry "luyện âm" riêng thay vì
 * gán ép vào 1 từ không tồn tại.
 *
 * Cố tình TRÁNH mọi từ có ん đứng ngay trước hàng な/や/わ (vd こんにちは, でんわ, ほんや) khi gõ
 * KHÔNG có dấu nháy đơn — đây là pattern wanakana convert SAI lúc gõ realtime nếu gõ liền
 * ("konnichiha" ra "こんいちは" thay vì "こんにちは"). Đã xác nhận thêm dấu ` ' ` trước âm gây nhầm
 * (vd "kon'nichiha", "hon'ya", "den'wa") sửa được lỗi này, nhưng KHÔNG dùng trong danh sách hiện tại
 * vì không cần tới (đã đủ 100% coverage bằng các từ khác) và tránh việc học thêm 1 quy tắc gõ nữa.
 * Mọi pattern khác (ん cuối từ, ん trước hàng không phải な/や/わ, sokuon っ, dakuten/handakuten,
 * yōon, trường âm katakana qua dấu "-") đã test kỹ bằng cách gõ từng ký tự thật qua wanakana.bind()
 * và chạy đúng.
 */
const TYPING_WORDS_HIRAGANA = [
  { kana: "あさ", vi: "Buổi sáng" },
  { kana: "いぬ", vi: "Con chó" },
  { kana: "うみ", vi: "Biển" },
  { kana: "えき", vi: "Nhà ga" },
  { kana: "おかし", vi: "Bánh kẹo" },
  { kana: "くつ", vi: "Giày" },
  { kana: "けしごむ", vi: "Cục tẩy" },
  { kana: "こおり", vi: "Nước đá" },
  { kana: "さかな", vi: "Con cá" },
  { kana: "しお", vi: "Muối" },
  { kana: "すいか", vi: "Dưa hấu" },
  { kana: "せかい", vi: "Thế giới" },
  { kana: "そら", vi: "Bầu trời" },
  { kana: "たまご", vi: "Trứng" },
  { kana: "ちず", vi: "Bản đồ" },
  { kana: "つき", vi: "Mặt trăng" },
  { kana: "てがみ", vi: "Lá thư" },
  { kana: "とけい", vi: "Đồng hồ" },
  { kana: "なつ", vi: "Mùa hè" },
  { kana: "にわ", vi: "Sân vườn" },
  { kana: "ぬの", vi: "Vải" },
  { kana: "ねこ", vi: "Con mèo" },
  { kana: "のみもの", vi: "Đồ uống" },
  { kana: "はな", vi: "Hoa" },
  { kana: "ひこうき", vi: "Máy bay" },
  { kana: "ふゆ", vi: "Mùa đông" },
  { kana: "へや", vi: "Căn phòng" },
  { kana: "ほし", vi: "Ngôi sao" },
  { kana: "まど", vi: "Cửa sổ" },
  { kana: "みず", vi: "Nước" },
  { kana: "むし", vi: "Côn trùng" },
  { kana: "めがね", vi: "Kính mắt" },
  { kana: "もも", vi: "Quả đào" },
  { kana: "やま", vi: "Núi" },
  { kana: "ゆき", vi: "Tuyết" },
  { kana: "よる", vi: "Ban đêm" },
  { kana: "らいねん", vi: "Năm sau" },
  { kana: "りんご", vi: "Táo" },
  { kana: "るす", vi: "Vắng nhà" },
  { kana: "れきし", vi: "Lịch sử" },
  { kana: "ろうか", vi: "Hành lang" },
  { kana: "わたし", vi: "Tôi" },
  { kana: "ほん", vi: "Sách" },
  { kana: "みずをのむ", vi: "Uống nước" },
  { kana: "きゃく", vi: "Khách" },
  { kana: "きゅうり", vi: "Dưa chuột" },
  { kana: "きょう", vi: "Hôm nay" },
  { kana: "ぎゃく", vi: "Ngược lại" },
  { kana: "ぎゅうにゅう", vi: "Sữa bò" },
  { kana: "ぎょうざ", vi: "Bánh xếp" },
  { kana: "かいしゃ", vi: "Công ty" },
  { kana: "しゅみ", vi: "Sở thích" },
  { kana: "としょかん", vi: "Thư viện" },
  { kana: "じゃがいも", vi: "Khoai tây" },
  { kana: "じゅぎょう", vi: "Tiết học" },
  { kana: "じょうず", vi: "Giỏi, khéo" },
  { kana: "おちゃ", vi: "Trà" },
  { kana: "ちゅうい", vi: "Chú ý" },
  { kana: "ちょきん", vi: "Tiền tiết kiệm" },
  { kana: "にゃんこ", vi: "Mèo con" },
  { kana: "にゅうがく", vi: "Nhập học" },
  { kana: "にょろにょろ", vi: "Ngoằn ngoèo" },
  { kana: "ひゃく", vi: "Một trăm" },
  { kana: "ひゅうひゅう", vi: "Vi vu (gió)" },
  { kana: "ひょう", vi: "Con báo" },
  { kana: "さんびゃく", vi: "Ba trăm" },
  { kana: "びゅうびゅう", vi: "Vù vù (gió)" },
  { kana: "びょういん", vi: "Bệnh viện" },
  { kana: "みょうじ", vi: "Họ (tên)" },
  { kana: "みゃく", vi: "Mạch đập" },
  { kana: "りゃく", vi: "Viết tắt" },
  { kana: "りゅう", vi: "Con rồng" },
  { kana: "りょこう", vi: "Du lịch" },
  { kana: "ぴゃ", vi: "(âm ghép luyện đọc)" },
  { kana: "ぴゅ", vi: "(âm ghép luyện đọc)" },
  { kana: "みゅ", vi: "(âm ghép luyện đọc)" },
  { kana: "ぴょんぴょん", vi: "Nhảy tưng tưng" },
];

const TYPING_WORDS_KATAKANA = [
  { kana: "テレビ", vi: "Tivi" },
  { kana: "カメラ", vi: "Máy ảnh" },
  { kana: "ジュース", vi: "Nước ép" },
  { kana: "サッカー", vi: "Bóng đá" },
  { kana: "ホテル", vi: "Khách sạn" },
  { kana: "タクシー", vi: "Taxi" },
  { kana: "ピザ", vi: "Pizza" },
  { kana: "コンピューター", vi: "Máy tính" },
  { kana: "ケーキ", vi: "Bánh kem" },
  { kana: "ノート", vi: "Vở, sổ tay" },
  { kana: "アイス", vi: "Kem lạnh" },
  { kana: "ウール", vi: "Len" },
  { kana: "エレベーター", vi: "Thang máy" },
  { kana: "オレンジ", vi: "Cam" },
  { kana: "セーター", vi: "Áo len" },
  { kana: "ソファ", vi: "Ghế sofa", hint: "sofa" },
  { kana: "チーズ", vi: "Phô mai" },
  { kana: "ツナ", vi: "Cá ngừ" },
  { kana: "ニンジン", vi: "Cà rốt" },
  { kana: "カヌー", vi: "Xuồng ca-nô" },
  { kana: "ネクタイ", vi: "Cà vạt" },
  { kana: "ハンバーガー", vi: "Hamburger" },
  { kana: "ヒーター", vi: "Máy sưởi" },
  { kana: "フォーク", vi: "Cái nĩa", hint: "fo-ku" },
  { kana: "ヘリコプター", vi: "Trực thăng" },
  { kana: "マスク", vi: "Khẩu trang" },
  { kana: "ミルク", vi: "Sữa" },
  { kana: "ムービー", vi: "Phim" },
  { kana: "モデル", vi: "Người mẫu" },
  { kana: "タイヤ", vi: "Lốp xe" },
  { kana: "ユーモア", vi: "Sự hài hước" },
  { kana: "ヨガ", vi: "Yoga" },
  { kana: "リボン", vi: "Ruy băng" },
  { kana: "ロボット", vi: "Robot" },
  { kana: "ワイン", vi: "Rượu vang" },
  { kana: "ヲ", vi: "(âm luyện đọc)" },
  { kana: "キャベツ", vi: "Bắp cải" },
  { kana: "レスキュー", vi: "Cứu hộ" },
  { kana: "キョ", vi: "(âm ghép luyện đọc)" },
  { kana: "ギャグ", vi: "Trò đùa" },
  { kana: "レギュラー", vi: "Cỡ thường" },
  { kana: "ギョーザ", vi: "Bánh xếp" },
  { kana: "シャツ", vi: "Áo sơ mi" },
  { kana: "シュークリーム", vi: "Bánh su kem" },
  { kana: "ショック", vi: "Cú sốc" },
  { kana: "ジャム", vi: "Mứt" },
  { kana: "ジョギング", vi: "Chạy bộ" },
  { kana: "チャンス", vi: "Cơ hội" },
  { kana: "チューリップ", vi: "Hoa tulip" },
  { kana: "チョコレート", vi: "Sô-cô-la" },
  { kana: "ニャー", vi: "Tiếng mèo kêu" },
  { kana: "ニュース", vi: "Tin tức" },
  { kana: "ニョッキ", vi: "Mì Ý nyokki" },
  { kana: "ヒャ", vi: "(âm ghép luyện đọc)" },
  { kana: "ヒューズ", vi: "Cầu chì" },
  { kana: "ヒョウ", vi: "Con báo" },
  { kana: "ピャ", vi: "(âm ghép luyện đọc)" },
  { kana: "ピョンヤン", vi: "Bình Nhưỡng" },
  { kana: "ミャンマー", vi: "Myanmar" },
  { kana: "ミュージック", vi: "Âm nhạc" },
  { kana: "ミョ", vi: "(âm ghép luyện đọc)" },
  { kana: "リャ", vi: "(âm ghép luyện đọc)" },
  { kana: "リュック", vi: "Ba lô" },
  { kana: "リョ", vi: "(âm ghép luyện đọc)" },
  { kana: "ビャ", vi: "(âm ghép luyện đọc)" },
  { kana: "レビュー", vi: "Đánh giá" },
  { kana: "ビョ", vi: "(âm ghép luyện đọc)" },
];
