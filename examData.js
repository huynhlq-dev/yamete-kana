/**
 * examData.js
 * Ngân hàng đề "Test Final" — 4 đề cố định (mỗi đề độc lập, không trộn lẫn).
 * Nguồn: Tests.JSON (đã sửa lỗi encoding + bổ sung field breakdown thủ công).
 * Mỗi câu hỏi: { question_text, options: {A,B,C,D}, answer, breakdown }
 *   - question_text: đề bài (chữ Nhật hoặc romaji tùy dạng câu)
 *   - options:        4 đáp án (chữ Nhật hoặc romaji, ngược lại với question_text)
 *   - answer:         khóa đáp án đúng ("A"|"B"|"C"|"D")
 *   - breakdown:      tách âm chữ Nhật thành từng cặp {kana, romaji} — chỉ hiện ở màn ôn câu sai
 */

const EXAM_TESTS = [
  {
    "id": 1,
    "title": "KANA-MINI TEST 01 - SWK",
    "questions": [
      {
        "question_text": "あかい",
        "options": {
          "A": "Aka",
          "B": "Akai",
          "C": "Okai",
          "D": "Agai"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "あ",
            "romaji": "A"
          },
          {
            "kana": "か",
            "romaji": "ka"
          },
          {
            "kana": "い",
            "romaji": "i"
          }
        ]
      },
      {
        "question_text": "くうき",
        "options": {
          "A": "Keuki",
          "B": "Kukii",
          "C": "Kuuki",
          "D": "Kuukii"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "く",
            "romaji": "Ku"
          },
          {
            "kana": "う",
            "romaji": "u"
          },
          {
            "kana": "き",
            "romaji": "ki"
          }
        ]
      },
      {
        "question_text": "おへそ",
        "options": {
          "A": "Ahezo",
          "B": "Oheso",
          "C": "Oheho",
          "D": "Aheso"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "お",
            "romaji": "O"
          },
          {
            "kana": "へ",
            "romaji": "he"
          },
          {
            "kana": "そ",
            "romaji": "so"
          }
        ]
      },
      {
        "question_text": "とけい",
        "options": {
          "A": "Tokei",
          "B": "Tokee",
          "C": "Tekei",
          "D": "Tokeu"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "と",
            "romaji": "To"
          },
          {
            "kana": "け",
            "romaji": "ke"
          },
          {
            "kana": "い",
            "romaji": "i"
          }
        ]
      },
      {
        "question_text": "はな",
        "options": {
          "A": "Hana",
          "B": "Hanaa",
          "C": "Hina",
          "D": "Hono"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "は",
            "romaji": "Ha"
          },
          {
            "kana": "な",
            "romaji": "na"
          }
        ]
      },
      {
        "question_text": "Uma",
        "options": {
          "A": "いま",
          "B": "うま",
          "C": "ひな",
          "D": "うな"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "う",
            "romaji": "U"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          }
        ]
      },
      {
        "question_text": "inu",
        "options": {
          "A": "うぬ",
          "B": "うね",
          "C": "いぬ",
          "D": "いめ"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "い",
            "romaji": "I"
          },
          {
            "kana": "ぬ",
            "romaji": "nu"
          }
        ]
      },
      {
        "question_text": "Fune",
        "options": {
          "A": "ふね",
          "B": "ふめ",
          "C": "へね",
          "D": "はね"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ふ",
            "romaji": "Fu"
          },
          {
            "kana": "ね",
            "romaji": "ne"
          }
        ]
      },
      {
        "question_text": "Kutsushita",
        "options": {
          "A": "くつすた",
          "B": "くつすこ",
          "C": "くうした",
          "D": "くつした"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "く",
            "romaji": "Ku"
          },
          {
            "kana": "つ",
            "romaji": "tsu"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "た",
            "romaji": "ta"
          }
        ]
      },
      {
        "question_text": "Seikai",
        "options": {
          "A": "せかい",
          "B": "せいかい",
          "C": "そいかい",
          "D": "へいかい"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "せ",
            "romaji": "Se"
          },
          {
            "kana": "い",
            "romaji": "i"
          },
          {
            "kana": "か",
            "romaji": "ka"
          },
          {
            "kana": "い",
            "romaji": "i"
          }
        ]
      },
      {
        "question_text": "あした はなみ します。",
        "options": {
          "A": "Oshita hanami somasu",
          "B": "Ashita hanami shimasu",
          "C": "Ushita hanami shimasu",
          "D": "Ashita honami shimasu"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "あ",
            "romaji": "A"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "た",
            "romaji": "ta"
          },
          {
            "kana": "は",
            "romaji": "ha"
          },
          {
            "kana": "な",
            "romaji": "na"
          },
          {
            "kana": "み",
            "romaji": "mi"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          },
          {
            "kana": "す",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "きのう すし、かいました。",
        "options": {
          "A": "Kinou sushi, kaimashita",
          "B": "Kinoo sushi, kaimashita",
          "C": "Konou shisu, kaimashita",
          "D": "Kinou sashi, kaimashita"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "き",
            "romaji": "Ki"
          },
          {
            "kana": "の",
            "romaji": "no"
          },
          {
            "kana": "う",
            "romaji": "u"
          },
          {
            "kana": "す",
            "romaji": "su"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "か",
            "romaji": "ka"
          },
          {
            "kana": "い",
            "romaji": "i"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "た",
            "romaji": "ta"
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "title": "KANA_MINI TEST 02",
    "questions": [
      {
        "question_text": "よてい",
        "options": {
          "A": "Yatei",
          "B": "Yote",
          "C": "Yottei",
          "D": "Yotei"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "よ",
            "romaji": "Yo"
          },
          {
            "kana": "て",
            "romaji": "te"
          },
          {
            "kana": "い",
            "romaji": "i"
          }
        ]
      },
      {
        "question_text": "さくら",
        "options": {
          "A": "Sakura",
          "B": "Kikura",
          "C": "Kikusa",
          "D": "Sakuchi"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "さ",
            "romaji": "Sa"
          },
          {
            "kana": "く",
            "romaji": "ku"
          },
          {
            "kana": "ら",
            "romaji": "ra"
          }
        ]
      },
      {
        "question_text": "えんぴつ",
        "options": {
          "A": "Enpitsu",
          "B": "Enbitsu",
          "C": "Enhitsu",
          "D": "inpitsu"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "え",
            "romaji": "E"
          },
          {
            "kana": "ん",
            "romaji": "n"
          },
          {
            "kana": "ぴ",
            "romaji": "pi"
          },
          {
            "kana": "つ",
            "romaji": "tsu"
          }
        ]
      },
      {
        "question_text": "ゆびわ",
        "options": {
          "A": "Yuhiwa",
          "B": "Yobiwa",
          "C": "Yubiwa",
          "D": "Yubire"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "ゆ",
            "romaji": "Yu"
          },
          {
            "kana": "び",
            "romaji": "bi"
          },
          {
            "kana": "わ",
            "romaji": "wa"
          }
        ]
      },
      {
        "question_text": "でんしゃ",
        "options": {
          "A": "Tensha",
          "B": "Densha",
          "C": "Denshiya",
          "D": "Hani"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "で",
            "romaji": "De"
          },
          {
            "kana": "ん",
            "romaji": "n"
          },
          {
            "kana": "しゃ",
            "romaji": "sha"
          }
        ]
      },
      {
        "question_text": "Onigiri",
        "options": {
          "A": "おにぎり",
          "B": "あにぎり",
          "C": "おにさり",
          "D": "あこぎり"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "お",
            "romaji": "O"
          },
          {
            "kana": "に",
            "romaji": "ni"
          },
          {
            "kana": "ぎ",
            "romaji": "gi"
          },
          {
            "kana": "り",
            "romaji": "ri"
          }
        ]
      },
      {
        "question_text": "Bijutsu",
        "options": {
          "A": "びゆつ",
          "B": "ひじつ",
          "C": "びじゅつ",
          "D": "ぴじゅつ"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "び",
            "romaji": "Bi"
          },
          {
            "kana": "じゅ",
            "romaji": "ju"
          },
          {
            "kana": "つ",
            "romaji": "tsu"
          }
        ]
      },
      {
        "question_text": "Okyakusan",
        "options": {
          "A": "あぎゃくさん",
          "B": "おきゃくさん",
          "C": "おきゃくちゃん",
          "D": "おぎゃくしゃん"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "お",
            "romaji": "O"
          },
          {
            "kana": "きゃ",
            "romaji": "kya"
          },
          {
            "kana": "く",
            "romaji": "ku"
          },
          {
            "kana": "さ",
            "romaji": "sa"
          },
          {
            "kana": "ん",
            "romaji": "n"
          }
        ]
      },
      {
        "question_text": "Nihongo",
        "options": {
          "A": "にばんこ",
          "B": "こぼんご",
          "C": "にはんご",
          "D": "にほんご"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "に",
            "romaji": "Ni"
          },
          {
            "kana": "ほ",
            "romaji": "ho"
          },
          {
            "kana": "ん",
            "romaji": "n"
          },
          {
            "kana": "ご",
            "romaji": "go"
          }
        ]
      },
      {
        "question_text": "Ryokou",
        "options": {
          "A": "しょこう",
          "B": "りょうこう",
          "C": "りょこう",
          "D": "りよこう"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "りょ",
            "romaji": "Ryo"
          },
          {
            "kana": "こ",
            "romaji": "ko"
          },
          {
            "kana": "う",
            "romaji": "u"
          }
        ]
      },
      {
        "question_text": "わたしのかのじょは きれいです。",
        "options": {
          "A": "Atashi no kainojo ha kiireii desu.",
          "B": "Watashi no kanojou ha kireidesu.",
          "C": "Watashi no kanojo ha kireidesu.",
          "D": "Wetashi no kanojo ha sareidesu."
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "わ",
            "romaji": "Wa"
          },
          {
            "kana": "た",
            "romaji": "ta"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "の",
            "romaji": "no"
          },
          {
            "kana": "か",
            "romaji": "ka"
          },
          {
            "kana": "の",
            "romaji": "no"
          },
          {
            "kana": "じょ",
            "romaji": "jo"
          },
          {
            "kana": "は",
            "romaji": "ha"
          },
          {
            "kana": "き",
            "romaji": "ki"
          },
          {
            "kana": "れ",
            "romaji": "re"
          },
          {
            "kana": "い",
            "romaji": "i"
          },
          {
            "kana": "で",
            "romaji": "de"
          },
          {
            "kana": "す",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "すずきさんは わたしのかいしゃのしゃちょうです。",
        "options": {
          "A": "Suzukisan ha watashi no kaisha no shachou desu.",
          "B": "Suzukisan ha watashi no kaisho no shachou desu.",
          "C": "Suzukisan ha retashi no kaisa no shachou desu.",
          "D": "Suzukisan ha watashi no kaicha no shichou desu."
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "す",
            "romaji": "Su"
          },
          {
            "kana": "ず",
            "romaji": "zu"
          },
          {
            "kana": "き",
            "romaji": "ki"
          },
          {
            "kana": "さ",
            "romaji": "sa"
          },
          {
            "kana": "ん",
            "romaji": "n"
          },
          {
            "kana": "は",
            "romaji": "ha"
          },
          {
            "kana": "わ",
            "romaji": "wa"
          },
          {
            "kana": "た",
            "romaji": "ta"
          },
          {
            "kana": "し",
            "romaji": "shi"
          },
          {
            "kana": "の",
            "romaji": "no"
          },
          {
            "kana": "か",
            "romaji": "ka"
          },
          {
            "kana": "い",
            "romaji": "i"
          },
          {
            "kana": "しゃ",
            "romaji": "sha"
          },
          {
            "kana": "の",
            "romaji": "no"
          },
          {
            "kana": "しゃ",
            "romaji": "sha"
          },
          {
            "kana": "ちょ",
            "romaji": "cho"
          },
          {
            "kana": "う",
            "romaji": "u"
          },
          {
            "kana": "で",
            "romaji": "de"
          },
          {
            "kana": "す",
            "romaji": "su"
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "title": "KANA_MINI TEST 03",
    "questions": [
      {
        "question_text": "トイレ",
        "options": {
          "A": "toire",
          "B": "torei",
          "C": "tokire",
          "D": "teirei"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ト",
            "romaji": "To"
          },
          {
            "kana": "イ",
            "romaji": "i"
          },
          {
            "kana": "レ",
            "romaji": "re"
          }
        ]
      },
      {
        "question_text": "ナイフ",
        "options": {
          "A": "natofu",
          "B": "meifu",
          "C": "naifu",
          "D": "naiwa"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "ナ",
            "romaji": "Na"
          },
          {
            "kana": "イ",
            "romaji": "i"
          },
          {
            "kana": "フ",
            "romaji": "fu"
          }
        ]
      },
      {
        "question_text": "ピアノ",
        "options": {
          "A": "hiano",
          "B": "piame",
          "C": "piano",
          "D": "biano"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "ピ",
            "romaji": "Pi"
          },
          {
            "kana": "ア",
            "romaji": "a"
          },
          {
            "kana": "ノ",
            "romaji": "no"
          }
        ]
      },
      {
        "question_text": "クモ",
        "options": {
          "A": "wamo",
          "B": "kume",
          "C": "tamo",
          "D": "kumo"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "ク",
            "romaji": "Ku"
          },
          {
            "kana": "モ",
            "romaji": "mo"
          }
        ]
      },
      {
        "question_text": "ダンス",
        "options": {
          "A": "dansu",
          "B": "kunsu",
          "C": "dasosu",
          "D": "tansu"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ダ",
            "romaji": "Da"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "ス",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "ラジオ",
        "options": {
          "A": "rajio",
          "B": "wajio",
          "C": "rashio",
          "D": "fujio"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ラ",
            "romaji": "Ra"
          },
          {
            "kana": "ジ",
            "romaji": "ji"
          },
          {
            "kana": "オ",
            "romaji": "o"
          }
        ]
      },
      {
        "question_text": "kimuchi",
        "options": {
          "A": "キムモ",
          "B": "キムチ",
          "C": "サムチ",
          "D": "キマチ"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "キ",
            "romaji": "Ki"
          },
          {
            "kana": "ム",
            "romaji": "mu"
          },
          {
            "kana": "チ",
            "romaji": "chi"
          }
        ]
      },
      {
        "question_text": "terebi",
        "options": {
          "A": "テルビ",
          "B": "トルヒ",
          "C": "トレビ",
          "D": "テレビ"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "テ",
            "romaji": "Te"
          },
          {
            "kana": "レ",
            "romaji": "re"
          },
          {
            "kana": "ビ",
            "romaji": "bi"
          }
        ]
      },
      {
        "question_text": "zubon",
        "options": {
          "A": "ズボン",
          "B": "ズホン",
          "C": "ズボツ",
          "D": "ズボソ"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ズ",
            "romaji": "Zu"
          },
          {
            "kana": "ボ",
            "romaji": "bo"
          },
          {
            "kana": "ン",
            "romaji": "n"
          }
        ]
      },
      {
        "question_text": "betonamu",
        "options": {
          "A": "ベトメム",
          "B": "ベトナム",
          "C": "ベトナマ",
          "D": "ベイナム"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "ベ",
            "romaji": "Be"
          },
          {
            "kana": "ト",
            "romaji": "to"
          },
          {
            "kana": "ナ",
            "romaji": "na"
          },
          {
            "kana": "ム",
            "romaji": "mu"
          }
        ]
      },
      {
        "question_text": "gorufu",
        "options": {
          "A": "ゴルワ",
          "B": "ゴレフ",
          "C": "ゴルフ",
          "D": "ゴルク"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "ゴ",
            "romaji": "Go"
          },
          {
            "kana": "ル",
            "romaji": "ru"
          },
          {
            "kana": "フ",
            "romaji": "fu"
          }
        ]
      },
      {
        "question_text": "purezento",
        "options": {
          "A": "プルゼンオ",
          "B": "プレゼント",
          "C": "プレセント",
          "D": "フレゼント"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "プ",
            "romaji": "Pu"
          },
          {
            "kana": "レ",
            "romaji": "re"
          },
          {
            "kana": "ゼ",
            "romaji": "ze"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "ト",
            "romaji": "to"
          }
        ]
      },
      {
        "question_text": "ハイキングが すきです。",
        "options": {
          "A": "haikingu ga susadesu.",
          "B": "haikisoku ga sukidesu.",
          "C": "hatokingu ga sukidesu.",
          "D": "haikingu ga sukidesu."
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "ハ",
            "romaji": "Ha"
          },
          {
            "kana": "イ",
            "romaji": "i"
          },
          {
            "kana": "キ",
            "romaji": "ki"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "グ",
            "romaji": "gu"
          },
          {
            "kana": "が",
            "romaji": "ga"
          },
          {
            "kana": "す",
            "romaji": "su"
          },
          {
            "kana": "き",
            "romaji": "ki"
          },
          {
            "kana": "で",
            "romaji": "de"
          },
          {
            "kana": "す",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "あさごはんに パンと ピザを たべます。",
        "options": {
          "A": "asagohan ni pan to biza wo nibemasu.",
          "B": "asagohan ni paso to biza wo tabemasu.",
          "C": "asagohan ni pan to piza wo tabemasu.",
          "D": "asagohan ni patsu to piza wo tabemasu."
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "あ",
            "romaji": "A"
          },
          {
            "kana": "さ",
            "romaji": "sa"
          },
          {
            "kana": "ご",
            "romaji": "go"
          },
          {
            "kana": "は",
            "romaji": "ha"
          },
          {
            "kana": "ん",
            "romaji": "n"
          },
          {
            "kana": "に",
            "romaji": "ni"
          },
          {
            "kana": "パ",
            "romaji": "pa"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "と",
            "romaji": "to"
          },
          {
            "kana": "ピ",
            "romaji": "pi"
          },
          {
            "kana": "ザ",
            "romaji": "za"
          },
          {
            "kana": "を",
            "romaji": "wo"
          },
          {
            "kana": "た",
            "romaji": "ta"
          },
          {
            "kana": "べ",
            "romaji": "be"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          },
          {
            "kana": "す",
            "romaji": "su"
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "title": "KANA_2 2026_MINI TEST 04",
    "questions": [
      {
        "question_text": "ジャム",
        "options": {
          "A": "Jimu",
          "B": "Jamu",
          "C": "Jiyamu",
          "D": "Jyama"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "ジャ",
            "romaji": "Ja"
          },
          {
            "kana": "ム",
            "romaji": "mu"
          }
        ]
      },
      {
        "question_text": "チャンス",
        "options": {
          "A": "Chasosu",
          "B": "Chinsu",
          "C": "Chansu",
          "D": "Chisosu"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "チャ",
            "romaji": "Cha"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "ス",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "ユーチューブ",
        "options": {
          "A": "Yuuchuubu",
          "B": "Youchuubu",
          "C": "Yuchubu",
          "D": "jyuuchuubu"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ユ",
            "romaji": "Yu"
          },
          {
            "kana": "ー",
            "romaji": "u"
          },
          {
            "kana": "チュ",
            "romaji": "chu"
          },
          {
            "kana": "ー",
            "romaji": "u"
          },
          {
            "kana": "ブ",
            "romaji": "bu"
          }
        ]
      },
      {
        "question_text": "スーパー",
        "options": {
          "A": "Suubaa",
          "B": "Seepaa",
          "C": "Supa",
          "D": "Suupaa"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "ス",
            "romaji": "Su"
          },
          {
            "kana": "ー",
            "romaji": "u"
          },
          {
            "kana": "パ",
            "romaji": "pa"
          },
          {
            "kana": "ー",
            "romaji": "a"
          }
        ]
      },
      {
        "question_text": "ニュース",
        "options": {
          "A": "Nyuusu",
          "B": "Niisu",
          "C": "Yuusu",
          "D": "Nyusuu"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "ニュ",
            "romaji": "Nyu"
          },
          {
            "kana": "ー",
            "romaji": "u"
          },
          {
            "kana": "ス",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "チケット",
        "options": {
          "A": "Chiketto",
          "B": "Tekutto",
          "C": "Teketto",
          "D": "Chiketsuto"
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "チ",
            "romaji": "Chi"
          },
          {
            "kana": "ケ",
            "romaji": "ke"
          },
          {
            "kana": "ッ",
            "romaji": "t"
          },
          {
            "kana": "ト",
            "romaji": "to"
          }
        ]
      },
      {
        "question_text": "Biiru",
        "options": {
          "A": "ビル",
          "B": "ヒール",
          "C": "ビール",
          "D": "ピル"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "ビ",
            "romaji": "Bi"
          },
          {
            "kana": "ー",
            "romaji": "i"
          },
          {
            "kana": "ル",
            "romaji": "ru"
          }
        ]
      },
      {
        "question_text": "Paatii",
        "options": {
          "A": "バーティー",
          "B": "パアティ",
          "C": "パーティー",
          "D": "パッティ"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "パ",
            "romaji": "Pa"
          },
          {
            "kana": "ー",
            "romaji": "a"
          },
          {
            "kana": "ティ",
            "romaji": "ti"
          },
          {
            "kana": "ー",
            "romaji": "i"
          }
        ]
      },
      {
        "question_text": "Manshon",
        "options": {
          "A": "ムソション",
          "B": "ムンソン",
          "C": "マソション",
          "D": "マンション"
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "マ",
            "romaji": "Ma"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "ショ",
            "romaji": "sho"
          },
          {
            "kana": "ン",
            "romaji": "n"
          }
        ]
      },
      {
        "question_text": "juusu",
        "options": {
          "A": "ジュウス",
          "B": "ジュース",
          "C": "ジース",
          "D": "シュース"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "ジュ",
            "romaji": "Ju"
          },
          {
            "kana": "ー",
            "romaji": "u"
          },
          {
            "kana": "ス",
            "romaji": "su"
          }
        ]
      },
      {
        "question_text": "jogingu",
        "options": {
          "A": "ジョキンゲ",
          "B": "ヨキング",
          "C": "ジョギング",
          "D": "ショギング"
        },
        "answer": "C",
        "breakdown": [
          {
            "kana": "ジョ",
            "romaji": "Jo"
          },
          {
            "kana": "ギ",
            "romaji": "gi"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "グ",
            "romaji": "gu"
          }
        ]
      },
      {
        "question_text": "suicchi",
        "options": {
          "A": "スイチ",
          "B": "スイッチ",
          "C": "スイイチ",
          "D": "スイッテ"
        },
        "answer": "B",
        "breakdown": [
          {
            "kana": "ス",
            "romaji": "Su"
          },
          {
            "kana": "イ",
            "romaji": "i"
          },
          {
            "kana": "ッ",
            "romaji": "ch"
          },
          {
            "kana": "チ",
            "romaji": "chi"
          }
        ]
      },
      {
        "question_text": "きょう、パーティーにいきますか。",
        "options": {
          "A": "kiyou, paatii ni ikimasuka.",
          "B": "kyou, baatii ni ikimasuka.",
          "C": "kyou, pattii ni ikimasuka.",
          "D": "kyou, paatii ni ikimasuka."
        },
        "answer": "D",
        "breakdown": [
          {
            "kana": "きょ",
            "romaji": "Kyo"
          },
          {
            "kana": "う",
            "romaji": "u"
          },
          {
            "kana": "パ",
            "romaji": "pa"
          },
          {
            "kana": "ー",
            "romaji": "a"
          },
          {
            "kana": "ティ",
            "romaji": "ti"
          },
          {
            "kana": "ー",
            "romaji": "i"
          },
          {
            "kana": "に",
            "romaji": "ni"
          },
          {
            "kana": "い",
            "romaji": "i"
          },
          {
            "kana": "き",
            "romaji": "ki"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          },
          {
            "kana": "す",
            "romaji": "su"
          },
          {
            "kana": "か",
            "romaji": "ka"
          }
        ]
      },
      {
        "question_text": "いま マンションにすんでいます。",
        "options": {
          "A": "ima manshon ni sundeimasu.",
          "B": "imo manson ni sundeimasu.",
          "C": "ima manson ni sundeimasu.",
          "D": "ima manshin ni shindeimasu."
        },
        "answer": "A",
        "breakdown": [
          {
            "kana": "い",
            "romaji": "I"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          },
          {
            "kana": "マ",
            "romaji": "ma"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "ショ",
            "romaji": "sho"
          },
          {
            "kana": "ン",
            "romaji": "n"
          },
          {
            "kana": "に",
            "romaji": "ni"
          },
          {
            "kana": "す",
            "romaji": "su"
          },
          {
            "kana": "ん",
            "romaji": "n"
          },
          {
            "kana": "で",
            "romaji": "de"
          },
          {
            "kana": "い",
            "romaji": "i"
          },
          {
            "kana": "ま",
            "romaji": "ma"
          },
          {
            "kana": "す",
            "romaji": "su"
          }
        ]
      }
    ]
  }
];
