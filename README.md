# Học Hiragana & Katakana

App học bảng chữ cái tiếng Nhật — HTML + Tailwind CSS (CDN) + Vanilla JavaScript, không framework, không build step.

## Cấu trúc file

```
index.html   Khung giao diện, nạp Tailwind CDN + font, chứa <div id="app">
data.js       Dữ liệu 46 chữ Hiragana + 46 chữ Katakana (char, romaji, type, group)
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
- **Học**: Flashcard (lật thẻ, đánh dấu Đã nhớ/Chưa nhớ, lọc theo nhóm phụ âm, có thể bật "chỉ ôn chữ chưa thuộc") → tự động chuyển sang Ghép cặp (6–10 cặp/vòng) → màn Hoàn thành.
- **Thi 20 câu**: trắc nghiệm 4 đáp án, biết đúng/sai ngay → màn Kết quả với danh sách câu sai, có thể "Thi lại" hoặc "Ôn các câu sai" (quay lại flashcard chỉ với các chữ đã sai).

## Lưu trữ

Toàn bộ tiến độ lưu trong `localStorage` của trình duyệt (không có backend):

- `kana_quiz_progress_v1`: trạng thái đã nhớ/chưa nhớ của từng chữ.
- `kana_quiz_highscore_v1`: điểm cao nhất theo từng phạm vi (Hiragana/Katakana/Cả hai).

Xóa 2 key này trong DevTools (Application → Local Storage) để reset tiến độ.
