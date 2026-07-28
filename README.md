# Yamate Kana

App học bảng chữ cái tiếng Nhật (Hiragana & Katakana) — HTML + Tailwind CSS (CDN) + Vanilla JavaScript, không framework, không build step.

## Cấu trúc file

```
index.html   Khung giao diện, nạp Tailwind CDN + font, chứa <div id="app">
data.js       46 chữ Hiragana + 46 chữ Katakana (char, romaji, type, group, strokeLevel, lookalike)
              + LESSONS: cấu trúc 14 bài học cố định
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

- **Trang chủ**: chọn Hiragana / Katakana / Cả hai → "Học" hoặc "Thi 20 câu".
- **Chọn bài học**: 14 bài, chia 2 nhóm:
  - **Học theo hàng** (bài 1–10): mỗi bài dạy 1 nhóm phụ âm mới (Nguyên âm, K, S, T, N, H, M, Y, R, W+N).
  - **Luyện nét & hình dạng** (bài 11–14): chỉ ôn lại chữ **đã học** ở 10 bài trên, nhóm theo độ phức tạp nét vẽ
    (đơn giản/trung bình/phức tạp) hoặc nhóm chữ dễ nhầm hình dạng. 4 bài này **khóa** cho tới khi hoàn thành
    ít nhất 5/10 bài đầu (đổi ở `STROKE_LESSONS_UNLOCK_COUNT` trong `data.js` nếu muốn chặt hơn).
  - Mỗi bài chạy đủ Flashcard (lật thẻ, đánh dấu Đã nhớ/Chưa nhớ) → Ghép cặp (6–10 cặp/vòng) → đánh dấu bài
    đó "Đã hoàn thành".
  - Chọn "Cả hai" thì mỗi bài gộp chữ của cả Hiragana lẫn Katakana cùng nhóm/độ khó.
- **Thi 20 câu**: trắc nghiệm 4 đáp án (không phụ thuộc bài học nào, luôn lấy từ toàn bộ phạm vi đã chọn),
  biết đúng/sai ngay → màn Kết quả với danh sách câu sai, có thể "Thi lại" hoặc "Ôn các câu sai" (quay lại
  flashcard chỉ với các chữ đã sai — không tính vào tiến độ bài học).

## Lưu trữ

Toàn bộ tiến độ lưu trong `localStorage` của trình duyệt (không có backend):

- `kana_quiz_progress_v1`: trạng thái đã nhớ/chưa nhớ của từng chữ (flashcard).
- `kana_quiz_highscore_v1`: điểm cao nhất theo từng phạm vi (Hiragana/Katakana/Cả hai).
- `kana_quiz_lesson_progress_v1`: trạng thái từng bài học (1–14), lưu riêng theo phạm vi —
  ví dụ khóa `hiragana_vowel`, `both_stroke_easy`.

Xóa các key này trong DevTools (Application → Local Storage) để reset tiến độ.

## Responsive

Container chính giữ cột hẹp căn giữa (giống mobile) ở hầu hết màn hình kể cả trên desktop, vì đây là các
tương tác tập trung 1 việc (1 thẻ, 1 câu hỏi) nên không cần dùng hết chiều rộng màn hình lớn. Riêng màn
**Chọn bài học** dùng lưới rộng hơn (`sm:`/`lg:` breakpoints, 2 → 3 cột) vì có tới 14 thẻ bài học cần hiển thị.
