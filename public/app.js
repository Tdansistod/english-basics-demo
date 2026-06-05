"use strict";

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
const state = {
  category: null, // string | null
  count: 5, // 5 | 10
  sessionId: null, // string | null
  plan: [], // ["multiple-choice" | "free-write", ...] — precomputed at session start
  current: 0, // 0-indexed
  currentQuestion: null, // the most recently fetched question object
  items: [], // { id, type, category, prompt, answer, options, correct, explanation, polished, mistakes, praise, score }
  correctCount: 0,
  totalAnswered: 0,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function showView(id) {
  $$(".view").forEach((v) => v.classList.remove("active"));
  $(`#view-${id}`).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function api(url, opts) {
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

// ---------------------------------------------------------------------------
// Setup view
// ---------------------------------------------------------------------------
async function initSetup() {
  try {
    const { categories } = await api("/api/categories");
    const grid = $("#category-grid");
    grid.innerHTML = "";
    categories.forEach((cat, i) => {
      const card = el("button", "cat-card");
      card.type = "button";
      card.dataset.cat = cat.name;
      const name = el("div", "cat-name", cat.name);
      const count = el("div", "cat-count", `${cat.count} questions`);
      card.appendChild(name);
      card.appendChild(count);
      if (i === 0) {
        card.classList.add("active");
        state.category = cat.name;
      }
      card.addEventListener("click", () => {
        $$("#category-grid .cat-card").forEach((c) =>
          c.classList.remove("active"),
        );
        card.classList.add("active");
        state.category = cat.name;
      });
      grid.appendChild(card);
    });
  } catch (err) {
    $("#category-grid").innerHTML =
      `<p class="empty-state">Could not load categories: ${err.message}</p>`;
  }
}

function wireChipGroup(selector, key, parse) {
  $$(`${selector} .chip`).forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(`${selector} .chip`).forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state[key] = parse ? parse(chip.dataset[key]) : chip.dataset[key];
    });
  });
}

// Build the question-type plan: positions 5, 10, 15, ... are free-write.
// Values match the server's accepted strings ("multiple-choice" | "free-write").
function buildPlan(total) {
  const plan = [];
  for (let i = 1; i <= total; i++) {
    plan.push(i % 5 === 0 ? "free-write" : "multiple-choice");
  }
  return plan;
}

// ---------------------------------------------------------------------------
// Session lifecycle
// ---------------------------------------------------------------------------
async function startSession() {
  if (!state.category) {
    alert("Please pick a category first.");
    return;
  }
  const btn = $("#start-btn");
  btn.disabled = true;
  btn.textContent = "Loading…";
  try {
    state.sessionId =
      Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    state.plan = buildPlan(state.count);
    state.current = 0;
    state.items = [];
    state.correctCount = 0;
    state.totalAnswered = 0;

    $("#pr-category").textContent = state.category;
    updateScorePill();
    $("#pr-progress-text").textContent = `Question 1 of ${state.count}`;
    $("#pr-progress-fill").style.width = `0%`;

    showView("practice");
    await loadNextQuestion();
  } catch (err) {
    alert(err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = "Start practice →";
  }
}

async function loadNextQuestion() {
  const idx = state.current;
  const type = state.plan[idx]; // "multiple-choice" | "free-write"

  // Show progress + which type is coming.
  $("#pr-progress-text").textContent = `Question ${idx + 1} of ${state.count}`;
  $("#pr-progress-fill").style.width = `${(idx / state.count) * 100}%`;
  const typeTag = $("#pr-type");
  typeTag.textContent = type === "free-write" ? "Free write" : "Multiple choice";
  typeTag.classList.toggle("type-free", type === "free-write");

  // Hide both question cards, then render the right one.
  $("#mc-card").classList.add("hidden");
  $("#free-card").classList.add("hidden");
  $("#feedback-panel").classList.add("hidden");
  $("#pr-loading").classList.add("hidden");

  try {
    const q = await api("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: state.category, type }),
    });
    state.currentQuestion = q;

    if (q.type === "multiple-choice") {
      renderMC(q);
    } else {
      renderFree(q);
    }
  } catch (err) {
    alert(`Could not load question: ${err.message}`);
  }
}

// ---------------------------------------------------------------------------
// Multiple-choice question
// ---------------------------------------------------------------------------
function renderMC(q) {
  $("#q-num").textContent = state.current + 1;
  $("#q-prompt").textContent = q.prompt;

  const grid = $("#q-options");
  grid.innerHTML = "";
  const letters = ["A", "B", "C", "D"];
  q.options.forEach((opt, i) => {
    const btn = el("button", "option-btn");
    btn.type = "button";
    btn.dataset.idx = i;
    const letter = el("span", "opt-letter", letters[i]);
    const text = el("span", "opt-text", opt);
    btn.appendChild(letter);
    btn.appendChild(text);
    btn.addEventListener("click", () => handleMCAnswer(i, btn));
    grid.appendChild(btn);
  });

  $("#mc-card").classList.remove("hidden");
}

async function handleMCAnswer(idx, btn) {
  // Disable all option buttons.
  $$("#q-options .option-btn").forEach((b) => (b.disabled = true));

  const q = state.currentQuestion;
  let result;
  try {
    result = await api("/api/check-mc", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.id, answer: idx }),
    });
  } catch (err) {
    alert(err.message);
    $$("#q-options .option-btn").forEach((b) => (b.disabled = false));
    return;
  }

  // Color the chosen button + reveal the correct one.
  btn.classList.add(result.correct ? "correct" : "wrong");
  if (!result.correct) {
    const correctBtn = $$("#q-options .option-btn").find(
      (b) => Number(b.dataset.idx) === result.correctIndex,
    );
    if (correctBtn) correctBtn.classList.add("reveal");
  }

  state.totalAnswered += 1;
  if (result.correct) state.correctCount += 1;
  updateScorePill();
  $("#pr-progress-fill").style.width = `${
    ((state.current + 1) / state.count) * 100
  }%`;

  state.items.push({
    id: q.id,
    type: "multiple-choice",
    category: q.category,
    prompt: q.prompt,
    options: q.options,
    answer: q.options[idx],
    correctIdx: idx,
    correctIndex: result.correctIndex,
    correctOption: result.correctOption,
    explanation: result.explanation,
    score: result.correct ? 1 : 0, // 0/1 per question, normalized to /5 in the report
  });

  renderFeedbackMC(result);
}

function renderFeedbackMC(result) {
  const icon = $("#feedback-icon");
  const title = $("#feedback-title");
  const body = $("#feedback-body");
  const corrected = $("#corrected-block");
  const modelBlock = $("#model-block");
  const praise = $("#praise-block");
  const next = $("#next-btn");

  icon.className = `feedback-icon ${result.correct ? "correct" : "wrong"}`;
  icon.textContent = result.correct ? "✓" : "✗";
  title.textContent = result.correct
    ? "Nicely done"
    : "Not quite — here's why";

  body.innerHTML = "";
  const label = el("span", "explanation-label", "Why");
  const text = el("p", null, result.explanation);
  body.appendChild(label);
  body.appendChild(text);

  // Reset extra blocks.
  corrected.classList.add("hidden");
  modelBlock.classList.add("hidden");
  praise.classList.add("hidden");

  // Last question? change the next button label.
  const isLast = state.current >= state.count - 1;
  next.textContent = isLast
    ? "Finish session →"
    : "Next question →";

  $("#feedback-panel").classList.remove("hidden");
  // Scroll the feedback into view.
  $("#feedback-panel").scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}

// ---------------------------------------------------------------------------
// Free-write question
// ---------------------------------------------------------------------------
function renderFree(q) {
  $("#q-num-free").textContent = state.current + 1;
  $("#q-prompt-free").textContent = q.prompt;
  const input = $("#free-input");
  input.value = "";
  input.disabled = false;
  $("#free-submit").disabled = false;
  $("#free-card").classList.remove("hidden");
  setTimeout(() => input.focus(), 60);
}

async function handleFreeSubmit() {
  const input = $("#free-input");
  const sentence = input.value.trim();
  if (!sentence) {
    alert("Please write a sentence first.");
    return;
  }

  input.disabled = true;
  $("#free-submit").disabled = true;
  $("#feedback-panel").classList.add("hidden");
  $("#pr-loading").classList.remove("hidden");

  const q = state.currentQuestion;
  let result;
  try {
    result = await api("/api/check-free", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sentence, prompt: q.prompt, category: q.category }),
    });
  } catch (err) {
    $("#pr-loading").classList.add("hidden");
    alert(err.message);
    input.disabled = false;
    $("#free-submit").disabled = false;
    return;
  }

  $("#pr-loading").classList.add("hidden");

  const mistakeCount = (result.mistakes || []).length;
  const correct = mistakeCount === 0;
  state.totalAnswered += 1;
  if (correct) state.correctCount += 1;
  updateScorePill();
  $("#pr-progress-fill").style.width = `${
    ((state.current + 1) / state.count) * 100
  }%`;

  state.items.push({
    id: q.id,
    type: "free-write",
    category: q.category,
    prompt: q.prompt,
    answer: sentence,
    polished: result.polished || "",
    mistakes: result.mistakes || [],
    praise: result.praise || "",
    score: correct ? 1 : 0,
  });

  renderFeedbackFree({ ...result, correct, mistakeCount, q });
}

function renderFeedbackFree({ correct, mistakeCount, mistakes, polished, praise: praiseText, q }) {
  const icon = $("#feedback-icon");
  const title = $("#feedback-title");
  const body = $("#feedback-body");
  const corrected = $("#corrected-block");
  const modelBlock = $("#model-block");
  const praiseBlock = $("#praise-block");
  const next = $("#next-btn");

  icon.className = `feedback-icon ${correct ? "correct" : "wrong"}`;
  icon.textContent = correct ? "✓" : "!";
  title.textContent = correct
    ? "Perfect — no mistakes"
    : mistakeCount === 1
      ? "1 mistake"
      : `${mistakeCount} mistakes`;

  body.innerHTML = "";
  const list = el("div", "mistake-list");

  if (!mistakes || mistakes.length === 0) {
    const item = el("div", "mistake-item no-mistakes");
    item.appendChild(
      el(
        "p",
        "mistake-why",
        "Your sentence is correct. The shape, word order, and grammar all check out.",
      ),
    );
    list.appendChild(item);
  } else {
    mistakes.forEach((m) => {
      const item = el("div", "mistake-item");
      const head = el("div", "mistake-original");
      if (m.original) {
        const wrong = el("span", "mistake-wrong", m.original);
        head.appendChild(wrong);
      }
      if (m.fix) {
        head.appendChild(el("span", "mistake-arrow", "→"));
        const fix = el("span", "mistake-fix", m.fix);
        head.appendChild(fix);
      }
      item.appendChild(head);
      if (m.why) {
        // Highlight "Spanish ..." comparison segments the model occasionally
        // produces, to draw the eye to the cross-language explanation.
        const whyEl = el("p", "mistake-why");
        whyEl.textContent = m.why;
        item.appendChild(whyEl);
      }
      list.appendChild(item);
    });
  }
  body.appendChild(list);

  // Polished sentence from the AI.
  corrected.classList.add("hidden");
  modelBlock.classList.add("hidden");
  if (polished) {
    $("#corrected-text").textContent = polished;
    corrected.classList.remove("hidden");
  }
  // For free-write, the model answer from the bank is also useful as a
  // reference — show it after the polished sentence when both are present.
  if (q.explanation) {
    $("#model-text").textContent = q.explanation;
    modelBlock.classList.remove("hidden");
  }

  // Praise line.
  praiseBlock.classList.add("hidden");
  if (praiseText) {
    $("#praise-text").textContent = praiseText;
    praiseBlock.classList.remove("hidden");
  }

  const isLast = state.current >= state.count - 1;
  next.textContent = isLast
    ? "Finish session →"
    : "Next question →";

  $("#feedback-panel").classList.remove("hidden");
  $("#feedback-panel").scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
}

function updateScorePill() {
  $("#pr-score").textContent = state.correctCount;
  $("#pr-total").textContent = state.totalAnswered;
}

// ---------------------------------------------------------------------------
// Advance / finish
// ---------------------------------------------------------------------------
function nextQuestion() {
  if (state.current >= state.count - 1) {
    finishSession();
    return;
  }
  state.current++;
  loadNextQuestion();
}

async function finishSession() {
  showView("report");
  $("#report-loading").classList.remove("hidden");
  $("#report-content").classList.add("hidden");

  try {
    const record = await api("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: state.sessionId,
        category: state.category,
        items: state.items,
      }),
    });
    renderReport(record);
  } catch (err) {
    $("#report-loading").innerHTML =
      `<p class="empty-state">Report failed: ${err.message}</p>`;
  }
}

function renderReport(record) {
  const r = record.report || {};
  const totalQ = record.questionCount;
  const pct = totalQ ? (record.averageScore / 5) * 100 : 0;

  $("#rep-rating").textContent = r.overall_rating || "Done";
  $("#rep-category").textContent = record.category;
  // Convert per-question 0/1 into a 0–5 scale so the report view matches the
  // rating system. (1 correct out of 10 = 0.5/5, etc.)
  $("#rep-score").textContent = `${record.averageScore.toFixed(
    2,
  )} / 5 · ${state.correctCount}/${totalQ} questions right`;

  $("#rep-summary").textContent = r.summary || "";

  fillList("#rep-strengths", r.strengths);
  fillList("#rep-weaknesses", r.weaknesses);
  fillList("#rep-improve", r.areas_to_improve);

  const tr = $("#rep-transcript");
  tr.innerHTML = "";
  record.items.forEach((it, i) => {
    const wrap = el("div", "tr-item");

    const head = el("div", "tr-head");
    const icon = el(
      "span",
      `tr-icon ${it.score === 1 ? "correct" : "wrong"}`,
      it.score === 1 ? "✓" : "✗",
    );
    head.appendChild(icon);
    const prompt = el("p", "tr-prompt");
    const typeTag = el(
      "span",
      "tr-type",
      it.type === "free-write" ? "FREE WRITE" : "MC",
    );
    prompt.appendChild(typeTag);
    prompt.appendChild(document.createTextNode(it.prompt || ""));
    head.appendChild(prompt);
    wrap.appendChild(head);

    if (it.type === "multiple-choice") {
      const your = it.answer
        ? `Your answer: ${it.answer}`
        : "Your answer: (skipped)";
      const right = it.correctOption
        ? `Correct: ${it.correctOption}`
        : "";
      wrap.appendChild(el("div", "tr-answer", your + (right ? `\n${right}` : "")));
    } else {
      wrap.appendChild(
        el(
          "div",
          "tr-answer",
          `Your sentence: ${it.answer || "(empty)"}`,
        ),
      );
      if (it.polished) {
        const pol = el("div", "tr-corrected");
        pol.appendChild(
          el("div", "tr-corrected-label", "AI polished"),
        );
        pol.appendChild(document.createTextNode(it.polished));
        wrap.appendChild(pol);
      }
    }

    if (it.explanation) {
      const ex = el("div", "tr-explain");
      ex.appendChild(el("strong", null, "Why: "));
      ex.appendChild(document.createTextNode(it.explanation));
      wrap.appendChild(ex);
    }

    tr.appendChild(wrap);
  });

  $("#report-loading").classList.add("hidden");
  $("#report-content").classList.remove("hidden");
}

function fillList(sel, arr) {
  const ul = $(sel);
  ul.innerHTML = "";
  (arr || []).forEach((x) => ul.appendChild(el("li", null, x)));
  if (!arr || !arr.length) ul.appendChild(el("li", null, "—"));
}

// ---------------------------------------------------------------------------
// Manual save (in case the user wants to save without the auto-save that
// happens during /api/report — the report endpoint already saves, but we
// expose this as an explicit "Save session" button for clarity).
// ---------------------------------------------------------------------------
async function saveCurrentSession() {
  const btn = $("#save-btn");
  btn.disabled = true;
  btn.textContent = "Saving…";
  try {
    await api("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session: {
          id: state.sessionId,
          category: state.category,
          questions: state.items,
          score: state.count ? state.correctCount / state.count : 0,
          date: new Date().toISOString(),
        },
      }),
    });
    btn.textContent = "Saved ✓";
    setTimeout(() => {
      btn.textContent = "Save session";
      btn.disabled = false;
    }, 2000);
  } catch (err) {
    alert(err.message);
    btn.disabled = false;
    btn.textContent = "Save session";
  }
}

// ---------------------------------------------------------------------------
// History
// ---------------------------------------------------------------------------
async function openHistory() {
  showView("history");
  const list = $("#history-list");
  list.innerHTML = `<div class="loading"><span class="spinner"></span> Loading…</div>`;

  try {
    const { sessions } = await api("/api/history");
    list.innerHTML = "";
    if (!sessions.length) {
      list.appendChild(
        el("p", "empty-state", "No past sessions yet. Go run a practice round."),
      );
      return;
    }
    sessions.forEach((s) => {
      const item = el("div", "history-item");
      const left = el("div", "hi-left");
      left.appendChild(el("div", "hi-cat", s.category));
      const date = new Date(s.createdAt).toLocaleString();
      const scoreOutOf5 = (s.averageScore || 0).toFixed(2);
      left.appendChild(
        el(
          "div",
          "hi-sub",
          `${s.questionCount} questions · ${scoreOutOf5}/5 · ${date}`,
        ),
      );
      item.appendChild(left);

      const right = el("div", "hi-right");
      right.appendChild(el("div", "hi-avg", `${Math.round((s.averageScore / 5) * 100)}%`));
      if (s.overallRating) {
        right.appendChild(el("div", "hi-rating", s.overallRating));
      }
      item.appendChild(right);

      item.addEventListener("click", () => loadPastSession(s.sessionId));
      list.appendChild(item);
    });
  } catch (err) {
    list.innerHTML = `<p class="empty-state">Could not load history: ${err.message}</p>`;
  }
}

async function loadPastSession(id) {
  try {
    const record = await api(`/api/sessions/${id}`);
    showView("report");
    $("#report-loading").classList.add("hidden");
    renderReport(record);
  } catch (err) {
    alert(err.message);
  }
}

// ---------------------------------------------------------------------------
// Wire up
// ---------------------------------------------------------------------------
function init() {
  initSetup();
  wireChipGroup("#count-grid", "count", (v) => parseInt(v, 10));

  $("#start-btn").addEventListener("click", startSession);
  $("#next-btn").addEventListener("click", nextQuestion);
  $("#free-submit").addEventListener("click", handleFreeSubmit);
  $("#save-btn").addEventListener("click", saveCurrentSession);
  $("#restart-btn").addEventListener("click", () => showView("setup"));
  $("#history-btn").addEventListener("click", openHistory);
  $("#back-from-history").addEventListener("click", () => showView("setup"));

  // Ctrl/Cmd+Enter submits free-write.
  $("#free-input").addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      if (!$("#free-submit").disabled) handleFreeSubmit();
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
