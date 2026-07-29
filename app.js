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
function renderAppHeader(title, backAction = "go-home") {
  if (!title) {
    return `
      <div class="sticky top-0 z-40 bg-teal-700 text-white px-4 py-3 flex items-center justify-center shadow-md shrink-0">
        <span class="font-bold text-base tracking-wide">🔥 YAMATE KANA</span>
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
  }
  app.innerHTML = screenHtml + renderFooter();
  if (state.screen === "study-flashcard") activateFlashcardFlip();
  window.scrollTo(0, 0);
}

// ============================================================
// MÀN HOME
// ============================================================
function renderHome() {
  const hs = loadHighscores()[state.scope];
  const highscoreText = hs
    ? `Đỉnh cao hiện tại: ${hs.score}/${hs.total} (${Math.round((hs.score / hs.total) * 100)}%) — ngon, đừng ảo`
    : "Chưa thi lần nào, sợ à?";

  const scopes = [
    { key: "hiragana", label: "Hiragana" },
    { key: "katakana", label: "Katakana" },
    { key: "both", label: "Cả 2 (tham lam)" },
  ];

  return `
    ${renderAppHeader()}
    <div class="flex flex-col flex-1 px-5 pt-12 pb-8">
      <div class="text-center mb-10">
        <div class="text-5xl mb-3">🇯🇵</div>
        <p class="text-ink font-bold italic">"Học nhiều ngu nhiều, học ít ngu ít, không học không ngu"</p>
        <p class="text-ink-soft mt-2 text-sm">Học đi đồ lười, để lâu não mốc</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-4 mb-8">
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

      <div class="flex flex-col gap-5 mt-4">
        <button data-action="go-study"
          class="w-full py-5 rounded-2xl bg-teal-700 text-white text-xl font-semibold shadow-lg active:scale-95 transition">
          📖 Vào học đi đồ lười
        </button>
        <button data-action="go-quiz"
          class="w-full py-5 rounded-2xl bg-saffron-500 text-ink text-xl font-semibold shadow-lg active:scale-95 transition">
          📝 Vào chịu tội 20 câu
        </button>
      </div>

      <div class="mt-8 text-center">
        <p class="inline-block bg-white/70 rounded-full px-4 py-2 text-sm font-medium text-ink-soft shadow-sm">
          🏆 ${highscoreText}
        </p>
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
      class="text-left p-4 rounded-2xl shadow bg-white transition active:scale-95 flex flex-col gap-2 ${locked ? "opacity-50" : ""
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
  render();
}

// Bỏ qua phần còn lại của flashcard, nhảy thẳng sang ghép cặp với toàn bộ danh sách của phiên học
function skipToMatching() {
  const s = state.study;
  s.current = null;
  s.queue = [];
  startMatchingStage(s.sessionCards);
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

      <div class="flip-scene w-full aspect-square max-h-[45vh] mb-8 active:scale-[0.98] transition">
        <div id="flip-card-inner" data-action="flip-card" class="flip-card cursor-pointer">
          <div class="flip-face rounded-3xl bg-white shadow-xl flex items-center justify-center">
            <span class="text-8xl font-medium text-ink">${card.char}</span>
          </div>
          <div class="flip-face flip-face--back rounded-3xl bg-white shadow-xl flex flex-col items-center justify-center gap-3">
            <span class="text-7xl font-medium text-ink">${card.char}</span>
            <span class="text-3xl font-medium text-teal-600">${card.romaji}</span>
          </div>
        </div>
      </div>

      ${!s.flipped
      ? `<button data-action="flip-card" class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition mb-3">
               Lật Đi, Sợ Gì
             </button>`
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
    return `${base} bg-white text-ink border-transparent`;
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
      let cls = "bg-white text-ink border-transparent";
      if (selected !== null) {
        if (isCorrect) cls = "bg-status-ok text-white border-status-ok";
        else if (isChosen) cls = "bg-status-busy text-white border-status-busy animate-shake";
        else cls = "bg-white text-ink-faint border-transparent";
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

      <div class="w-full py-10 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6">
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
          <div class="bg-white rounded-xl shadow p-3 flex items-center justify-between gap-3">
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
      <div class="bg-white rounded-3xl shadow-xl p-6 text-center mb-8">
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
      state.study.flipped = true;
      render();
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
  }
});

// ============================================================
// KHỞI ĐỘNG APP
// ============================================================
render();
