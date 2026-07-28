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
// STATE — trạng thái toàn cục của app
// ============================================================
const state = {
  scope: "hiragana", // 'hiragana' | 'katakana' | 'both'
  screen: "home",

  study: {
    groups: GROUPS.map((g) => g.key), // các nhóm đang được chọn để học
    reviewOnly: false, // chỉ ôn chữ chưa thuộc
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
  return "Cả hai";
}

// ============================================================
// RENDER — chọn màn hình hiện tại để hiển thị
// ============================================================
function render() {
  const app = document.getElementById("app");
  switch (state.screen) {
    case "home":
      app.innerHTML = renderHome();
      break;
    case "study-flashcard":
      app.innerHTML = renderStudyFlashcard();
      activateFlashcardFlip();
      break;
    case "study-matching":
      app.innerHTML = renderStudyMatching();
      break;
    case "study-complete":
      app.innerHTML = renderStudyComplete();
      break;
    case "quiz":
      app.innerHTML = renderQuiz();
      break;
    case "quiz-result":
      app.innerHTML = renderQuizResult();
      break;
  }
  window.scrollTo(0, 0);
}

// Header dùng chung cho các màn không phải Home (nút quay lại)
function renderBackHeader(title) {
  return `
    <div class="flex items-center gap-3 px-4 pt-4 pb-2">
      <button data-action="go-home" aria-label="Về trang chủ"
        class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow active:scale-90 transition text-teal-700 text-xl shrink-0">
        ←
      </button>
      <h1 class="text-lg font-semibold text-ink truncate">${title}</h1>
    </div>
  `;
}

// ============================================================
// MÀN HOME
// ============================================================
function renderHome() {
  const hs = loadHighscores()[state.scope];
  const highscoreText = hs
    ? `Điểm cao nhất: ${hs.score}/${hs.total} (${Math.round((hs.score / hs.total) * 100)}%)`
    : "Chưa có điểm — hãy thử thi 20 câu!";

  const scopes = [
    { key: "hiragana", label: "Hiragana" },
    { key: "katakana", label: "Katakana" },
    { key: "both", label: "Cả hai" },
  ];

  return `
    <div class="flex flex-col min-h-screen px-5 pt-10 pb-8">
      <div class="text-center mb-8">
        <div class="text-5xl mb-2">🇯🇵</div>
        <h1 class="text-2xl font-bold text-ink">Học Hiragana &amp; Katakana</h1>
        <p class="text-ink-soft mt-1 text-sm">Luyện chữ cái tiếng Nhật mỗi ngày</p>
      </div>

      <div class="bg-white rounded-2xl shadow-md p-4 mb-6">
        <p class="text-sm font-medium text-ink-soft mb-2">Chọn bảng chữ</p>
        <div class="grid grid-cols-3 gap-2">
          ${scopes
            .map(
              (s) => `
            <button data-action="set-scope" data-scope="${s.key}"
              class="py-3 rounded-xl text-sm font-semibold transition active:scale-95 ${
                state.scope === s.key
                  ? "bg-teal-700 text-white shadow"
                  : "bg-cream-border text-ink-soft"
              }">
              ${s.label}
            </button>`
            )
            .join("")}
        </div>
      </div>

      <div class="flex flex-col gap-4 mt-2">
        <button data-action="go-study"
          class="w-full py-5 rounded-2xl bg-teal-700 text-white text-xl font-semibold shadow-lg active:scale-95 transition">
          📖 Học
        </button>
        <button data-action="go-quiz"
          class="w-full py-5 rounded-2xl bg-saffron-500 text-ink text-xl font-semibold shadow-lg active:scale-95 transition">
          📝 Thi 20 câu
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
// HỌC — GIAI ĐOẠN 1: FLASHCARD
// ============================================================

// Tính danh sách chữ theo bộ lọc nhóm + tùy chọn "chỉ ôn chữ chưa thuộc"
function getFilteredStudyPool() {
  const s = state.study;
  let pool = getPool(state.scope).filter((c) => s.groups.includes(c.group));
  if (s.reviewOnly) {
    const progress = loadProgress();
    pool = pool.filter((c) => progress[cardKey(c)] !== "known");
  }
  return pool;
}

// Bắt đầu 1 phiên học bình thường (từ màn Home), dùng toàn bộ nhóm mặc định
function beginNormalStudy() {
  state.study.customList = null;
  state.study.reviewOnly = false;
  state.study.groups = GROUPS.map((g) => g.key);
  rebuildFlashcardQueue();
  state.screen = "study-flashcard";
  render();
}

// Bắt đầu phiên học với 1 danh sách cố định (dùng khi "Ôn các câu sai")
function beginCustomStudy(cards) {
  state.study.customList = cards;
  state.study.sessionCards = cards;
  const shuffled = shuffle(cards);
  state.study.current = shuffled.shift() || null;
  state.study.queue = shuffled;
  state.study.flipped = false;
  state.screen = "study-flashcard";
  render();
}

// Dựng lại hàng đợi flashcard mỗi khi đổi bộ lọc nhóm / "chỉ ôn chữ chưa thuộc"
function rebuildFlashcardQueue() {
  if (state.study.customList) return; // danh sách cố định thì không áp dụng bộ lọc
  const cards = getFilteredStudyPool();
  const shuffled = shuffle(cards);
  state.study.sessionCards = cards;
  state.study.current = shuffled.shift() || null;
  state.study.queue = shuffled;
  state.study.flipped = false;
}

function toggleGroup(group) {
  const s = state.study;
  const idx = s.groups.indexOf(group);
  if (idx >= 0) {
    if (s.groups.length > 1) s.groups.splice(idx, 1); // luôn giữ ít nhất 1 nhóm
  } else {
    s.groups.push(group);
  }
  rebuildFlashcardQueue();
  render();
}

function toggleReviewOnly() {
  state.study.reviewOnly = !state.study.reviewOnly;
  rebuildFlashcardQueue();
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

function renderStudyFlashcard() {
  const s = state.study;
  const card = s.current;

  if (!card) {
    // Không có chữ nào khớp bộ lọc hiện tại
    return `
      ${renderBackHeader("Học — Flashcard")}
      <div class="px-5 text-center mt-16">
        <p class="text-5xl mb-4">🤷</p>
        <p class="text-ink-soft font-medium">Không có chữ nào phù hợp với bộ lọc hiện tại.</p>
        <p class="text-ink-faint text-sm mt-1">Hãy chọn thêm nhóm hoặc tắt "chỉ ôn chữ chưa thuộc".</p>
      </div>
      ${!s.customList ? renderGroupFilters() : ""}
    `;
  }

  const doneCount = s.sessionCards.length - s.queue.length - 1;
  const progressText = `${doneCount + 1}/${s.sessionCards.length}`;

  return `
    ${renderBackHeader("Học — Flashcard")}
    <div class="px-5 pb-8">
      ${
        s.customList
          ? `<p class="text-center text-sm font-medium text-teal-700 mb-3">🔁 Đang ôn ${s.customList.length} câu sai từ bài thi</p>`
          : renderGroupFilters()
      }

      <p class="text-center text-sm text-ink-faint font-medium mb-3">${progressText}</p>

      <div class="flip-scene w-full aspect-square max-h-[45vh] mb-6 active:scale-[0.98] transition">
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

      ${
        !s.flipped
          ? `<button data-action="flip-card" class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition mb-3">
               Lật thẻ
             </button>`
          : `<div class="grid grid-cols-2 gap-3">
               <button data-action="mark-unknown" class="py-4 rounded-2xl bg-status-busy text-white text-lg font-semibold shadow active:scale-95 transition">
                 ❌ Chưa nhớ
               </button>
               <button data-action="mark-known" class="py-4 rounded-2xl bg-status-ok text-white text-lg font-semibold shadow active:scale-95 transition">
                 ✅ Đã nhớ
               </button>
             </div>`
      }
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

// Thanh chọn nhóm + checkbox "chỉ ôn chữ chưa thuộc"
function renderGroupFilters() {
  const s = state.study;
  return `
    <div class="mb-4">
      <div class="flex flex-wrap gap-2 justify-center mb-3">
        ${GROUPS.map(
          (g) => `
          <button data-action="toggle-group" data-group="${g.key}"
            class="px-3 py-1.5 rounded-full text-sm font-semibold transition active:scale-95 ${
              s.groups.includes(g.key)
                ? "bg-teal-700 text-white"
                : "bg-cream-border text-ink-soft"
            }">
            ${g.label}
          </button>`
        ).join("")}
      </div>
      <label class="flex items-center justify-center gap-2 text-sm text-ink-soft font-medium">
        <input type="checkbox" id="review-only-checkbox" ${s.reviewOnly ? "checked" : ""}
          class="w-5 h-5 accent-teal-700" />
        Chỉ ôn chữ chưa thuộc
      </label>
    </div>
  `;
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
    if (m.lastCorrect === key) return `${base} bg-status-ok text-white border-status-ok`;
    if (m.lastWrong && m.lastWrong[side] === key)
      return `${base} bg-status-busy text-white border-status-busy animate-shake`;
    if ((side === "left" && m.selectedLeft === key) || (side === "right" && m.selectedRight === key))
      return `${base} bg-teal-700 text-white border-teal-700`;
    return `${base} bg-white text-ink border-transparent`;
  }

  const leftHtml = m.leftOrder
    .filter((key) => !m.matchedKeys.has(key))
    .map(
      (key) => `
      <button data-action="select-left" data-key="${key}" class="${itemClasses(key, "left")}">
        ${cardsByKey[key].char}
      </button>`
    )
    .join("");

  const rightHtml = m.rightOrder
    .filter((key) => !m.matchedKeys.has(key))
    .map(
      (key) => `
      <button data-action="select-right" data-key="${key}" class="${itemClasses(key, "right")}">
        ${cardsByKey[key].romaji}
      </button>`
    )
    .join("");

  return `
    ${renderBackHeader("Học — Ghép cặp")}
    <div class="px-4 pb-8">
      <p class="text-center text-sm text-ink-faint font-medium mb-4">
        Đã ghép ${totalDone}/${state.study.sessionCards.length} · Chọn 1 chữ Nhật + 1 romaji để ghép
      </p>
      <div class="grid grid-cols-2 gap-3">
        <div class="flex flex-col gap-3">${leftHtml}</div>
        <div class="flex flex-col gap-3">${rightHtml}</div>
      </div>
    </div>
  `;
}

// ============================================================
// HỌC — HOÀN THÀNH SESSION
// ============================================================
function renderStudyComplete() {
  return `
    <div class="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold text-ink mb-2">Hoàn thành phiên học!</h2>
      <p class="text-ink-soft mb-8">Bạn đã học xong ${state.study.sessionCards.length} chữ. Tiếp tục luyện tập nhé!</p>
      <div class="w-full flex flex-col gap-3 max-w-xs">
        <button data-action="continue-study"
          class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
          📖 Học tiếp
        </button>
        <button data-action="go-quiz"
          class="w-full py-4 rounded-2xl bg-saffron-500 text-ink text-lg font-semibold shadow active:scale-95 transition">
          📝 Đi thi 20 câu
        </button>
        <button data-action="go-home" class="w-full py-3 text-ink-faint font-medium">
          Về trang chủ
        </button>
      </div>
    </div>
  `;
}

function continueStudy() {
  if (state.study.customList) {
    beginNormalStudy();
  } else {
    rebuildFlashcardQueue();
    state.screen = "study-flashcard";
    render();
  }
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
}

function answerQuiz(optionIdx) {
  const q = state.quiz.questions[state.quiz.currentIndex];
  if (state.quiz.selected !== null) return; // đã trả lời câu này rồi
  state.quiz.selected = optionIdx;
  const chosen = q.options[optionIdx];
  if (chosen === q.card) {
    state.quiz.score++;
  } else {
    state.quiz.wrong.push({ card: q.card, direction: q.direction, userAnswer: chosen });
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
    ${renderBackHeader("Thi 20 câu")}
    <div class="px-5 pb-8">
      <div class="flex justify-between items-center text-sm font-medium text-ink-faint mb-4">
        <span>Câu ${state.quiz.currentIndex + 1}/${state.quiz.questions.length}</span>
        <span>Điểm: ${state.quiz.score}</span>
      </div>

      <div class="w-full h-2 bg-cream-border rounded-full mb-6 overflow-hidden">
        <div class="h-full bg-teal-700 transition-all" style="width: ${
          ((state.quiz.currentIndex + (selected !== null ? 1 : 0)) / state.quiz.questions.length) * 100
        }%"></div>
      </div>

      <div class="w-full py-10 rounded-3xl bg-white shadow-xl flex items-center justify-center mb-6">
        ${promptHtml}
      </div>

      <div class="grid grid-cols-2 gap-3 mb-4">
        ${optionsHtml}
      </div>

      ${
        selected !== null
          ? `<button data-action="next-question"
              class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
              ${isLast ? "Xem kết quả →" : "Câu tiếp →"}
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
              <p class="text-status-busy font-medium">Bạn chọn: ${yourLabel}</p>
              <p class="text-status-ok font-medium">Đáp án đúng: ${correctLabel}</p>
            </div>
          </div>`;
        })
        .join("")
    : `<p class="text-center text-ink-faint text-sm py-4">🎉 Không có câu nào sai, tuyệt vời!</p>`;

  return `
    ${renderBackHeader("Kết quả")}
    <div class="px-5 pb-8">
      <div class="bg-white rounded-3xl shadow-xl p-6 text-center mb-6">
        <p class="text-5xl font-bold text-teal-700">${score}/${total}</p>
        <p class="text-ink-soft font-medium mt-1">${percent}% chính xác</p>
      </div>

      <div class="flex flex-col gap-2 mb-6">
        ${wrongHtml}
      </div>

      <div class="flex flex-col gap-3">
        <button data-action="retry-quiz"
          class="w-full py-4 rounded-2xl bg-teal-700 text-white text-lg font-semibold shadow active:scale-95 transition">
          🔄 Thi lại
        </button>
        ${
          wrong.length
            ? `<button data-action="review-wrong"
                class="w-full py-4 rounded-2xl bg-saffron-500 text-ink text-lg font-semibold shadow active:scale-95 transition">
                📖 Ôn các câu sai
              </button>`
            : ""
        }
        <button data-action="go-home" class="w-full py-3 text-ink-faint font-medium">
          Về trang chủ
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
      beginNormalStudy();
      break;
    case "go-quiz":
      beginQuiz();
      break;
    case "go-home":
      state.screen = "home";
      render();
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
    case "toggle-group":
      toggleGroup(target.dataset.group);
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

document.getElementById("app").addEventListener("change", (e) => {
  if (e.target.id === "review-only-checkbox") {
    toggleReviewOnly();
  }
});

// ============================================================
// KHỞI ĐỘNG APP
// ============================================================
render();
