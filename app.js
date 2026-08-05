/**
 * app.js — Toàn bộ logic của app "Học Hiragana & Katakana".
 * Kiến trúc: SPA đơn giản không dùng framework.
 *  - `state` giữ toàn bộ trạng thái hiện tại.
 *  - Mỗi màn hình có 1 hàm render*() trả về chuỗi HTML, gán vào #app.
 *  - Tương tác dùng "event delegation": 1 listener click/change duy nhất trên #app,
 *    đọc thuộc tính data-action để biết phải làm gì.
 */

// ============================================================
// LOCAL STORAGE — lưu tiến độ học & điểm cao nhất
// ============================================================
const STORAGE_KEYS = {
  PROGRESS: "kana_quiz_progress_v1",
  HIGHSCORE: "kana_quiz_highscore_v1",
};

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
}

function loadHighscores() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HIGHSCORE)) || {};
  } catch (e) {
    return {};
  }
}

function saveHighscores(hs) {
  localStorage.setItem(STORAGE_KEYS.HIGHSCORE, JSON.stringify(hs));
}

// ============================================================
// DARK MODE — attribute data-theme trên <html> đã được set SỚM (script đầu <head> trong index.html,
// chạy trước khi trang vẽ, tránh nháy sáng) dựa theo lựa chọn đã lưu hoặc prefers-color-scheme. Ở
// đây chỉ đọc lại giá trị đó và cung cấp hàm đổi/lưu khi người dùng bấm nút trong header.
const THEME_KEY = "kana_quiz_theme_v1";

function getCurrentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Chỉnh DOM trực tiếp (KHÔNG qua render()) — nút nằm trong header, hiện trên MỌI màn hình kể cả
// Flashcard đang gõ dở ô nhập âm; render() lại toàn màn sẽ xoá mất chữ đang gõ.
function toggleTheme() {
  const next = getCurrentTheme() === "dark" ? "light" : "dark";
  setTheme(next);
  document.querySelectorAll('[data-action="toggle-theme"]').forEach((btn) => {
    btn.textContent = next === "dark" ? "🌙" : "☀️";
    btn.setAttribute("aria-label", next === "dark" ? "Đang tối, bấm để chuyển sáng" : "Đang sáng, bấm để chuyển tối");
  });
}

const EXAM_RESULT_KEY = "kana_quiz_exam_result_v1";

// { [testId]: { score, pass, correctCount, total, mode, date } } — chỉ giữ kết quả GẦN NHẤT mỗi đề
function loadExamResults() {
  try {
    return JSON.parse(localStorage.getItem(EXAM_RESULT_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveExamResult(testId, result) {
  const all = loadExamResults();
  all[testId] = result;
  localStorage.setItem(EXAM_RESULT_KEY, JSON.stringify(all));
}

// Khóa định danh duy nhất cho 1 chữ (dùng để lưu progress & so khớp ghép cặp)
function cardKey(card) {
  return `${card.type}:${card.char}`;
}

// ============================================================
// DIALOG SYSTEM — những câu bựa vui vẻ giữa các chuyển cảnh
// ============================================================
const DIALOG_MESSAGES = {
  correct: [
    "✅ Đúng rồi, giỏi quá… muốn thưởng gì?",
    "😘 Ngon đấy, được cái headpat",
    "🥰 Chuẩn không cần chỉnh, giỏi vậy",
    "👌 Đúng đấy, hiếm khi thấy mày tỉnh táo vậy",
    "😎 Ghi điểm rồi đó, đừng ảo tưởng",
  ],
  wrong: [
    "❌ Sai rồi đồ đần",
    "🤦 Yamete… não để ở nhà à?",
    "😑 Sai bét, về học lại đi",
    "🙄 Trớt quớt luôn, cố lên đầu đất",
    "😩 Sai rồi, chán mày ghê",
  ],
  lessonComplete: [
    "🎉 Xong bài rồi à? Ngoan đấy",
    "😤 Cleared. Được phép thở",
    "🥳 Hoàn thành rồi đó, tự vỗ tay đi",
    "😮‍💨 Xong! Mệt chưa, còn lâu mới được nghỉ",
    "👏 Ngoan, làm tiếp bài khác đi",
  ],
  allRowsComplete: [
    "🔥 Học xong 46 chữ rồi. Giờ muốn yamete cũng muộn",
    "🏁 46 chữ xong sạch, giờ mới là bắt đầu thảm họa",
    "🎊 Full combo 46 chữ, tự hào lên chút đi",
    "😈 Xong hết rồi, hết đường trốn luôn",
    "🚀 46/46, lên cấp thành não cá vàng hạng sang",
  ],
  quizStart: [
    "⚔️ Vào chịu tội 20 câu",
    "🔫 20 câu đang chờ, chuẩn bị tinh thần đi",
    "😏 Show hàng đi, 20 câu đấy",
    "🎯 Bắt đầu thi, đừng có mà run",
    "🃏 20 câu định mệnh, rén không?",
  ],
  quizHighScore: [
    "👑 Thánh rồi, yamete kudasai",
    "🌟 Điểm cao dữ, học khi nào vậy",
    "🏆 Nể đấy, hiếm khi thấy mày giỏi vậy",
    "💎 Xịn sò, cho xin tí ngưỡng mộ",
    "🔥 Đỉnh của chóp, giỏi thế này ai chịu nổi",
  ],
  quizLowScore: [
    "💀 Thảm họa. Về liếm bài từ đầu",
    "😭 Điểm này nhìn thôi cũng thấy đau",
    "🫠 Thua đau, về ôn lại đi đồ lười",
    "🤡 Thảm quá, chắc lúc thi não đi chơi",
    "😵 Tan nát rồi, học lại từ đầu đi",
  ],
};

let lastDialogMessage = null;
let currentToast = null;
let currentToastTimer = null;

function showToast(category) {
  const messages = DIALOG_MESSAGES[category];
  if (!messages || messages.length === 0) return;

  let chosen = messages[Math.floor(Math.random() * messages.length)];
  if (messages.length > 1) {
    while (chosen === lastDialogMessage) {
      chosen = messages[Math.floor(Math.random() * messages.length)];
    }
  }
  lastDialogMessage = chosen;

  // Toast trước đó (nếu còn) bị thay ngay, tránh chồng đè khi bấm nhanh liên tục
  if (currentToast) {
    clearTimeout(currentToastTimer);
    currentToast.remove();
    currentToast = null;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = chosen;
  document.body.appendChild(toast);
  currentToast = toast;

  currentToastTimer = setTimeout(() => {
    toast.classList.add("exiting");
    setTimeout(() => {
      toast.remove();
      if (currentToast === toast) currentToast = null;
    }, 200);
  }, 1800 + Math.random() * 400);
}

// ============================================================
// LESSON PROGRESS — trạng thái từng bài học (1–14), theo phạm vi đang chọn
// ============================================================
const LESSON_PROGRESS_KEY = "kana_quiz_lesson_progress_v1";

function loadLessonProgress() {
  try {
    return JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveLessonProgress(progress) {
  localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(progress));
}

// vd: "hiragana_vowel", "both_stroke_easy" — mỗi phạm vi (hiragana/katakana/both) có tiến độ riêng
function lessonProgressKey(scope, lessonKey) {
  return `${scope}_${lessonKey}`;
}

// "not_started" | "in_progress" | "completed"
function getLessonStatus(scope, lessonKey) {
  return loadLessonProgress()[lessonProgressKey(scope, lessonKey)] || "not_started";
}

// Không cho trạng thái lùi lại: học lại 1 bài đã "completed" không hạ về "in_progress"
function setLessonStatus(scope, lessonKey, status) {
  const progress = loadLessonProgress();
  const key = lessonProgressKey(scope, lessonKey);
  if (progress[key] === "completed" && status === "in_progress") return;
  progress[key] = status;
  saveLessonProgress(progress);
}

// Số bài trong 10 bài đầu (1–10) đã hoàn thành — điều kiện mở khóa bài 11–14
function countCompletedRowLessons(scope) {
  return LESSONS.filter((l) => l.kind === "row" && getLessonStatus(scope, l.key) === "completed").length;
}

// Tổng số bài (trong cả 20 bài) đã hoàn thành — dùng cho màn Thành Tích, không phân biệt kind
function countCompletedLessons(scope) {
  return LESSONS.filter((l) => getLessonStatus(scope, l.key) === "completed").length;
}

// Số chữ đã đánh dấu "Đã nhớ" ở Flashcard, trên tổng 46 chữ gốc — dùng cho dòng tiến độ ở Home
function countKnownChars(type) {
  const progress = loadProgress();
  const pool = type === "hiragana" ? HIRAGANA : KATAKANA;
  return pool.filter((c) => progress[cardKey(c)] === "known").length;
}

function isStrokeLessonsUnlocked(scope) {
  return countCompletedRowLessons(scope) >= STROKE_LESSONS_UNLOCK_COUNT;
}

function isYoonLessonsUnlocked(scope) {
  return countCompletedRowLessons(scope) >= YOON_LESSONS_UNLOCK_COUNT;
}

// Các nhóm phụ âm đã "học xong" (bài 1-10 hoàn thành) — nguồn chữ để ôn ở bài 11–14
function getLearnedGroups(scope) {
  return new Set(
    LESSONS.filter((l) => l.kind === "row" && getLessonStatus(scope, l.key) === "completed").map((l) => l.key)
  );
}

// Danh sách chữ của 1 bài học theo phạm vi hiện tại (hiragana/katakana/cả hai)
function getLessonCardPool(lesson, scope) {
  const types = scope === "both" ? ["hiragana", "katakana"] : [scope];

  if (lesson.kind === "yoon") {
    const yoonPool = types.flatMap((t) => (t === "hiragana" ? HIRAGANA_YOON : KATAKANA_YOON));
    return yoonPool.filter((c) => c.group === lesson.key);
  }

  const basePool = types.flatMap((t) => (t === "hiragana" ? HIRAGANA : KATAKANA));

  if (lesson.kind === "row") {
    return basePool.filter((c) => c.group === lesson.key);
  }

  // kind === "stroke": chỉ ôn chữ đã học (thuộc nhóm đã hoàn thành), lọc theo strokeLevel/lookalike
  const learnedGroups = getLearnedGroups(scope);
  return basePool.filter((c) => c[lesson.filterField] === lesson.filterValue && learnedGroups.has(c.group));
}

// ============================================================
// STATE — trạng thái toàn cục của app
// ============================================================
const state = {
  scope: "hiragana", // 'hiragana' | 'katakana' | 'both'
  screen: "home",

  study: {
    lesson: null, // bài học đang học (1 phần tử của LESSONS), null nếu đang ôn danh sách tùy chỉnh
    customList: null, // khác null khi đang ôn 1 danh sách cố định (vd: ôn câu sai từ bài thi)
    sessionCards: [], // toàn bộ danh sách của phiên học hiện tại
    queue: [], // các thẻ flashcard còn lại phải học
    current: null, // thẻ đang hiển thị
    flipped: false, // thẻ đã lật chưa
    inputFeedback: null, // null | "correct" | "wrong" | "empty" — kết quả so khớp ô nhập âm lúc lật thẻ
    typedAnswer: "", // giữ lại chữ đã gõ lúc lật, để hiện lại (disabled) cùng màu viền sau khi lật

    matching: {
      queueRemaining: [], // các thẻ còn chờ ở vòng ghép cặp sau
      roundCards: [], // các thẻ trong vòng ghép hiện tại
      leftOrder: [], // thứ tự (key) cột trái đã xáo trộn
      rightOrder: [], // thứ tự (key) cột phải đã xáo trộn (xáo trộn riêng)
      matchedKeys: new Set(), // các key đã ghép đúng trong vòng này
      selectedLeft: null,
      selectedRight: null,
      lastCorrect: null, // key vừa ghép đúng (đang chờ hiệu ứng trước khi ẩn)
      lastWrong: null, // { left, right } vừa ghép sai (đang hiện hiệu ứng đỏ)
      locked: false, // khóa thao tác trong lúc chạy hiệu ứng
    },
  },

  quiz: {
    questions: [],
    currentIndex: 0,
    score: 0,
    wrong: [], // danh sách câu trả lời sai: { card, direction, userAnswer }
    selected: null, // index đáp án user vừa chọn cho câu hiện tại
  },

  examMode: "full", // "full" | "random20" — chọn ở màn danh sách đề, áp dụng cho lần bắt đầu thi kế tiếp

  exam: {
    testId: null,
    mode: "full",
    title: "",
    questions: [], // mảng câu hỏi đã chốt cho lượt thi này (đã xáo trộn, có thể lặp nếu mode random20)
    currentIndex: 0,
    answers: {}, // { [questionIndex]: "A"|"B"|"C"|"D" } — không khóa, cho sửa lại thoải mái tới khi nộp
    startedAt: null, // Date.now() lúc bắt đầu
    timerInterval: null, // id của setInterval đếm ngược, phải clear khi rời màn thi
    submitted: false,
    result: null, // chốt lúc nộp bài: { correctCount, total, score, pass, elapsedSec, overtime, wrong }
  },

  typing: {
    scope: "hiragana", // "hiragana" | "katakana" — chọn ở màn typing-scope trước khi luyện
    words: [], // danh sách từ (đã xáo trộn) của lượt luyện hiện tại
    currentIndex: 0,
    correctCount: 0,
    skippedCount: 0,
  },
};

// ============================================================
// TIỆN ÍCH CHUNG
// ============================================================

// Xáo trộn mảng kiểu Fisher-Yates, không làm thay đổi mảng gốc
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lấy danh sách chữ theo phạm vi đang chọn ở màn Home
function getPool(scope) {
  if (scope === "hiragana") return HIRAGANA;
  if (scope === "katakana") return KATAKANA;
  return HIRAGANA.concat(KATAKANA);
}

function scopeLabel(scope) {
  if (scope === "hiragana") return "Hiragana";
  if (scope === "katakana") return "Katakana";
  return "Cả 2 (tham lam)";
}

// ============================================================
// RENDER — chọn màn hình hiện tại để hiển thị
// ============================================================
// Độ rộng khung chứa: màn "lessons" cần rộng hơn để lưới bài học dùng tốt không gian
// trên desktop/tablet; các màn còn lại giữ cột hẹp căn giữa (tự nhiên vẫn mobile-first).
function containerClass(screen) {
  const base = "min-h-screen flex flex-col mx-auto";
  return screen === "lessons" ? `${base} max-w-md sm:max-w-2xl lg:max-w-3xl` : `${base} max-w-md`;
}

// Thanh header xuyên suốt mọi màn hình — sticky khi cuộn.
// Không truyền title: hiện tên app (Home). Có title: hiện nút back (icon trần, không nền) + tiêu đề màn hình.
// backAction mặc định về Home; các màn học theo bài (flashcard/ghép cặp) truyền "go-lessons"
// để quay lại đúng màn chọn bài thay vì nhảy hẳn về Home.
function renderThemeToggleButton() {
  const isDark = getCurrentTheme() === "dark";
  return `
    <button data-action="toggle-theme"
      aria-label="${isDark ? "Đang tối, bấm để chuyển sáng" : "Đang sáng, bấm để chuyển tối"}"
      class="w-8 h-8 flex items-center justify-center text-lg shrink-0 active:scale-90 transition">
      ${isDark ? "🌙" : "☀️"}
    </button>
  `;
}

function renderAppHeader(title, backAction = "go-home") {
  if (!title) {
    return `
      <div class="relative sticky top-0 z-40 bg-teal-700 text-white px-4 py-3 flex items-center justify-center shadow-md shrink-0">
        <span class="font-bold text-base tracking-wide">🔥 YAMATE KANA</span>
        <div class="absolute right-3 top-1/2 -translate-y-1/2">${renderThemeToggleButton()}</div>
      </div>
    `;
  }
  return `
    <div class="sticky top-0 z-40 bg-teal-700 text-white px-4 py-3 flex items-center gap-3 shadow-md shrink-0">
      <button data-action="${backAction}" aria-label="Quay lại"
        class="w-7 h-7 -ml-1 flex items-center justify-center text-2xl leading-none shrink-0 active:scale-90 transition">
        ←
      </button>
      <h1 class="text-base font-bold tracking-wide truncate">${title}</h1>
      <div class="ml-auto">${renderThemeToggleButton()}</div>
    </div>
  `;
}

// Chân trang bản quyền — xuất hiện dưới cùng mọi màn hình.
function renderFooter() {
  return `
    <p class="text-center text-[11px] text-ink-faint py-3 shrink-0">© 2026 YAMATE Kana · huynhlq.dev@gmail.com</p>
  `;
}

function render() {
  const app = document.getElementById("app");
  app.className = containerClass(state.screen);
  let screenHtml = "";
  switch (state.screen) {
    case "home":
      screenHtml = renderHome();
      break;
    case "lessons":
      screenHtml = renderLessons();
      break;
    case "study-flashcard":
      screenHtml = renderStudyFlashcard();
      break;
    case "study-matching":
      screenHtml = renderStudyMatching();
      break;
    case "study-complete":
      screenHtml = renderStudyComplete();
      break;
    case "quiz":
      screenHtml = renderQuiz();
      break;
    case "quiz-result":
      screenHtml = renderQuizResult();
      break;
    case "exam-list":
      screenHtml = renderExamList();
      break;
    case "exam-question":
      screenHtml = renderExamQuestion();
      break;
    case "exam-result":
      screenHtml = renderExamResult();
      break;
    case "typing-scope":
      screenHtml = renderTypingScope();
      break;
    case "typing-practice":
      screenHtml = renderTypingPractice();
      break;
    case "typing-complete":
      screenHtml = renderTypingComplete();
      break;
    case "achievements":
      screenHtml = renderAchievements();
      break;
  }
  app.innerHTML = screenHtml + renderFooter();
  if (state.screen === "study-flashcard") activateFlashcardFlip();
  if (state.screen === "typing-practice") activateTypingInput();
  window.scrollTo(0, 0);
}

// ============================================================
// MÀN HOME
// ============================================================
function renderHome() {
  const knownHira = countKnownChars("hiragana");
  const knownKata = countKnownChars("katakana");

  const scopes = [
    { key: "hiragana", label: "Hiragana" },
    { key: "katakana", label: "Katakana" },
    { key: "both", label: "Cả 2 (tham lam)" },
  ];

  return `
    ${renderAppHeader()}
    <div class="flex flex-col flex-1 px-5 pt-8 pb-8">
      <div class="text-center mb-5">
        <div class="text-4xl mb-2">🇯🇵</div>
        <p class="text-ink font-bold italic text-sm">"Học nhiều ngu nhiều, học ít ngu ít, không học không ngu"</p>
      </div>

      <div class="bg-card rounded-2xl shadow-md p-4 mb-3">
        <p class="text-sm font-medium text-ink-soft mb-3">Chọn bảng chữ, lẹ lên!</p>
        <div class="grid grid-cols-3 gap-3">
          ${scopes
      .map(
        (s) => `
            <button data-action="set-scope" data-scope="${s.key}"
              class="py-3 rounded-xl text-sm font-semibold transition active:scale-95 ${state.scope === s.key
            ? "bg-teal-700 text-white shadow"
            : "bg-cream-border text-ink-soft"
          }">
              ${s.label}
            </button>`
      )
      .join("")}
        </div>
      </div>

      <p class="text-center text-xs font-semibold text-ink-faint mb-6">
        あ Hiragana ${knownHira}/46 · ア Katakana ${knownKata}/46
      </p>

      <h2 class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-3">Học</h2>
      <div class="flex flex-col gap-3 mb-6">
        <button data-action="go-study"
          class="w-full py-5 rounded-2xl bg-teal-700 text-white text-xl font-semibold shadow-lg active:scale-95 transition">
          📖 Học Chữ Cái, Đồ Lười Ơi
        </button>
        <button data-action="go-typing-scope"
          class="w-full py-5 rounded-2xl bg-teal-600 text-white text-xl font-semibold shadow-lg active:scale-95 transition">
          ⌨️ Luyện Gõ — Tay Nhanh Hơn Não
        </button>
      </div>

      <h2 class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-3">Kiểm Tra</h2>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <button data-action="go-quiz"
          class="py-4 rounded-2xl bg-saffron-500 text-ink text-sm font-semibold shadow active:scale-95 transition">
          📝 Luyện 20 Câu, Chịu Tội Đi
        </button>
        <button data-action="go-exam-list"
          class="py-4 rounded-2xl bg-slate-800 text-white text-sm font-semibold shadow active:scale-95 transition">
          🎓 Test Final — Đấu Thật Đấy
        </button>
      </div>
      <button data-action="go-achievements"
        class="w-full py-3 rounded-2xl bg-card text-ink-soft text-sm font-semibold shadow active:scale-95 transition">
        🏆 Xem Thành Tích (Dám Không?)
      </button>
    </div>
  `;
}

// ============================================================
// MÀN THÀNH TÍCH — tổng hợp tiến độ (flashcard, bài học, thi, Test Final)
// ============================================================
function renderAchievements() {
  const knownHira = countKnownChars("hiragana");
  const knownKata = countKnownChars("katakana");
  const hs = loadHighscores();
  const examResults = loadExamResults();
  const scopeKeys = ["hiragana", "katakana", "both"];

  const progressBar = (label, done, total) => `
    <div class="mb-3 last:mb-0">
      <div class="flex justify-between text-sm font-medium text-ink mb-1">
        <span>${label}</span><span>${done}/${total}</span>
      </div>
      <div class="h-2 bg-cream-border rounded-full overflow-hidden">
        <div class="h-full bg-teal-700" style="width:${total ? Math.round((done / total) * 100) : 0}%"></div>
      </div>
    </div>`;

  const rowLine = (label, valueHtml) => `
    <div class="flex justify-between items-center text-sm font-medium text-ink py-1.5 border-b border-cream-border last:border-0">
      <span>${label}</span>${valueHtml}
    </div>`;

  const lessonRows = scopeKeys
    .map((s) => rowLine(scopeLabel(s), `<span>${countCompletedLessons(s)}/20</span>`))
    .join("");

  const quizRows = scopeKeys
    .map((s) => {
      const r = hs[s];
      return rowLine(
        scopeLabel(s),
        r
          ? `<span class="text-teal-700">${r.score}/${r.total}</span>`
          : `<span class="text-ink-faint">Chưa thi</span>`
      );
    })
    .join("");

  const examRows = EXAM_TESTS.map((t) => {
    const r = examResults[t.id];
    const valueHtml = r
      ? `<span class="${r.pass ? "text-status-ok" : "text-status-busy"}">${r.score}đ (${r.pass ? "ĐẠT" : "KHÔNG ĐẠT"})</span>`
      : `<span class="text-ink-faint">Chưa thi</span>`;
    return rowLine(`<span class="truncate mr-2 inline-block max-w-[160px] align-bottom">${t.title}</span>`, valueHtml);
  }).join("");

  return `
    ${renderAppHeader("Thành Tích Của Mày")}
    <div class="px-5 pb-8 pt-6 flex-1">
      <div class="bg-card rounded-2xl shadow p-4 mb-4">
        <p class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-3">Chữ Đã Nhớ (Flashcard)</p>
        ${progressBar("あ Hiragana", knownHira, 46)}
        ${progressBar("ア Katakana", knownKata, 46)}
      </div>

      <div class="bg-card rounded-2xl shadow p-4 mb-4">
        <p class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-3">Bài Học Hoàn Thành (/20)</p>
        ${lessonRows}
      </div>

      <div class="bg-card rounded-2xl shadow p-4 mb-4">
        <p class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-3">Điểm Cao "Luyện 20 Câu"</p>
        ${quizRows}
      </div>

      <div class="bg-card rounded-2xl shadow p-4">
        <p class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-3">Test Final</p>
        ${examRows}
      </div>
    </div>
  `;
}

// ============================================================
// MÀN CHỌN BÀI HỌC (1–14)
// ============================================================

function renderLessonStatusBadge(status) {
  if (status === "completed")
    return `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-status-ok/10 text-status-ok whitespace-nowrap">✓ Xong, ngoan</span>`;
  if (status === "in_progress")
    return `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-700 whitespace-nowrap">● Học dở, ráng lên</span>`;
  return `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cream-border text-ink-faint whitespace-nowrap">Chưa sờ tới</span>`;
}

function renderLessonCard(lesson, scope, unlocked) {
  const locked = (lesson.kind === "stroke" || lesson.kind === "yoon") && !unlocked;
  const status = getLessonStatus(scope, lesson.key);
  const count = getLessonCardPool(lesson, scope).length;

  return `
    <button data-action="start-lesson" data-lesson-id="${lesson.id}" ${locked ? "disabled" : ""}
      class="text-left p-4 rounded-2xl shadow bg-card transition active:scale-95 flex flex-col gap-2 ${locked ? "opacity-50" : ""
    }">
      <div class="flex items-start justify-between gap-2">
        <span class="text-xs font-semibold text-ink-faint">Bài ${lesson.id}</span>
        ${locked ? `<span class="text-base leading-none">🔒</span>` : renderLessonStatusBadge(status)}
      </div>
      <div>
        <p class="font-semibold text-ink">${lesson.title}</p>
        ${lesson.subtitle ? `<p class="text-xs text-ink-faint mt-0.5">${lesson.subtitle}</p>` : ""}
      </div>
      <p class="text-xs text-ink-soft">${count} chữ</p>
    </button>
  `;
}

function renderLessons() {
  const scope = state.scope;
  const rowLessons = LESSONS.filter((l) => l.kind === "row");
  const strokeLessons = LESSONS.filter((l) => l.kind === "stroke");
  const yoonLessons = LESSONS.filter((l) => l.kind === "yoon");
  const completedRows = countCompletedRowLessons(scope);
  const strokeUnlocked = isStrokeLessonsUnlocked(scope);
  const yoonUnlocked = isYoonLessonsUnlocked(scope);

  return `
    ${renderAppHeader("Chọn Bài Học (Hay Trốn Tiếp?)")}
    <div class="px-4 pb-8 pt-6 flex-1">
      <p class="text-center text-sm text-ink-soft font-medium mb-7">Phạm vi: ${scopeLabel(scope)} — ráng mà nhớ</p>

      <h2 class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-4">Học Theo Hàng (Dễ Ẹc)</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        ${rowLessons.map((l) => renderLessonCard(l, scope, true)).join("")}
      </div>

      <h2 class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-2">Luyện Nét &amp; Hình (Khó Đấy)</h2>
      ${strokeUnlocked
      ? ""
      : `<p class="text-xs text-ink-faint mb-4">🔒 Học xong ${completedRows}/${STROKE_LESSONS_UNLOCK_COUNT} bài đã, đòi gì mở khóa</p>`
    }
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 ${strokeUnlocked ? "mt-4" : ""}">
        ${strokeLessons.map((l) => renderLessonCard(l, scope, strokeUnlocked)).join("")}
      </div>

      <h2 class="text-xs font-semibold text-ink-faint uppercase tracking-wide mb-2">Âm Ghép (Yōon) — Xoắn Não Đấy</h2>
      ${yoonUnlocked
      ? ""
      : `<p class="text-xs text-ink-faint mb-4">🔒 Học xong ${completedRows}/${YOON_LESSONS_UNLOCK_COUNT} bài đã, đòi gì mở khóa</p>`
    }
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 ${yoonUnlocked ? "mt-4" : ""}">
        ${yoonLessons.map((l) => renderLessonCard(l, scope, yoonUnlocked)).join("")}
      </div>
    </div>
  `;
}

// ============================================================
// HỌC — GIAI ĐOẠN 1: FLASHCARD
// ============================================================

// Bắt đầu học 1 bài (1–20). Bài "stroke"/"yoon" bị khóa thì bỏ qua (phòng khi UI chưa kịp ẩn nút).
function startLesson(lessonId) {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return;
  if (lesson.kind === "stroke" && !isStrokeLessonsUnlocked(state.scope)) return;
  if (lesson.kind === "yoon" && !isYoonLessonsUnlocked(state.scope)) return;

  const cards = getLessonCardPool(lesson, state.scope);
  const shuffled = shuffle(cards);
  state.study.lesson = lesson;
  state.study.customList = null;
  state.study.sessionCards = cards;
  state.study.current = shuffled.shift() || null;
  state.study.queue = shuffled;
  state.study.flipped = false;
  state.study.inputFeedback = null;
  state.study.typedAnswer = "";

  setLessonStatus(state.scope, lesson.key, "in_progress");
  state.screen = "study-flashcard";
  render();
}

// Bắt đầu phiên học với 1 danh sách cố định (dùng khi "Ôn các câu sai" từ bài thi) —
// không gắn với bài học nào nên không ảnh hưởng tiến độ hoàn thành bài.
function beginCustomStudy(cards) {
  state.study.lesson = null;
  state.study.customList = cards;
  state.study.sessionCards = cards;
  const shuffled = shuffle(cards);
  state.study.current = shuffled.shift() || null;
  state.study.queue = shuffled;
  state.study.flipped = false;
  state.study.inputFeedback = null;
  state.study.typedAnswer = "";
  state.screen = "study-flashcard";
  render();
}

// Ghi nhận "Đã nhớ" / "Chưa nhớ" rồi chuyển sang thẻ kế tiếp
function markCard(status) {
  const s = state.study;
  if (!s.current) return;
  const progress = loadProgress();
  progress[cardKey(s.current)] = status;
  saveProgress(progress);
  nextFlashcard();
}

function nextFlashcard() {
  const s = state.study;
  if (s.queue.length === 0) {
    // Học hết danh sách → tự động sang Giai đoạn 2 (ghép cặp)
    s.current = null; // dọn trạng thái flashcard trước khi rời màn hình
    startMatchingStage(s.sessionCards);
    return;
  }
  s.current = s.queue.shift();
  s.flipped = false;
  s.inputFeedback = null;
  s.typedAnswer = "";
  render();
}

// Bỏ qua phần còn lại của flashcard, nhảy thẳng sang ghép cặp với toàn bộ danh sách của phiên học
function skipToMatching() {
  const s = state.study;
  s.current = null;
  s.queue = [];
  startMatchingStage(s.sessionCards);
}

// Lật thẻ: chấm ô nhập âm (nếu có) so với romaji đúng, không phân biệt hoa/thường, bỏ khoảng trắng thừa
function flipCard() {
  const s = state.study;
  if (s.flipped || !s.current) return;

  const input = document.getElementById("flashcard-romaji-input");
  const typed = (input?.value ?? "").trim();
  s.typedAnswer = typed;

  if (typed === "") {
    s.inputFeedback = "empty";
  } else if (typed.toLowerCase() === s.current.romaji.toLowerCase()) {
    s.inputFeedback = "correct";
  } else {
    s.inputFeedback = "wrong";
  }

  s.flipped = true;
  render();
}

// Thoát ký tự đặc biệt trước khi chèn text do người dùng gõ vào thuộc tính HTML (value="...")
function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Bọc span highlight quanh MỌI lần xuất hiện của char trong word (thường chỉ 1 lần, xử lý tổng
// quát cho chắc). text-slate-800 CỐ ĐỊNH (không phải text-ink) vì nền saffron-100 cũng cố định,
// không đổi theo dark mode — dùng text-ink ở đây sẽ ra chữ sáng trên nền sáng ở dark mode.
function highlightChar(word, char) {
  return word.split(char).join(`<span class="bg-saffron-100 text-slate-800 rounded px-0.5">${char}</span>`);
}

// Border/nền ô nhập âm theo kết quả chấm: xanh (đúng), đỏ (sai), vàng (bỏ trống), trung tính (chưa lật)
function inputFeedbackClasses(feedback) {
  const base = "kana-text-input w-full py-3 px-4 rounded-2xl text-center text-lg font-medium border-2 outline-none transition";
  if (feedback === "correct") return `${base} bg-status-ok/10 text-status-ok border-status-ok`;
  if (feedback === "wrong") return `${base} bg-status-busy/10 text-status-busy border-status-busy`;
  if (feedback === "empty") return `${base} bg-saffron-100 text-saffron-700 border-saffron-500`;
  return `${base} bg-card text-ink border-transparent focus:border-teal-700`;
}

function renderStudyFlashcard() {
  const s = state.study;
  const card = s.current;
  const backAction = s.lesson ? "go-lessons" : "go-home";

  if (!card) {
    // Chỉ có thể xảy ra với bài luyện nét (11–14) nếu các nhóm đã hoàn thành chưa
    // đụng tới chữ nào được gắn strokeLevel/lookalike đó — gợi ý học thêm rồi quay lại.
    return `
      ${renderAppHeader("Lật Thẻ — Đừng Lười", backAction)}
      <div class="px-5 text-center mt-16 flex-1">
        <p class="text-5xl mb-4">🤷</p>
        <p class="text-ink-soft font-medium">Học chưa đủ mà đòi ôn, láo vừa thôi.</p>
        <p class="text-ink-faint text-sm mt-1">Về học thêm vài bài "Học Theo Hàng" đi rồi hẵng quay lại.</p>
      </div>
    `;
  }

  const doneCount = s.sessionCards.length - s.queue.length - 1;
  const progressText = `${doneCount + 1}/${s.sessionCards.length}`;
  const lessonLabel = s.customList
    ? `🔁 Đang liếm lại ${s.customList.length} câu sai đây này`
    : s.lesson
      ? `📖 Bài ${s.lesson.id}: ${s.lesson.title} (im mà học)`
      : "";

  return `
    ${renderAppHeader("Lật Thẻ — Đừng Lười", backAction)}
    <div class="px-5 pb-8 pt-6 flex-1">
      ${lessonLabel ? `<p class="text-center text-sm font-medium text-teal-700 mb-4">${lessonLabel}</p>` : ""}

      <p class="text-center text-sm text-ink-faint font-medium mb-6">${progressText}</p>

      <div class="flip-scene w-full aspect-square mb-4 active:scale-[0.98] transition">
        <div id="flip-card-inner" data-action="flip-card" class="flip-card cursor-pointer">
          <div class="flip-face rounded-3xl bg-card shadow-xl flex items-center justify-center">
            <span class="text-8xl font-medium text-slate-800 bg-saffron-100 rounded-2xl px-5 py-1">${card.char}</span>
          </div>
          <div class="flip-face flip-face--back rounded-3xl bg-card shadow-xl flex flex-col items-center justify-center gap-2 px-5 py-4">
            <span class="text-6xl font-medium text-ink">${card.char}</span>
            <span class="text-xl font-medium text-teal-600">${card.romaji}</span>
            ${card.word
      ? `<div class="w-full mt-1 pt-3 border-t border-cream-border flex flex-col items-center gap-1 overflow-hidden">
                     <p class="text-xl font-semibold text-ink tracking-wide">${highlightChar(card.word, card.char)}</p>
                     <p class="text-xs text-ink-faint text-center">${card.wordRomaji} · ${card.meaning}</p>
                   </div>`
      : ""
    }
          </div>
        </div>
      </div>

      <div class="relative mb-3">
        <input id="flashcard-romaji-input" type="text" placeholder="Nhập âm vào đây…" ${s.flipped ? "disabled" : ""}
          ${s.flipped ? `value="${escapeHtml(s.typedAnswer)}"` : ""}
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          class="${inputFeedbackClasses(s.inputFeedback)}" />
        ${s.inputFeedback === "correct" ? `<span class="absolute right-4 top-1/2 -translate-y-1/2 text-status-ok text-xl">✓</span>` : ""}
      </div>

      ${!s.flipped
      ? `<p class="text-center text-sm text-ink-faint font-medium mb-3">👆 Chạm vào thẻ để lật</p>`
      : `<div class="grid grid-cols-2 gap-3">
               <button data-action="mark-unknown" class="py-4 rounded-2xl bg-status-busy text-white text-lg font-semibold shadow active:scale-95 transition">
                 ❌ Chưa nhớ + đầu đất
               </button>
               <button data-action="mark-known" class="py-4 rounded-2xl bg-status-ok text-white text-lg font-semibold shadow active:scale-95 transition">
                 ✅ Nhớ rồi (hy vọng không não cá)
               </button>
             </div>`
    }

      <button data-action="skip-to-matching" class="w-full py-3 mt-4 text-ink-faint text-sm font-medium underline underline-offset-2 active:opacity-60 transition">
        ⏭️ Lười vậy? Bỏ qua, vào ghép cặp luôn
      </button>
    </div>
  `;
}

// renderStudyFlashcard() luôn vẽ thẻ ở trạng thái "chưa lật" (để có điểm bắt đầu cho animation).
// Nếu chữ hiện tại đã được lật, ta thêm class .is-flipped ngay sau khi DOM được chèn vào trang —
// double requestAnimationFrame đảm bảo trình duyệt đã "chốt" trạng thái ban đầu trước khi chuyển
// class, nhờ vậy CSS transition (khai báo trong index.html) chạy đúng hiệu ứng lật 3D thay vì nhảy cóc.
function activateFlashcardFlip() {
  if (!state.study.flipped) return;
  const inner = document.getElementById("flip-card-inner");
  if (!inner) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      inner.classList.add("is-flipped");
    });
  });
}

// ============================================================
// HỌC — GIAI ĐOẠN 2: SESSION ÔN (GHÉP CẶP)
// ============================================================

function startMatchingStage(cards) {
  state.study.matching = {
    queueRemaining: shuffle(cards),
    roundCards: [],
    leftOrder: [],
    rightOrder: [],
    matchedKeys: new Set(),
    selectedLeft: null,
    selectedRight: null,
    lastCorrect: null,
    lastWrong: null,
    locked: false,
  };
  loadNextMatchingRound();
  state.screen = "study-matching";
  render();
}

// Lấy 1 vòng ghép cặp mới (6-10 cặp), phần đuôi danh sách gộp vào vòng cuối
function loadNextMatchingRound() {
  const m = state.study.matching;
  const size = m.queueRemaining.length <= 10 ? m.queueRemaining.length : 8;
  m.roundCards = m.queueRemaining.splice(0, size);
  m.leftOrder = shuffle(m.roundCards.map(cardKey));
  m.rightOrder = shuffle(m.roundCards.map(cardKey));
  m.matchedKeys = new Set();
  m.selectedLeft = null;
  m.selectedRight = null;
  m.lastCorrect = null;
  m.lastWrong = null;
  m.locked = false;
}

function selectMatchItem(side, key) {
  const m = state.study.matching;
  if (m.locked) return;
  if (side === "left") {
    m.selectedLeft = m.selectedLeft === key ? null : key;
  } else {
    m.selectedRight = m.selectedRight === key ? null : key;
  }
  render();
  if (m.selectedLeft && m.selectedRight) {
    tryMatch();
  }
}

function tryMatch() {
  const m = state.study.matching;
  if (m.selectedLeft === m.selectedRight) {
    // Ghép đúng: hiện hiệu ứng xanh ngắn rồi ẩn 2 item
    const key = m.selectedLeft;
    m.lastCorrect = key;
    m.locked = true;
    render();
    showToast("correct");
    setTimeout(() => {
      m.matchedKeys.add(key);
      m.selectedLeft = null;
      m.selectedRight = null;
      m.lastCorrect = null;
      m.locked = false;

      if (m.matchedKeys.size === m.roundCards.length) {
        // Hết vòng hiện tại
        if (m.queueRemaining.length > 0) {
          loadNextMatchingRound();
        } else {
          if (state.study.lesson) {
            setLessonStatus(state.scope, state.study.lesson.key, "completed");
            const completedCount = countCompletedRowLessons(state.scope);
            if (completedCount === 10) {
              showToast("allRowsComplete");
            } else {
              showToast("lessonComplete");
            }
          }
          state.screen = "study-complete";
        }
      }
      render();
    }, 350);
  } else {
    // Ghép sai: rung nhẹ + đỏ rồi reset lựa chọn
    m.lastWrong = { left: m.selectedLeft, right: m.selectedRight };
    m.locked = true;
    render();
    showToast("wrong");
    setTimeout(() => {
      m.selectedLeft = null;
      m.selectedRight = null;
      m.lastWrong = null;
      m.locked = false;
      render();
    }, 600);
  }
}

function renderStudyMatching() {
  const m = state.study.matching;
  const cardsByKey = {};
  m.roundCards.forEach((c) => (cardsByKey[cardKey(c)] = c));

  const totalDone =
    state.study.sessionCards.length -
    m.queueRemaining.length -
    m.roundCards.length +
    m.matchedKeys.size;

  function itemClasses(key, side) {
    const base =
      "w-full py-4 px-2 rounded-2xl text-2xl font-semibold shadow transition active:scale-95 border-2";
    if (m.matchedKeys.has(key) || m.lastCorrect === key)
      return "w-full py-4 px-2 rounded-2xl text-2xl font-semibold border-2 transition bg-status-ok/10 text-status-ok border-status-ok opacity-70";
    if (m.lastWrong && m.lastWrong[side] === key)
      return `${base} bg-status-busy text-white border-status-busy animate-shake`;
    if ((side === "left" && m.selectedLeft === key) || (side === "right" && m.selectedRight === key))
      return `${base} bg-teal-700 text-white border-teal-700`;
    return `${base} bg-card text-ink border-transparent`;
  }

  const leftHtml = m.leftOrder
    .map(
      (key) => `
      <button data-action="select-left" data-key="${key}" ${m.matchedKeys.has(key) ? "disabled" : ""} class="${itemClasses(key, "left")}">
        ${cardsByKey[key].char}
      </button>`
    )
    .join("");

  const rightHtml = m.rightOrder
    .map(
      (key) => `
      <button data-action="select-right" data-key="${key}" ${m.matchedKeys.has(key) ? "disabled" : ""} class="${itemClasses(key, "right")}">
        ${cardsByKey[key].romaji}
      </button>`
    )
    .join("");

  return `
    ${renderAppHeader("Ghép Cặp — Lẹ Lên Não Cá", state.study.lesson ? "go-lessons" : "go-home")}
    <div class="px-4 pb-8 pt-6 flex-1">
      <p class="text-center text-sm text-ink-faint font-medium mb-6">
        Ghép được ${totalDone}/${state.study.sessionCards.length} rồi đấy · Chọn 1 chữ + 1 âm, đừng bấm bừa
      </p>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-4">${leftHtml}</div>
        <div class="flex flex-col gap-4">${rightHtml}</div>
      </div>
    </div>
  `;
}

// ============================================================
// HỌC — HOÀN THÀNH SESSION
// ============================================================
function renderStudyComplete() {
  const s = state.study;
  const summary = s.lesson
    ? `Học xong bài "${s.lesson.title}" (${s.sessionCards.length} chữ) rồi à, tưởng bỏ cuộc chứ.`
    : `Liếm lại xong ${s.sessionCards.length} câu sai rồi đó, nhớ chưa?`;

  return `
    ${renderAppHeader()}
    <div class="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold text-ink mb-2">Xong Rồi Đấy À? Ngoan Ghê</h2>
      <p class="text-ink-soft mb-8">${summary} Học tiếp đi, đừng có lười!</p>
      <div class="w-full flex flex-col gap-4 max-w-xs">
        <button data-action="continue-study"
          class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
          📖 Học Tiếp Đi Đồ Lười
        </button>
        <button data-action="go-quiz"
          class="w-full py-4 rounded-2xl bg-saffron-500 text-ink text-lg font-semibold shadow active:scale-95 transition">
          📝 Vào Chịu Tội Tiếp
        </button>
        <button data-action="go-home" class="w-full py-3 text-ink-faint font-medium">
          Trốn Về Nhà
        </button>
      </div>
    </div>
  `;
}

function continueStudy() {
  state.study.lesson = null;
  state.study.customList = null;
  state.screen = "lessons";
  render();
}

// ============================================================
// THI 20 CÂU
// ============================================================

// Sinh 20 câu hỏi trắc nghiệm từ phạm vi đã chọn
function buildQuiz(scope) {
  const pool = getPool(scope);
  const subjects = shuffle(pool).slice(0, 20);

  return subjects.map((card) => {
    const direction = Math.random() < 0.5 ? "jp2romaji" : "romaji2jp";

    // Chọn 3 đáp án nhiễu: ưu tiên cùng nhóm, luôn đảm bảo romaji và chữ
    // không trùng với đáp án đúng lẫn trùng lẫn nhau (vd ở chế độ "Cả hai",
    // hiragana よ và katakana ヨ cùng đọc "yo" — không được xuất hiện cùng lúc).
    const usedRomaji = new Set([card.romaji]);
    const usedChars = new Set([card.char]);
    const distractors = [];

    function tryAdd(candidates) {
      for (const c of candidates) {
        if (distractors.length >= 3) break;
        if (usedChars.has(c.char) || usedRomaji.has(c.romaji)) continue;
        distractors.push(c);
        usedChars.add(c.char);
        usedRomaji.add(c.romaji);
      }
    }

    tryAdd(shuffle(pool.filter((c) => c.group === card.group)));
    tryAdd(shuffle(pool));

    const options = shuffle([card, ...distractors]);
    return { card, direction, options };
  });
}

function beginQuiz() {
  state.quiz.questions = buildQuiz(state.scope);
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.wrong = [];
  state.quiz.selected = null;
  state.screen = "quiz";
  render();
  setTimeout(() => showToast("quizStart"), 300);
}

function answerQuiz(optionIdx) {
  const q = state.quiz.questions[state.quiz.currentIndex];
  if (state.quiz.selected !== null) return; // đã trả lời câu này rồi
  state.quiz.selected = optionIdx;
  const chosen = q.options[optionIdx];
  if (chosen === q.card) {
    state.quiz.score++;
    showToast("correct");
  } else {
    state.quiz.wrong.push({ card: q.card, direction: q.direction, userAnswer: chosen });
    showToast("wrong");
  }
  render();
}

function nextQuestion() {
  if (state.quiz.currentIndex + 1 >= state.quiz.questions.length) {
    finishQuiz();
    return;
  }
  state.quiz.currentIndex++;
  state.quiz.selected = null;
  render();
}

function finishQuiz() {
  const total = state.quiz.questions.length;
  const hs = loadHighscores();
  if (!hs[state.scope] || state.quiz.score > hs[state.scope].score) {
    hs[state.scope] = { score: state.quiz.score, total, date: new Date().toISOString() };
    saveHighscores(hs);
  }
  state.screen = "quiz-result";
  render();
  setTimeout(() => {
    if (state.quiz.score >= 18) {
      showToast("quizHighScore");
    } else if (state.quiz.score < 10) {
      showToast("quizLowScore");
    }
  }, 300);
}

function renderQuiz() {
  const q = state.quiz.questions[state.quiz.currentIndex];
  const isJp2Romaji = q.direction === "jp2romaji";
  const selected = state.quiz.selected;

  const promptHtml = isJp2Romaji
    ? `<span class="text-7xl font-semibold text-ink">${q.card.char}</span>`
    : `<span class="text-5xl font-semibold text-teal-700 tracking-wide">${q.card.romaji}</span>`;

  const optionsHtml = q.options
    .map((opt, idx) => {
      const isCorrect = opt === q.card;
      const isChosen = selected === idx;
      let cls = "bg-card text-ink border-transparent";
      if (selected !== null) {
        if (isCorrect) cls = "bg-status-ok text-white border-status-ok";
        else if (isChosen) cls = "bg-status-busy text-white border-status-busy animate-shake";
        else cls = "bg-card text-ink-faint border-transparent";
      }
      const label = isJp2Romaji ? opt.romaji : opt.char;
      return `
        <button data-action="answer-quiz" data-idx="${idx}" ${selected !== null ? "disabled" : ""}
          class="w-full py-5 rounded-2xl text-2xl font-semibold shadow border-2 transition active:scale-95 ${cls}">
          ${label}
        </button>`;
    })
    .join("");

  const isLast = state.quiz.currentIndex + 1 >= state.quiz.questions.length;

  return `
    ${renderAppHeader("Chịu Tội 20 Câu")}
    <div class="px-5 pb-8 pt-6 flex-1">
      <div class="flex justify-between items-center text-sm font-medium text-ink-faint mb-6">
        <span>Câu ${state.quiz.currentIndex + 1}/${state.quiz.questions.length}</span>
        <span>Điểm: ${state.quiz.score}</span>
      </div>

      <div class="w-full h-2 bg-cream-border rounded-full mb-6 overflow-hidden">
        <div class="h-full bg-teal-700 transition-all" style="width: ${((state.quiz.currentIndex + (selected !== null ? 1 : 0)) / state.quiz.questions.length) * 100
    }%"></div>
      </div>

      <div class="w-full py-10 rounded-3xl bg-card shadow-xl flex items-center justify-center mb-6">
        ${promptHtml}
      </div>

      <div class="grid grid-cols-2 gap-4 mb-5">
        ${optionsHtml}
      </div>

      ${selected !== null
      ? `<button data-action="next-question"
              class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
              ${isLast ? "Xem Ngu Cỡ Nào →" : "Câu Tiếp, Lẹ →"}
            </button>`
      : ""
    }
    </div>
  `;
}

// ============================================================
// KẾT QUẢ THI
// ============================================================
function renderQuizResult() {
  const total = state.quiz.questions.length;
  const score = state.quiz.score;
  const percent = Math.round((score / total) * 100);
  const wrong = state.quiz.wrong;

  const wrongHtml = wrong.length
    ? wrong
      .map((w) => {
        const isJp2Romaji = w.direction === "jp2romaji";
        const questionLabel = isJp2Romaji ? w.card.char : w.card.romaji;
        const correctLabel = isJp2Romaji ? w.card.romaji : w.card.char;
        const yourLabel = isJp2Romaji ? w.userAnswer.romaji : w.userAnswer.char;
        return `
          <div class="bg-card rounded-xl shadow p-3 flex items-center justify-between gap-3">
            <span class="text-3xl font-semibold text-ink w-14 text-center shrink-0">${questionLabel}</span>
            <div class="flex-1 text-sm text-right">
              <p class="text-status-busy font-medium">Chọn ngu: ${yourLabel}</p>
              <p class="text-status-ok font-medium">Đúng phải là: ${correctLabel}</p>
            </div>
          </div>`;
      })
      .join("")
    : `<p class="text-center text-ink-faint text-sm py-4">🎉 Không sai phát nào luôn, giỏi đấy</p>`;

  return `
    ${renderAppHeader("Kết Quả — Ngu Cỡ Nào Đây")}
    <div class="px-5 pb-8 pt-6 flex-1">
      <div class="bg-card rounded-3xl shadow-xl p-6 text-center mb-8">
        <p class="text-5xl font-bold text-teal-700">${score}/${total}</p>
        <p class="text-ink-soft font-medium mt-1">${percent}% đúng, tự lượng sức nha</p>
      </div>

      <div class="flex flex-col gap-3 mb-8">
        ${wrongHtml}
      </div>

      <div class="flex flex-col gap-4">
        <button data-action="retry-quiz"
          class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
          🔄 Chịu Tội Lại Lần Nữa
        </button>
        ${wrong.length
      ? `<button data-action="review-wrong"
                class="w-full py-4 rounded-2xl bg-saffron-500 text-ink text-lg font-semibold shadow active:scale-95 transition">
                📖 Về Liếm Bài Sai Đi
              </button>`
      : ""
    }
        <button data-action="go-home" class="w-full py-3 text-ink-faint font-medium">
          Trốn Về Nhà
        </button>
      </div>
    </div>
  `;
}

function reviewWrongCards() {
  const cards = state.quiz.wrong.map((w) => w.card);
  beginCustomStudy(cards);
}

// ============================================================
// TEST FINAL — làm đề thi cố định (EXAM_TESTS từ examData.js), có giờ, chấm điểm thang 100
// ============================================================
const EXAM_TIME_LIMIT_SEC = 20 * 60;

function formatTime(totalSeconds) {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function renderExamList() {
  const results = loadExamResults();

  return `
    ${renderAppHeader("Chọn Đề Test Final (Hay Sợ?)")}
    <div class="px-4 pb-8 pt-6 flex-1">
      <div class="bg-card rounded-2xl shadow-md p-3 mb-6 grid grid-cols-2 gap-2">
        <button data-action="set-exam-mode" data-mode="full"
          class="py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 ${state.examMode === "full" ? "bg-teal-700 text-white shadow" : "bg-cream-border text-ink-soft"
    }">
          Làm Đủ Câu
        </button>
        <button data-action="set-exam-mode" data-mode="random20"
          class="py-2.5 rounded-xl text-sm font-semibold transition active:scale-95 ${state.examMode === "random20" ? "bg-teal-700 text-white shadow" : "bg-cream-border text-ink-soft"
    }">
          Random 20 Câu
        </button>
      </div>

      <div class="flex flex-col gap-4">
        ${EXAM_TESTS.map((t) => {
      const r = results[t.id];
      const countLabel = state.examMode === "random20" ? "20 câu (random, có thể lặp)" : `${t.questions.length} câu`;
      const badge = r
        ? `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full self-start ${r.pass ? "bg-status-ok/10 text-status-ok" : "bg-status-busy/10 text-status-busy"
        }">${r.pass ? "✓ Lần trước: ĐẠT" : "✗ Lần trước: KHÔNG ĐẠT"} (${r.score}đ)</span>`
        : `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cream-border text-ink-faint self-start">Chưa thi lần nào, sợ à?</span>`;
      return `
          <button data-action="start-exam" data-test-id="${t.id}"
            class="text-left p-4 rounded-2xl shadow bg-card transition active:scale-95 flex flex-col gap-1.5">
            <p class="font-semibold text-ink">${t.title}</p>
            <p class="text-xs text-ink-soft">${countLabel} · 20 phút</p>
            ${badge}
          </button>`;
    }).join("")}
      </div>
    </div>
  `;
}

function setExamMode(mode) {
  state.examMode = mode;
  render();
}

// Random20: xáo trộn lặp lại tới khi đủ 20 câu (đề gốc chỉ có 12-14 câu nên phải lặp mới đủ)
function buildExamQuestions(test, mode) {
  if (mode === "full") return shuffle(test.questions);
  let pool = [];
  while (pool.length < 20) pool = pool.concat(shuffle(test.questions));
  return pool.slice(0, 20);
}

function startExam(testId) {
  const test = EXAM_TESTS.find((t) => t.id === testId);
  if (!test) return;
  const mode = state.examMode;

  state.exam = {
    testId: test.id,
    mode,
    title: test.title,
    questions: buildExamQuestions(test, mode),
    currentIndex: 0,
    answers: {},
    startedAt: Date.now(),
    timerInterval: null,
    submitted: false,
    result: null,
  };

  state.screen = "exam-question";
  render();
  startExamTimer();
}

function retryExam() {
  startExam(state.exam.testId);
}

function selectExamAnswer(letter) {
  state.exam.answers[state.exam.currentIndex] = letter;
  render();
}

function examNext() {
  const ex = state.exam;
  if (ex.currentIndex < ex.questions.length - 1) {
    ex.currentIndex++;
    render();
  }
}

function examPrev() {
  const ex = state.exam;
  if (ex.currentIndex > 0) {
    ex.currentIndex--;
    render();
  }
}

// Đếm ngược cập nhật trực tiếp DOM mỗi giây, không render() lại cả màn để khỏi giật/ngắt thao tác
function tickExamTimer() {
  const el = document.getElementById("exam-timer");
  if (!el) return; // đã rời màn thi nhưng interval chưa kịp clear
  const elapsedSec = Math.floor((Date.now() - state.exam.startedAt) / 1000);
  const remaining = EXAM_TIME_LIMIT_SEC - elapsedSec;
  if (remaining <= 0) {
    el.textContent = "⏱ QUÁ GIỜ";
    el.className = "font-bold text-white bg-status-busy px-3 py-1 rounded-full";
  } else {
    el.textContent = `⏱ ${formatTime(remaining)}`;
    el.className = "font-bold text-ink-soft bg-card/70 px-3 py-1 rounded-full";
  }
}

function startExamTimer() {
  stopExamTimer();
  state.exam.timerInterval = setInterval(tickExamTimer, 1000);
  tickExamTimer();
}

function stopExamTimer() {
  if (state.exam.timerInterval) {
    clearInterval(state.exam.timerInterval);
    state.exam.timerInterval = null;
  }
}

function exitExam() {
  if (!confirm("Thoát thi luôn? Bài làm dở sẽ mất, không lưu lại đâu.")) return;
  stopExamTimer();
  state.screen = "exam-list";
  render();
}

function submitExam() {
  const ex = state.exam;
  const total = ex.questions.length;
  const answeredCount = Object.keys(ex.answers).length;
  if (answeredCount < total && !confirm(`Mới làm ${answeredCount}/${total} câu thôi, chắc chắn nộp luôn?`)) {
    return;
  }

  stopExamTimer();
  const elapsedSec = Math.floor((Date.now() - ex.startedAt) / 1000);
  const overtime = elapsedSec > EXAM_TIME_LIMIT_SEC;

  let correctCount = 0;
  const wrong = [];
  ex.questions.forEach((q, idx) => {
    const userAnswer = ex.answers[idx] || null;
    if (userAnswer === q.answer) correctCount++;
    else wrong.push({ question: q, userAnswer });
  });

  const score = Math.round((correctCount / total) * 100);
  const pass = score >= 80;

  ex.result = { correctCount, total, score, pass, elapsedSec, overtime, wrong };
  ex.submitted = true;

  saveExamResult(ex.testId, { score, pass, correctCount, total, mode: ex.mode, date: new Date().toISOString() });

  state.screen = "exam-result";
  render();
}

function renderExamQuestion() {
  const ex = state.exam;
  const q = ex.questions[ex.currentIndex];
  const selected = ex.answers[ex.currentIndex] || null;
  const total = ex.questions.length;
  const isFirst = ex.currentIndex === 0;
  const isLast = ex.currentIndex === total - 1;

  const optionsHtml = ["A", "B", "C", "D"]
    .map(
      (letter) => `
      <button data-action="select-exam-answer" data-letter="${letter}"
        class="w-full text-left py-3 px-4 rounded-2xl border-2 transition active:scale-[0.98] ${selected === letter ? "bg-teal-700 text-white border-teal-700" : "bg-card text-ink border-transparent shadow"
        }">
        <span class="font-bold mr-2">${letter}.</span>${q.options[letter]}
      </button>`
    )
    .join("");

  return `
    ${renderAppHeader(ex.title, "exit-exam")}
    <div class="px-5 pb-8 pt-6 flex-1">
      <div class="flex justify-between items-center text-sm font-medium text-ink-faint mb-6">
        <span>Câu ${ex.currentIndex + 1}/${total}</span>
        <span id="exam-timer" class="font-bold text-ink-soft bg-card/70 px-3 py-1 rounded-full">⏱ --:--</span>
      </div>

      <div class="w-full min-h-[120px] py-8 px-5 rounded-3xl bg-card shadow-xl flex items-center justify-center mb-6">
        <p class="text-2xl font-semibold text-ink text-center">${q.question_text}</p>
      </div>

      <div class="flex flex-col gap-3 mb-6">
        ${optionsHtml}
      </div>

      <div class="flex gap-3 mb-3">
        <button data-action="exam-prev" ${isFirst ? "disabled" : ""}
          class="flex-1 py-3 rounded-2xl bg-cream-border text-ink-soft font-semibold transition active:scale-95 disabled:opacity-40">
          ← Câu Trước
        </button>
        <button data-action="exam-next" ${isLast ? "disabled" : ""}
          class="flex-1 py-3 rounded-2xl bg-cream-border text-ink-soft font-semibold transition active:scale-95 disabled:opacity-40">
          Câu Tiếp →
        </button>
      </div>
      <button data-action="submit-exam"
        class="w-full py-4 rounded-2xl bg-status-busy text-white text-lg font-bold shadow active:scale-95 transition">
        🚩 Nộp Bài
      </button>
    </div>
  `;
}

// Bảng tách âm {kana, romaji} — chỉ hiện ở màn xem lại câu sai, không hiện lúc đang thi
function renderBreakdownTable(breakdown) {
  if (!breakdown || breakdown.length === 0) return "";
  const cols = breakdown.length;
  const kanaRow = breakdown
    .map((p) => `<div class="text-center py-1.5 text-lg font-medium bg-cream-surface border border-cream-border">${p.kana}</div>`)
    .join("");
  const romajiRow = breakdown
    .map((p) => `<div class="text-center py-1.5 text-xs text-teal-700 font-semibold bg-cream-surface border border-cream-border">${p.romaji}</div>`)
    .join("");
  return `
    <div class="mt-1 overflow-x-auto">
      <div class="grid rounded-lg overflow-hidden" style="grid-template-columns: repeat(${cols}, minmax(32px, 1fr));">
        ${kanaRow}${romajiRow}
      </div>
    </div>
  `;
}

function renderExamResult() {
  const ex = state.exam;
  const r = ex.result;
  const timeLabel = `${formatTime(r.elapsedSec)}${r.overtime ? ` (Quá giờ ${formatTime(r.elapsedSec - EXAM_TIME_LIMIT_SEC)})` : ""}`;

  const wrongHtml = r.wrong.length
    ? r.wrong
      .map(
        ({ question: q, userAnswer }) => `
      <div class="bg-card rounded-xl shadow p-4 flex flex-col gap-1.5">
        <p class="text-base font-semibold text-ink">${q.question_text}</p>
        <p class="text-sm text-status-busy font-medium">Bạn chọn: ${userAnswer ? q.options[userAnswer] : "(bỏ trống, lười vậy)"
          }</p>
        <p class="text-sm text-status-ok font-medium">Đáp án đúng: ${q.options[q.answer]}</p>
        ${renderBreakdownTable(q.breakdown)}
      </div>`
      )
      .join("")
    : `<p class="text-center text-ink-faint text-sm py-4">🎉 Không sai câu nào, quá đỉnh</p>`;

  return `
    ${renderAppHeader("Kết Quả Test Final")}
    <div class="px-5 pb-8 pt-6 flex-1">
      <div class="bg-card rounded-3xl shadow-xl p-6 text-center mb-6">
        <p class="text-5xl font-bold ${r.pass ? "text-status-ok" : "text-status-busy"}">${r.score}<span class="text-2xl">/100</span></p>
        <p class="text-lg font-bold mt-2 ${r.pass ? "text-status-ok" : "text-status-busy"}">${r.pass ? "✅ ĐẠT" : "❌ KHÔNG ĐẠT"}</p>
        <p class="text-ink-soft font-medium mt-2">${r.correctCount}/${r.total} câu đúng</p>
        <p class="text-sm mt-1 ${r.overtime ? "text-status-busy font-semibold" : "text-ink-faint"}">⏱ ${timeLabel}</p>
      </div>

      <div class="flex flex-col gap-3 mb-8">
        ${wrongHtml}
      </div>

      <div class="flex flex-col gap-4">
        <button data-action="retry-exam"
          class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
          🔄 Thi Lại Đề Này
        </button>
        <button data-action="go-exam-list"
          class="w-full py-4 rounded-2xl bg-saffron-500 text-ink text-lg font-semibold shadow active:scale-95 transition">
          📋 Chọn Đề Khác
        </button>
        <button data-action="go-home" class="w-full py-3 text-ink-faint font-medium">
          Trốn Về Nhà
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// LUYỆN GÕ TIẾNG NHẬT — gõ romaji, tự convert real-time sang kana bằng wanakana
// ============================================================

function renderTypingScope() {
  return `
    ${renderAppHeader("Chọn Bảng Để Luyện Gõ")}
    <div class="px-5 pb-8 pt-6 flex-1 flex flex-col justify-center gap-4">
      <p class="text-center text-ink-soft font-medium mb-2">Gõ romaji, tay phải tự nhớ ra chữ Nhật</p>
      <button data-action="start-typing" data-scope="hiragana"
        class="w-full py-6 rounded-2xl bg-teal-700 text-white text-xl font-semibold shadow-lg active:scale-95 transition">
        あ Hiragana
      </button>
      <button data-action="start-typing" data-scope="katakana"
        class="w-full py-6 rounded-2xl bg-saffron-500 text-ink text-xl font-semibold shadow-lg active:scale-95 transition">
        ア Katakana
      </button>
    </div>
  `;
}

function startTypingPractice(scope) {
  const pool = scope === "hiragana" ? TYPING_WORDS_HIRAGANA : TYPING_WORDS_KATAKANA;
  state.typing = {
    scope,
    words: shuffle(pool),
    currentIndex: 0,
    correctCount: 0,
    skippedCount: 0,
  };
  state.screen = "typing-practice";
  render();
}

// Chấm bằng plain-mode (không IMEMode) trên giá trị HIỆN TẠI của input — vì wanakana.bind() giữ lại
// đuôi romaji chưa chốt được (vd "ぱn" chưa tự thành "ぱん" ở chế độ IME), plain-mode xử lý nốt đuôi
// đó đúng cách mà không cần biết chuỗi romaji gốc đã gõ. Nhờ vậy input vẫn "gõ tới đâu ra chữ tới đó"
// (nhìn mượt) nhưng lúc chấm điểm luôn đúng dù còn ký tự lửng.
function checkTypingMatch(inputEl) {
  const t = state.typing;
  const target = t.words[t.currentIndex];
  const resolve = t.scope === "hiragana" ? wanakana.toHiragana : wanakana.toKatakana;
  const resolved = resolve(inputEl.value);
  if (resolved !== target.kana) return;

  inputEl.value = resolved;
  inputEl.disabled = true;
  t.correctCount++;
  showToast("correct");
  document.getElementById("typing-hint-chip")?.classList.remove("hidden");
  setTimeout(advanceTypingWord, 700);
}

function advanceTypingWord() {
  const t = state.typing;
  if (t.currentIndex + 1 >= t.words.length) {
    state.screen = "typing-complete";
  } else {
    t.currentIndex++;
  }
  render();
}

// Chỉ toggle hiển thị chip bằng DOM trực tiếp, KHÔNG qua state/render() — vì render() sẽ tạo lại
// input từ đầu, xoá mất chữ romaji user đang gõ dở lúc họ tap xem gợi ý.
function toggleTypingHint() {
  const chip = document.getElementById("typing-hint-chip");
  if (chip) chip.classList.toggle("hidden");
}

function skipTypingWord() {
  state.typing.skippedCount++;
  advanceTypingWord();
}

function clearTypingInput() {
  const input = document.getElementById("typing-input");
  if (!input) return;
  input.value = "";
  input.focus();
}

// Gắn wanakana.bind() (convert live) + listener chấm điểm sau mỗi render() của màn typing-practice —
// input là phần tử DOM mới toanh mỗi lần render nên không cần unbind cái cũ, nó tự bị dọn theo innerHTML.
function activateTypingInput() {
  const input = document.getElementById("typing-input");
  if (!input) return;
  const imeMode = state.typing.scope === "hiragana" ? "toHiragana" : "toKatakana";
  wanakana.bind(input, { IMEMode: imeMode });
  input.addEventListener("input", () => checkTypingMatch(input));
  input.focus();
}

// Romaji hiện trong chip gợi ý. wanakana.toRomaji() đúng cho hầu hết trường hợp, NGOẠI TRỪ:
//  - Trường âm katakana (ー): toRomaji trả về nguyên âm đúp (vd "juusu") nhưng cách gõ thật cần
//    dấu "-" (vd "ju-su") — tự thay thế ở đây để chip không dạy sai cách gõ.
//  - Vài chữ dùng tổ hợp mở rộng (ファ/フォ...): toRomaji tách rời thành ký tự gốc (vd "sofua")
//    thay vì dạng gõ tự nhiên ("sofa") — dùng field `hint` set sẵn trong data.js để override.
function typingHintRomaji(target, scope) {
  if (target.hint) return target.hint;
  const romaji = wanakana.toRomaji(target.kana);
  return scope === "katakana" ? romaji.replace(/([aiueo])\1/g, "$1-") : romaji;
}

function renderTypingPractice() {
  const t = state.typing;
  const target = t.words[t.currentIndex];
  const total = t.words.length;
  const scopeLabel = t.scope === "hiragana" ? "Hiragana" : "Katakana";
  const romaji = typingHintRomaji(target, t.scope);

  return `
    ${renderAppHeader(`Luyện Gõ — ${scopeLabel}`, "go-typing-scope")}
    <div class="px-5 pb-8 pt-6 flex-1">
      <p class="text-center text-sm text-ink-faint font-medium mb-6">Từ ${t.currentIndex + 1}/${total}</p>

      <div class="w-full py-10 rounded-3xl bg-card shadow-xl flex flex-col items-center justify-center gap-2 mb-3">
        <p data-action="toggle-typing-hint"
          class="text-5xl font-semibold text-ink tracking-wide cursor-pointer select-none active:opacity-70 transition">
          ${target.kana}
        </p>
        <span id="typing-hint-chip" class="hidden px-3 py-1 rounded-full bg-teal-700/10 text-teal-700 text-sm font-bold tracking-wide">
          ${romaji}
        </span>
        <p class="text-base font-medium text-ink-faint">${target.vi}</p>
      </div>
      <p class="text-center text-xs text-ink-faint mb-6">👆 Bí quá thì chạm vào chữ xem gợi ý</p>

      <input id="typing-input" type="text" placeholder="Gõ romaji vào đây…"
        autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
        class="kana-text-input w-full py-4 px-4 rounded-2xl text-center text-2xl font-medium border-2 border-transparent bg-card shadow outline-none focus:border-teal-700 transition mb-2" />
      ${t.scope === "katakana"
      ? `<p class="text-center text-xs text-ink-faint mb-4">💡 Trường âm gõ dấu "-" nhé (vd: ke-ki → ケーキ)</p>`
      : `<div class="mb-4"></div>`
    }

      <div class="grid grid-cols-2 gap-3">
        <button data-action="clear-typing-input"
          class="py-3 rounded-2xl bg-cream-border text-ink-soft font-semibold transition active:scale-95">
          🧹 Xoá
        </button>
        <button data-action="skip-typing-word"
          class="py-3 rounded-2xl bg-cream-border text-ink-soft font-semibold transition active:scale-95">
          ⏭️ Bỏ qua
        </button>
      </div>
    </div>
  `;
}

function renderTypingComplete() {
  const t = state.typing;
  const skippedNote = t.skippedCount ? `, bỏ qua ${t.skippedCount} từ (lười)` : "";

  return `
    ${renderAppHeader()}
    <div class="flex flex-col items-center justify-center flex-1 px-6 text-center">
      <div class="text-6xl mb-4">⌨️</div>
      <h2 class="text-2xl font-bold text-ink mb-2">Gõ Xong Rồi Đấy À?</h2>
      <p class="text-ink-soft mb-8">Đúng ${t.correctCount}/${t.words.length} từ${skippedNote}.</p>
      <div class="w-full flex flex-col gap-4 max-w-xs">
        <button data-action="start-typing" data-scope="${t.scope}"
          class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
          🔄 Luyện Lại
        </button>
        <button data-action="go-typing-scope"
          class="w-full py-4 rounded-2xl bg-saffron-500 text-ink text-lg font-semibold shadow active:scale-95 transition">
          🔁 Đổi Bảng Chữ
        </button>
        <button data-action="go-home" class="w-full py-3 text-ink-faint font-medium">
          Trốn Về Nhà
        </button>
      </div>
    </div>
  `;
}

// ============================================================
// EVENT DELEGATION — xử lý toàn bộ tương tác click / change
// ============================================================
document.getElementById("app").addEventListener("click", (e) => {
  const target = e.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  switch (action) {
    case "set-scope":
      state.scope = target.dataset.scope;
      render();
      break;
    case "go-study":
      state.screen = "lessons";
      render();
      break;
    case "go-quiz":
      beginQuiz();
      break;
    case "go-home":
      state.screen = "home";
      render();
      break;
    case "go-lessons":
      state.screen = "lessons";
      render();
      break;
    case "start-lesson":
      startLesson(Number(target.dataset.lessonId));
      break;
    case "flip-card":
      flipCard();
      break;
    case "mark-known":
      markCard("known");
      break;
    case "mark-unknown":
      markCard("unknown");
      break;
    case "skip-to-matching":
      skipToMatching();
      break;
    case "select-left":
      selectMatchItem("left", target.dataset.key);
      break;
    case "select-right":
      selectMatchItem("right", target.dataset.key);
      break;
    case "continue-study":
      continueStudy();
      break;
    case "answer-quiz":
      answerQuiz(Number(target.dataset.idx));
      break;
    case "next-question":
      nextQuestion();
      break;
    case "retry-quiz":
      beginQuiz();
      break;
    case "review-wrong":
      reviewWrongCards();
      break;
    case "go-exam-list":
      stopExamTimer();
      state.screen = "exam-list";
      render();
      break;
    case "set-exam-mode":
      setExamMode(target.dataset.mode);
      break;
    case "start-exam":
      startExam(Number(target.dataset.testId));
      break;
    case "select-exam-answer":
      selectExamAnswer(target.dataset.letter);
      break;
    case "exam-prev":
      examPrev();
      break;
    case "exam-next":
      examNext();
      break;
    case "exit-exam":
      exitExam();
      break;
    case "submit-exam":
      submitExam();
      break;
    case "retry-exam":
      retryExam();
      break;
    case "go-typing-scope":
      state.screen = "typing-scope";
      render();
      break;
    case "start-typing":
      startTypingPractice(target.dataset.scope);
      break;
    case "clear-typing-input":
      clearTypingInput();
      break;
    case "skip-typing-word":
      skipTypingWord();
      break;
    case "toggle-typing-hint":
      toggleTypingHint();
      break;
    case "go-achievements":
      state.screen = "achievements";
      render();
      break;
    case "toggle-theme":
      toggleTheme();
      break;
  }
});

// ============================================================
// FEEDBACK MODAL — nút nổi + iframe Google Form, sống ngoài #app nên xử lý riêng, không qua
// event delegation của #app (vì render() không đụng tới các phần tử này).
// ============================================================
(function setupFeedbackWidget() {
  const fab = document.getElementById("feedback-fab");
  const menu = document.getElementById("feedback-menu");
  const menuBackdrop = document.getElementById("feedback-menu-backdrop");
  const menuCoffeeBtn = document.getElementById("feedback-menu-coffee");
  const menuFormBtn = document.getElementById("feedback-menu-form");

  const formOverlay = document.getElementById("feedback-modal-overlay");
  const formCloseBtn = document.getElementById("feedback-modal-close");
  const formIframe = document.getElementById("feedback-modal-iframe");

  const coffeeOverlay = document.getElementById("coffee-modal-overlay");
  const coffeeCloseBtn = document.getElementById("coffee-modal-close");

  const closeMenu = () => {
    menu.classList.add("hidden");
    menuBackdrop.classList.add("hidden");
  };
  const toggleMenu = () => {
    menu.classList.toggle("hidden");
    menuBackdrop.classList.toggle("hidden");
  };

  function openFormModal() {
    if (!formIframe.src) formIframe.src = formIframe.dataset.src; // nạp iframe lần đầu mở, tránh tải form thừa
    formOverlay.classList.remove("hidden");
  }
  const closeFormModal = () => formOverlay.classList.add("hidden");

  const openCoffeeModal = () => coffeeOverlay.classList.remove("hidden");
  const closeCoffeeModal = () => coffeeOverlay.classList.add("hidden");

  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  menuCoffeeBtn.addEventListener("click", () => {
    closeMenu();
    openCoffeeModal();
  });

  menuFormBtn.addEventListener("click", () => {
    closeMenu();
    openFormModal();
  });

  // Bấm ra ngoài menu (và không phải chính nút FAB) thì đóng menu
  document.addEventListener("click", (e) => {
    if (!menu.classList.contains("hidden") && !menu.contains(e.target) && e.target !== fab) {
      closeMenu();
    }
  });

  formCloseBtn.addEventListener("click", closeFormModal);
  formOverlay.addEventListener("click", (e) => {
    if (e.target === formOverlay) closeFormModal();
  });

  coffeeCloseBtn.addEventListener("click", closeCoffeeModal);
  coffeeOverlay.addEventListener("click", (e) => {
    if (e.target === coffeeOverlay) closeCoffeeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (!coffeeOverlay.classList.contains("hidden")) closeCoffeeModal();
    else if (!formOverlay.classList.contains("hidden")) closeFormModal();
    else if (!menu.classList.contains("hidden")) closeMenu();
  });
})();

// ============================================================
// KHỞI ĐỘNG APP
// ============================================================
render();
