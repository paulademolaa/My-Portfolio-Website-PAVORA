// ---------------------------------------------------------------
// PAVORA Assistant — the "brain".
// Works fully in the browser (no AI bill). It:
//   • cleans up the message (lower-case, plurals, typos, synonyms)
//   • scores every topic in src/data/assistant.js and picks the best
//   • suggests related questions when it isn't sure
//   • runs the step-by-step "Start a project" brief
//
// To plug in a real AI later, replace `reply()` with a call to your
// own /api/chat function — the chat window doesn't need to change.
// ---------------------------------------------------------------

import { topics, SYNONYMS, fallback, welcome, leadOptions } from "../data/assistant.js";

const STOP_WORDS = new Set(
  "a an the is are am was were be to of for in on at and or my me i we our your it its this that these those do does did can could would should will with from as by about any some so if then than there their them they what which how why when who whom whose please just also really very get got have has had need want like know tell".split(
    " ",
  ),
);

// Keep these even though they are short/common — they carry meaning
const KEEP = new Set(["how", "who", "what", "much", "long", "do", "you", "need", "want", "get"]);

export function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[’‘`]/g, "'")
    .replace(/ui\s*\/\s*ux/g, "uiux")
    .replace(/[^a-z0-9'$+\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stem(word) {
  if (word.length > 5 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 4 && word.endsWith("es") && !word.endsWith("ses")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

// Small edit-distance check for typos ("desgin" → "design")
function distance(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 3;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
  return dp[a.length][b.length];
}

// Every word the assistant knows, so typos can be corrected to one of them
const VOCAB = new Set([
  ...Object.keys(SYNONYMS),
  ...Object.values(SYNONYMS),
  ...topics.flatMap((t) => Object.keys(t.keywords || {})),
]);

function correct(word) {
  // Only fix longer words, and only to a known word starting with the same letter
  if (VOCAB.has(word) || word.length < 5) return word;
  let best = word;
  let bestD = word.length >= 8 ? 2 : 1;
  for (const v of VOCAB) {
    if (v.length < 4 || v[0] !== word[0]) continue;
    const d = distance(word, v);
    if (d <= bestD && (d < bestD || best === word)) {
      best = v;
      bestD = d;
    }
  }
  return best;
}

// Turns a message into meaningful, canonical words
export function tokens(text) {
  const out = [];
  for (let raw of normalize(text).split(" ")) {
    if (!raw) continue;
    raw = raw.replace(/'s$/, "").replace(/'/g, "");
    if (STOP_WORDS.has(raw) && !KEEP.has(raw)) continue;
    let w = correct(raw);
    if (!SYNONYMS[w] && !VOCAB.has(w)) w = correct(stem(raw));
    out.push(SYNONYMS[w] || w);
  }
  return out;
}

function scoreTopic(topic, toks, text) {
  let score = 0;
  for (const [word, weight] of Object.entries(topic.keywords || {})) {
    const canonical = SYNONYMS[word] || word;
    if (toks.includes(canonical) || toks.includes(word)) score += weight;
  }
  for (const phrase of topic.phrases || []) {
    if (text.includes(normalize(phrase))) score += 4;
  }
  return score;
}

// Character-trigram similarity, used to rank related questions
function trigrams(s) {
  const t = new Set();
  const x = `  ${normalize(s)} `;
  for (let i = 0; i < x.length - 2; i++) t.add(x.slice(i, i + 3));
  return t;
}
function similarity(a, b) {
  const A = trigrams(a);
  const B = trigrams(b);
  let common = 0;
  for (const g of A) if (B.has(g)) common++;
  return common / Math.max(1, Math.min(A.size, B.size));
}

// The closest questions the assistant CAN answer
export function relatedQuestions(message, exclude = [], limit = 3) {
  const toks = tokens(message);
  const text = normalize(message);
  return topics
    .filter((t) => t.ask && !exclude.includes(t.id))
    .map((t) => ({
      ask: t.ask,
      score: scoreTopic(t, toks, text) + similarity(message, t.ask) * 3,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .filter((r) => r.score > 0.6)
    .map((r) => r.ask);
}

/* ---------------- "Start a project" brief ---------------- */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LEAD_STEPS = {
  name: {
    ask: "Great — let's get your project to Paul. 🙌 First, **what's your name?**",
    chips: [],
  },
  email: { ask: (d) => `Nice to meet you, ${d.name}! **What's the best email** for Paul to reply to?`, chips: [] },
  service: { ask: "**What do you need help with?**", chips: leadOptions.services },
  timeline: { ask: "**When would you like to start?**", chips: leadOptions.timelines },
  budget: {
    ask: "**Do you have a budget range in mind?** This just helps Paul tailor his proposal — he'll send you an exact quote.",
    chips: leadOptions.budgets,
  },
  details: {
    ask: "Last one: **tell me about the project** — your goals, who it's for and any links (current website, inspiration).",
    chips: [],
  },
};
const ORDER = ["name", "email", "service", "timeline", "budget", "details"];

function leadPrompt(step, data) {
  const s = LEAD_STEPS[step];
  return { answer: [{ text: typeof s.ask === "function" ? s.ask(data) : s.ask }], chips: s.chips };
}

function leadSummary(d) {
  return {
    answer: [
      { text: "Here's your brief — does it look right?" },
      {
        list: [
          `**Name:** ${d.name}`,
          `**Email:** ${d.email}`,
          `**Service:** ${d.service}`,
          `**Start:** ${d.timeline}`,
          `**Budget:** ${d.budget}`,
          `**Project:** ${d.details}`,
        ],
      },
    ],
    chips: ["Send it to Paul", "Start over", "Cancel"],
  };
}

function handleLead(message, state) {
  const lead = state.lead;
  const text = message.trim();
  const low = normalize(text);

  if (/^(cancel|stop|quit|exit|never ?mind)$/.test(low)) {
    return {
      messages: [{ answer: [{ text: "No problem — brief cancelled. Anything else I can help with?" }], chips: fallback.chips }],
      state: { ...state, lead: null },
    };
  }

  if (lead.step === "confirm") {
    if (/start over|restart|edit|change/.test(low)) {
      return { messages: [leadPrompt("name", {})], state: { ...state, lead: { step: "name", data: {} } } };
    }
    if (/send|yes|yep|correct|looks good|confirm|submit|ok/.test(low)) {
      return { messages: [], state: { ...state, lead: { ...lead, step: "sending" } }, submit: lead.data };
    }
    return { messages: [{ answer: [{ text: "Shall I send it?" }], chips: ["Send it to Paul", "Start over", "Cancel"] }], state };
  }

  const data = { ...lead.data };
  if (lead.step === "name") {
    if (text.length < 2) return { messages: [leadPrompt("name", data)], state };
    data.name = text.replace(/^(my name is|i am|i'm|im|it's|its)\s+/i, "").slice(0, 80);
  } else if (lead.step === "email") {
    const found = text.match(/[^\s@]+@[^\s@]+\.[^\s@]{2,}/);
    if (!found || !EMAIL.test(found[0])) {
      return {
        messages: [{ answer: [{ text: "Hmm, that doesn't look like an email address. Could you check it? (e.g. **name@company.com**)" }], chips: [] }],
        state,
      };
    }
    data.email = found[0].replace(/[.,]$/, "");
  } else {
    if (lead.step === "details" && text.length < 10) {
      return {
        messages: [{ answer: [{ text: "Could you add a little more detail? Even two sentences about your goals helps Paul a lot." }], chips: [] }],
        state,
      };
    }
    data[lead.step] = text.slice(0, lead.step === "details" ? 2000 : 120);
  }

  const next = ORDER[ORDER.indexOf(lead.step) + 1];
  if (!next) {
    return { messages: [leadSummary(data)], state: { ...state, lead: { step: "confirm", data } } };
  }
  return { messages: [leadPrompt(next, data)], state: { ...state, lead: { step: next, data } } };
}

export function startLead(state) {
  return { messages: [leadPrompt("name", {})], state: { ...state, lead: { step: "name", data: {} }, lastTopic: "lead" } };
}

/* ---------------- Main entry ---------------- */

export function initialState() {
  return { lead: null, lastTopic: null };
}

export function welcomeMessage() {
  return welcome;
}

// Returns { messages: [{answer, chips}], state, submit? }
export function reply(message, state) {
  if (state.lead && state.lead.step !== "sending") return handleLead(message, state);

  const text = normalize(message);
  const toks = tokens(message);

  const scored = topics
    .map((t) => ({ t, score: scoreTopic(t, toks, text) }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];

  // Not confident → suggest the closest questions it can answer
  if (!best || best.score < 2) {
    const related = relatedQuestions(message);
    if (related.length) {
      return {
        messages: [
          {
            answer: [
              { text: "I don't have an exact answer for that yet, but these might help — or ask Paul directly:" },
              { actions: ["startProject"] },
            ],
            chips: related,
            suggest: true,
          },
        ],
        state,
      };
    }
    return { messages: [fallback], state };
  }

  if (best.t.id === "lead") return startLead(state);

  // Add related follow-ups the topic doesn't already list
  const chips = [...(best.t.chips || [])];
  if (best.score < 4) {
    for (const q of relatedQuestions(message, [best.t.id], 2)) if (!chips.includes(q)) chips.push(q);
  }

  return {
    messages: [{ answer: best.t.answer, chips: chips.slice(0, 4) }],
    state: { ...state, lastTopic: best.t.id },
  };
}
