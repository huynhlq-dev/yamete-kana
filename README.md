# Yamate Kana

App học bảng chữ cái tiếng Nhật (Hiragana & Katakana) — HTML + Tailwind CSS (CDN) + Vanilla JavaScript, không framework, không build step.

## Giao diện

Bảng màu + font theo "YAMATE Kana Design System v1.0" (teal sáng `#0ABAB5` làm màu chủ đạo, nền
`cream` gần trắng, chữ `ink`, font Inter) — khai báo toàn bộ ở `tailwind.config` trong `index.html`
dưới dạng các key màu cũ (`teal`/`saffron`/`cream`/`ink`/`status`), nên `app.js` chỉ dùng tên class,
không có mã hex nào cứng trong đó — đổi bảng màu chỉ cần sửa giá trị hex ở `index.html`.

## Cấu trúc file

```
index.html   Khung giao diện, nạp Tailwind CDN + font, chứa <div id="app">
data.js       46 chữ Hiragana + 46 chữ Katakana (char, romaji, type, group, strokeLevel, lookalike)
              + HIRAGANA_YOON/KATAKANA_YOON: 33 âm ghép (Yōon) mỗi bảng, tách riêng khỏi 46 chữ gốc
              + LESSONS: cấu trúc 20 bài học cố định
              + TYPING_WORDS_HIRAGANA/TYPING_WORDS_KATAKANA: ngân hàng từ cho "Luyện Gõ"
examData.js   EXAM_TESTS: 4 đề "Test Final" cố định (sinh từ Tests.JSON), mỗi câu có
              question_text/options/answer + breakdown (tách âm kana, chỉ hiện ở màn xem câu sai)
Tests.JSON    Nguồn gốc của examData.js — sửa tay khi cần, rồi chạy lại script sinh examData.js
app.js        Toàn bộ state, logic màn hình, xử lý sự kiện
```

## Cách chạy

Không cần cài đặt hay build gì cả:

1. Mở trực tiếp `index.html` bằng trình duyệt (double-click, hoặc kéo thả vào tab trình duyệt).
2. Hoặc chạy qua local server (khuyến khích, tránh vài trình duyệt chặn font/script khi mở qua `file://`):

   ```bash
   cd KANA-quiz
   python3 -m http.server 8000
   # rồi mở http://localhost:8000
   ```

   hoặc dùng Node nếu có sẵn `npx`:

   ```bash
   npx serve .
   ```

## Luồng sử dụng

- **Trang chủ**: chọn bảng chữ (Hiragana/Katakana/Cả hai) → dòng tiến độ nhanh (số chữ đã đánh dấu
  "Đã nhớ" ở Flashcard, /46 mỗi bảng) → nhóm **Học** (2 nút to: Học chữ cái, Luyện Gõ) → nhóm
  **Kiểm tra** (nút nhỏ hơn: Luyện 20 câu, Test Final, Xem Thành Tích). Sắp xếp theo đúng luồng học
  thật (học trước, tự kiểm tra sau), nhóm Học nổi bật hơn vì đó là việc nên làm đầu tiên.
- **Thành Tích**: màn tổng hợp riêng (từ nút 🏆 ở Home) — % chữ đã nhớ mỗi bảng, số bài học hoàn
  thành /20 mỗi phạm vi, điểm cao "Luyện 20 câu" mỗi phạm vi, và kết quả gần nhất từng đề Test
  Final. Không lưu dữ liệu mới, chỉ đọc lại các key localStorage đã có sẵn.
- **Chọn bài học**: 20 bài, chia 3 nhóm:
  - **Học theo hàng** (bài 1–10): mỗi bài dạy 1 nhóm phụ âm mới (Nguyên âm, K, S, T, N, H, M, Y, R, W+N).
  - **Luyện nét & hình dạng** (bài 11–14): chỉ ôn lại chữ **đã học** ở 10 bài trên, nhóm theo độ phức tạp nét vẽ
    (đơn giản/trung bình/phức tạp) hoặc nhóm chữ dễ nhầm hình dạng. 4 bài này **khóa** cho tới khi hoàn thành
    ít nhất 5/10 bài đầu (đổi ở `STROKE_LESSONS_UNLOCK_COUNT` trong `data.js` nếu muốn chặt hơn).
  - **Âm ghép / Yōon** (bài 15–20): dạy 33 tổ hợp âm ghép mỗi bảng (きゃ, しゃ, ちゃ...), lấy từ
    `HIRAGANA_YOON`/`KATAKANA_YOON` — không phải chữ trong 46 chữ gốc nên không xuất hiện ở "Thi 20 câu".
    6 bài này **khóa** cho tới khi hoàn thành ít nhất 8/10 bài "Học theo hàng" (đổi ở
    `YOON_LESSONS_UNLOCK_COUNT` trong `data.js`).
  - Mỗi bài chạy đủ Flashcard (lật thẻ, đánh dấu Đã nhớ/Chưa nhớ — có nút bỏ qua để nhảy thẳng sang Ghép cặp)
    → Ghép cặp (tối đa 10 cặp/vòng) → đánh dấu bài đó "Đã hoàn thành".
  - Chọn "Cả hai" thì mỗi bài gộp chữ của cả Hiragana lẫn Katakana cùng nhóm/độ khó.
- **Thi 20 câu**: trắc nghiệm 4 đáp án (không phụ thuộc bài học nào, luôn lấy từ toàn bộ phạm vi đã chọn),
  biết đúng/sai ngay → màn Kết quả với danh sách câu sai, có thể "Thi lại" hoặc "Ôn các câu sai" (quay lại
  flashcard chỉ với các chữ đã sai — không tính vào tiến độ bài học).
- **Test Final**: 4 đề cố định độc lập với bảng chữ/bài học ở trên (mỗi đề tự chứa cả câu hỏi kana lẫn
  romaji, cả từ đơn lẫn câu). Chọn chế độ trước khi vào đề:
  - **Làm đủ câu** (mặc định): lấy toàn bộ số câu đề đó có (12 hoặc 14 câu tùy đề), xáo thứ tự, không lặp.
  - **Random 20 câu**: luôn ra đúng 20 lượt hỏi — vì đề gốc chỉ có 12–14 câu nên chế độ này **cho phép lặp
    câu** để đủ số lượng.
  - 20 phút/lượt, đồng hồ đếm ngược; hết giờ vẫn làm tiếp được, đồng hồ chỉ chuyển đỏ + hiện "QUÁ GIỜ".
  - Không chấm đúng/sai ngay như "Thi 20 câu" — có thể tự do đổi câu trả lời, đi tới/lui giữa các câu, tới
    khi bấm "Nộp Bài" mới chấm. Kết quả: điểm/100, ĐẠT (≥80) hay KHÔNG ĐẠT, thời gian làm bài (báo rõ nếu
    quá giờ), và danh sách câu sai kèm bảng tách âm (kana ↔ romaji) để ôn lại.
  - Kết quả **gần nhất** mỗi đề được lưu lại, hiện thành badge ở màn chọn đề.
- **Luyện Gõ**: chọn Hiragana hoặc Katakana → gõ romaji vào 1 ô input, tự convert real-time sang kana
  đúng bảng đã chọn bằng thư viện [wanakana](https://github.com/WaniKani/WanaKana) (nạp qua CDN, không
  cần npm/build step). Khớp đủ cả từ (kể cả dakuten/handakuten/yōon/sokuon/trường âm) thì tự chuyển từ
  tiếp theo; có nút Xoá và Bỏ qua, tap vào chữ Nhật hiện chip gợi ý romaji. Từ vựng lấy từ
  `TYPING_WORDS_HIRAGANA`/`TYPING_WORDS_KATAKANA` trong `data.js` — **77 từ Hiragana + 67 từ Katakana**,
  đã verify phủ đủ 100% cả 46 chữ cơ bản lẫn 33 âm ghép Yōon mỗi bảng trong 1 lượt luyện (không phải
  áng chừng — có script kiểm tra độ phủ). Vài âm ghép gần như không có trong từ vựng thật (ぴゃ/ぴゅ/みゅ
  hiragana; キョ/ヒャ/ミョ/リャ/リョ/ビャ/ビョ/ピャ katakana) nên dùng entry "luyện âm" riêng thay vì gán
  ép vào từ không tồn tại.
  - Cố tình tránh mọi từ có ん đứng ngay trước hàng な/や/わ khi gõ liền (vd こんにちは) vì đó là edge
    case wanakana convert sai lúc gõ real-time (đã xác nhận thêm dấu `'` trước âm gây nhầm — vd
    `kon'nichiha`, `hon'ya` — sửa được, nhưng không cần dùng vì đã đủ coverage bằng từ khác).
  - Trường âm katakana (ー) phải gõ dấu `-` (vd `ke-ki` → ケーキ), UI có gợi ý khi chọn Katakana.
  - Chip gợi ý dùng `wanakana.toRomaji()`, tự sửa nguyên âm đúp thành dấu `-` cho khớp cách gõ thật
    (vd hiện "ju-su" chứ không phải "juusu" cho ジュース); 2 từ dùng tổ hợp mở rộng (ソファ, フォーク)
    set sẵn field `hint` để override vì toRomaji tách sai thành ký tự gốc.

## Lưu trữ

Toàn bộ tiến độ lưu trong `localStorage` của trình duyệt (không có backend):

- `kana_quiz_progress_v1`: trạng thái đã nhớ/chưa nhớ của từng chữ (flashcard).
- `kana_quiz_highscore_v1`: điểm cao nhất theo từng phạm vi (Hiragana/Katakana/Cả hai).
- `kana_quiz_lesson_progress_v1`: trạng thái từng bài học (1–20), lưu riêng theo phạm vi —
  ví dụ khóa `hiragana_vowel`, `both_stroke_easy`, `hiragana_yoon_k`.
- `kana_quiz_exam_result_v1`: kết quả **gần nhất** của mỗi đề Test Final (điểm, đạt/không đạt, ngày làm).

Xóa các key này trong DevTools (Application → Local Storage) để reset tiến độ.

## Responsive

Container chính giữ cột hẹp căn giữa (giống mobile) ở hầu hết màn hình kể cả trên desktop, vì đây là các
tương tác tập trung 1 việc (1 thẻ, 1 câu hỏi) nên không cần dùng hết chiều rộng màn hình lớn. Riêng màn
**Chọn bài học** dùng lưới rộng hơn (`sm:`/`lg:` breakpoints, 2 → 3 cột) vì có tới 20 thẻ bài học cần hiển thị.
