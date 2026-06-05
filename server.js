"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const OpenAI = require("openai");

const { QUESTIONS, CATEGORIES } = require("./questions");

const PORT = process.env.PORT || 3002;
// MiniMax is OpenAI-compatible. Defaults below can be overridden via .env.
const BASE_URL = process.env.MINIMAX_BASE_URL || "https://api.minimax.io/v1";
const MODEL = process.env.MINIMAX_MODEL || "MiniMax-M3";
const FAST_MODEL = process.env.MINIMAX_FAST_MODEL || "MiniMax-M2.5-highspeed";
const API_KEY = process.env.MINIMAX_API_KEY;
const SESSIONS_DIR = path.join(__dirname, "sessions");

// Demo mode = rate limiting is active. Detected per-request: localhost = unrestricted dev mode;
// any other host (Railway, real domain, tunnel) = demo mode.
const isDemo = (req) =>
  req && req.get("host") &&
  !req.get("host").includes("localhost") &&
  !req.get("host").includes("127.0.0.1");

// --- Boot checks -----------------------------------------------------------

if (!API_KEY) {
  console.error(
    "\n[english-basics] MINIMAX_API_KEY is not set.\n" +
      "Copy .env.example to .env and add your key, or export it in your shell:\n" +
      "  export MINIMAX_API_KEY=your_key_here\n",
  );
  process.exit(1);
}

// Create the sessions folder if it doesn't exist.
fs.mkdirSync(SESSIONS_DIR, { recursive: true });

// Create a starter .env from .env.example if the user hasn't done it yet.
const ENV_PATH = path.join(__dirname, ".env");
const ENV_EXAMPLE_PATH = path.join(__dirname, ".env.example");
if (!fs.existsSync(ENV_PATH) && fs.existsSync(ENV_EXAMPLE_PATH)) {
  fs.copyFileSync(ENV_EXAMPLE_PATH, ENV_PATH);
  console.log(
    "[english-basics] Created .env from .env.example — open it and paste your MINIMAX_API_KEY, then restart.\n",
  );
}

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: BASE_URL,
});

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

// --- Prompts ---------------------------------------------------------------

// Patient tutor persona for free-write checks.
const FREEWRITE_SYSTEM = `You are a patient, encouraging English tutor working one-on-one with a Spanish native speaker (you can assume Argentinian Spanish background: voseo, lunfardo influence, typical "actualmente ≠ actually" mix-ups). The learner is at an intermediate level and is actively trying to fix the most common patterns that trip Spanish speakers up in English: article misuse (a/an/the/zero), preposition carry-overs (arrive to, depend of, interested on), verb tense mistakes (present perfect vs simple past), word order quirks, and false friends (currently vs actually, realize vs carry out, embarrassed vs pregnant, parents vs relatives, library vs bookshop).

The learner just wrote a sentence in English in response to a specific task. Your job:

1. Read the learner's sentence and the task prompt.
2. Identify EVERY mistake in the sentence. There may be 0, 1, or several. Be specific — quote the exact word or phrase that's wrong.
3. For each mistake, briefly explain WHY it's wrong in simple terms. Connect to Spanish where it helps the learner remember (e.g. "In Spanish you say 'actualmente', but that maps to 'currently' — 'actually' means 'en realidad'"). Don't lecture — one or two sentences per mistake is enough.
4. Provide a single polished, natural version of the sentence. The polished version should be the most natural way a fluent English speaker would say it.
5. If the sentence is genuinely perfect, say so warmly and explain why it works (so the learner gets positive feedback when they nail it).
6. Keep total length concise — focus on what actually helps the learner. No filler praise.`;

const FREEWRITE_FORMAT = `Respond with ONLY a single JSON object (no prose, no markdown fences) in exactly this shape:
{
  "mistakes": [
    {
      "original": "<the exact wrong phrase from the learner's sentence>",
      "why": "<1-2 sentence explanation, ideally with a Spanish comparison when relevant>",
      "fix": "<the corrected version of that phrase>"
    }
  ],
  "polished": "<the full corrected sentence, written naturally>",
  "praise": "<one short encouraging sentence — what the learner got right>"
}

Notes:
- mistakes[] can be empty if the sentence is correct.
- Be honest — if there ARE mistakes, list them. Don't pad with empty mistakes to be nice.
- polished should be a single natural English sentence (or a couple if the task asks for it).
- praise should acknowledge something specific the learner did well, even when there are mistakes.`;

const REPORT_FORMAT = `Respond with ONLY a single JSON object (no prose, no markdown fences) in exactly this shape:
{
  "overall_rating": "<one of: Strong | Solid | Developing | Needs Work | Struggling>",
  "summary": "<3-5 sentence honest overall assessment in simple language>",
  "strengths": ["<concrete pattern the learner handled well>", "..."],
  "weaknesses": ["<concrete pattern the learner keeps getting wrong>", "..."],
  "areas_to_improve": ["<the single most impactful thing to drill next>", "..."]
}`;

// --- Helpers ---------------------------------------------------------------

// MiniMax-M3 is a reasoning model: it may prefix the answer with a
// <think>...</think> block and/or wrap the JSON in ```json fences. This pulls
// the first valid JSON object out of whatever the model returned.
function extractJson(raw) {
  if (typeof raw !== "string") {
    throw new Error("Model returned no text content.");
  }

  // Drop any reasoning block.
  let text = raw.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  // Strip a single surrounding markdown code fence if present.
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fence) {
    text = fence[1].trim();
  }

  // Fast path: the whole thing is JSON.
  try {
    return JSON.parse(text);
  } catch {
    // Fall through to brace-scanning.
  }

  // Slow path: find the first balanced {...} object in the text.
  const start = text.indexOf("{");
  if (start !== -1) {
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
      } else if (ch === '"') {
        inStr = true;
      } else if (ch === "{") {
        depth++;
      } else if (ch === "}") {
        depth--;
        if (depth === 0) {
          return JSON.parse(text.slice(start, i + 1));
        }
      }
    }
  }

  throw new Error("Could not parse JSON from model response.");
}

function messageContent(completion) {
  const choice = completion.choices && completion.choices[0];
  return choice && choice.message ? choice.message.content : "";
}

function safeSessionPath(id) {
  // Only allow our own generated ids: digits + lowercase letters + dashes.
  if (!/^[a-z0-9-]+$/.test(id)) return null;
  return path.join(SESSIONS_DIR, `${id}.json`);
}

function getQuestionsByCategory(category, type) {
  return QUESTIONS.filter(
    (q) =>
      q.category === category && (type ? q.type === type : true),
  );
}

function pickRandomQuestion(category, type) {
  const pool = getQuestionsByCategory(category, type);
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function countByCategory() {
  const counts = {};
  CATEGORIES.forEach((c) => (counts[c] = 0));
  QUESTIONS.forEach((q) => {
    if (counts[q.category] != null) counts[q.category]++;
  });
  return counts;
}

// --- API: categories -------------------------------------------------------

app.get("/api/categories", (req, res) => {
  const counts = countByCategory();
  res.json({
    categories: CATEGORIES.map((name) => ({
      name,
      count: counts[name],
    })),
  });
});

// --- API: next question ----------------------------------------------------

app.post("/api/question", (req, res) => {
  const { category, type } = req.body || {};
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Unknown category." });
  }
  if (type && !["multiple-choice", "free-write"].includes(type)) {
    return res
      .status(400)
      .json({ error: "Type must be 'multiple-choice' or 'free-write'." });
  }

  // Try to honor the requested type. If that type has no questions for the
  // category, fall back to the other type so the session never dead-ends.
  let q = pickRandomQuestion(category, type);
  if (!q && type) q = pickRandomQuestion(category, undefined);
  if (!q) {
    return res
      .status(404)
      .json({ error: "No questions available for this category." });
  }

  // For MC questions, return the correct answer (server-side) plus the
  // explanation so the client can verify locally. The client never sees the
  // correct index until after the user answers, but it is bundled with the
  // question payload — this app is local practice, not a graded test, so
  // bundling keeps latency low and lets us answer instantly without a second
  // round-trip to the AI for grading.
  if (q.type === "multiple-choice") {
    return res.json({
      id: q.id,
      category: q.category,
      type: q.type,
      prompt: q.prompt,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation,
    });
  }

  // Free-write: send the prompt and the model answer (for the client to
  // show as a reference after the AI grades the learner's attempt).
  res.json({
    id: q.id,
    category: q.category,
    type: q.type,
    prompt: q.prompt,
    options: [],
    correct: null,
    explanation: q.explanation,
  });
});

// --- API: check MC answer (server-side verification) -----------------------
//
// This is fast and offline: the question payload already carries the correct
// index and explanation, so the server can just echo them back. We still keep
// the endpoint to make the client simple (it just posts to /api/check-mc
// whether or not a given question is in the bank, and the server is the
// source of truth for the answer).
app.post("/api/check-mc", (req, res) => {
  const { questionId, answer } = req.body || {};
  if (!questionId || typeof questionId !== "string") {
    return res.status(400).json({ error: "Missing questionId." });
  }
  const idx = parseInt(answer, 10);
  if (Number.isNaN(idx) || idx < 0 || idx > 3) {
    return res.status(400).json({ error: "Answer must be an index 0-3." });
  }

  const q = QUESTIONS.find((qq) => qq.id === questionId);
  if (!q || q.type !== "multiple-choice") {
    return res.status(404).json({ error: "Question not found." });
  }

  const correct = idx === q.correct;
  res.json({
    correct,
    correctIndex: q.correct,
    correctOption: q.options[q.correct],
    explanation: q.explanation,
  });
});

// --- Rate limiter ----------------------------------------------------------
//
// In-memory per-IP rate limit, no external dependencies. Applied to the two
// AI-calling endpoints (/api/check-free and /api/report) so a runaway client
// or a bored script-kiddie can't burn through API credits. Keeps a rolling
// 60s window of timestamps per IP; rejects with 429 when the window is full.

const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 5;
const rateBuckets = new Map();

function getClientIp(req) {
  return (
    req.ip ||
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    (req.connection && req.connection.remoteAddress) ||
    "unknown"
  );
}

function rateLimit(req, res, next) {
  if (!isDemo(req)) return next();
  const ip = getClientIp(req);
  const now = Date.now();
  const recent = (rateBuckets.get(ip) || []).filter(
    (t) => now - t < RATE_WINDOW_MS,
  );

  if (recent.length >= RATE_MAX) {
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - recent[0])) / 1000);
    res.set("Retry-After", String(Math.max(retryAfter, 1)));
    return res.status(429).json({
      error:
        "Whoa, easy on the gas! You're sending requests too quickly. " +
        "Please wait a moment and try again.",
    });
  }

  recent.push(now);
  rateBuckets.set(ip, recent);
  next();
}

// --- API: check free-write (AI tutor) --------------------------------------

app.post("/api/check-free", rateLimit, async (req, res) => {
  const { sentence, prompt, category } = req.body || {};
  const text = (sentence || "").toString().trim();
  const task = (prompt || "").toString().trim();
  const cat = (category || "").toString().trim();

  if (!text) {
    return res.status(400).json({ error: "Please write a sentence first." });
  }
  if (text.length > 800) {
    return res
      .status(400)
      .json({ error: "Sentence is too long. Keep it under 800 characters." });
  }

  const userPrompt = `CATEGORY: ${cat || "General"}
TASK PROMPT GIVEN TO THE LEARNER:
${task || "(no task prompt — free write)"}

LEARNER'S SENTENCE:
${text}

Identify any mistakes in the learner's sentence, explain them in plain language (Spanish comparisons are welcome when they help the learner remember), and provide a polished version. If the sentence is correct, say so. Respond in the JSON shape specified.`;

  try {
    const completion = await client.chat.completions.create({
      model: FAST_MODEL,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: FREEWRITE_SYSTEM },
        { role: "user", content: userPrompt },
      ],
    });

    const parsed = extractJson(messageContent(completion));

    // Normalize shape. mistakes may be absent or empty; polished may be a
    // string; praise may be a string.
    const mistakes = Array.isArray(parsed.mistakes)
      ? parsed.mistakes
          .map((m) => ({
            original: (m && m.original) || "",
            why: (m && m.why) || "",
            fix: (m && m.fix) || "",
          }))
          .filter((m) => m.original || m.why || m.fix)
      : [];

    return res.json({
      mistakes,
      polished: (parsed.polished || "").toString().trim(),
      praise: (parsed.praise || "").toString().trim(),
    });
  } catch (err) {
    console.error("[check-free] error:", err.message || err);
    res.status(502).json({
      error: "Free-write check failed. Check the server logs and your API key.",
    });
  }
});

// --- API: final session report ---------------------------------------------

app.post("/api/report", rateLimit, async (req, res) => {
  const { sessionId, category, items } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No answered items to report on." });
  }

  const scores = items
    .map((it) => Number(it.score))
    .filter((s) => !Number.isNaN(s));
  const avg = scores.length
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
    : "0";

  // For free-write items, the AI's feedback is in `aiFeedback`; for MC, the
  // explanation. We pass a compact transcript so the report model sees what
  // happened.
  const transcript = items
    .map((it, i) => {
      return `--- Q${i + 1} (${it.type || "mc"}, score: ${it.score}/5) ---
TASK: ${it.prompt || ""}
ANSWER: ${it.answer && it.answer.trim() ? it.answer : "(no answer)"}
${
  it.type === "free-write"
    ? `AI FEEDBACK: ${it.aiFeedback || ""}\nPOLISHED: ${it.polished || ""}`
    : `EXPLANATION: ${it.explanation || ""}`
}`;
    })
    .join("\n\n");

  const userPrompt = `You are writing the final report for a Spanish native speaker's English practice session. They are at an intermediate level, practicing grammar fundamentals (articles, prepositions, verb tenses, word order, common false friends, idioms).

Category focus: ${category || "Mixed"}
Questions answered: ${items.length}
Average score: ${avg} / 5

TRANSCRIPT (each item has the task, the learner's answer, and what the tutor said):
${transcript}

Write a short, encouraging but honest report. Identify concrete patterns the learner is getting right, specific patterns they keep missing, and the single most impactful thing they should drill next. Keep the summary to 3-5 sentences. Avoid jargon — write for a learner, not a linguist.

${REPORT_FORMAT}`;

  try {
    const completion = await client.chat.completions.create({
      model: MODEL,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "user", content: userPrompt },
      ],
    });

    const report = extractJson(messageContent(completion));

    const record = {
      sessionId: sessionId || Date.now().toString(36),
      category: category || "Mixed",
      createdAt: new Date().toISOString(),
      averageScore: Number(avg),
      questionCount: items.length,
      items,
      report,
    };

    // Persist the session as JSON.
    const filePath = safeSessionPath(record.sessionId);
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
    }

    res.json(record);
  } catch (err) {
    console.error("[report] error:", err.message || err);
    res
      .status(502)
      .json({ error: "Report generation failed. Check the server logs and your API key." });
  }
});

// --- API: save session (manual save from the client) -----------------------

app.post("/api/save", (req, res) => {
  const { session } = req.body || {};
  if (!session || typeof session !== "object") {
    return res.status(400).json({ error: "Missing session payload." });
  }
  if (!Array.isArray(session.questions)) {
    return res.status(400).json({ error: "Session must have a questions[]." });
  }
  if (typeof session.score !== "number") {
    return res.status(400).json({ error: "Session must have a numeric score." });
  }

  const id =
    session.id ||
    Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);

  const record = {
    sessionId: id,
    category: session.category || "Mixed",
    createdAt: session.date || new Date().toISOString(),
    averageScore: session.score,
    questionCount: session.questions.length,
    items: session.questions,
  };

  const filePath = safeSessionPath(id);
  if (!filePath) {
    return res.status(400).json({ error: "Invalid session id." });
  }

  try {
    fs.writeFileSync(filePath, JSON.stringify(record, null, 2), "utf8");
    res.json({ ok: true, sessionId: id });
  } catch (err) {
    console.error("[save] error:", err.message || err);
    res.status(500).json({ error: "Could not save session." });
  }
});

// --- API: session history --------------------------------------------------

app.get("/api/history", (req, res) => {
  try {
    const files = fs
      .readdirSync(SESSIONS_DIR)
      .filter((f) => f.endsWith(".json"));

    const list = files
      .map((f) => {
        try {
          const data = JSON.parse(
            fs.readFileSync(path.join(SESSIONS_DIR, f), "utf8"),
          );
          return {
            sessionId: data.sessionId,
            category: data.category,
            createdAt: data.createdAt,
            averageScore: data.averageScore,
            questionCount: data.questionCount,
            overallRating: data.report ? data.report.overall_rating : null,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    res.json({ sessions: list });
  } catch (err) {
    console.error("[history] error:", err.message || err);
    res.status(500).json({ error: "Could not read session history." });
  }
});

app.get("/api/sessions/:id", (req, res) => {
  const filePath = safeSessionPath(req.params.id);
  if (!filePath || !fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Session not found." });
  }
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("[session] error:", err.message || err);
    res.status(500).json({ error: "Could not read session." });
  }
});

// --- Start -----------------------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `\n[english-basics] running at http://localhost:${PORT}\n` +
      `  model report: ${MODEL} / model check: ${FAST_MODEL}\n  base:  ${BASE_URL}\n  sessions: ${SESSIONS_DIR}\n`,
  );
});
