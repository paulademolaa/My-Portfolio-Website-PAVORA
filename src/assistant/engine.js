// ---------------------------------------------------------------
// PAVORA Assistant — the "brain".
// Works fully in the browser (no AI bill). It:
//   • cleans up the message (lower-case, plurals, typos, synonyms)
//   • scores every topic in src/data/assistant.js and picks the best
//   • suggests related questions when it isn't sure
//   • runs the step-by-step "Start a project" brief, or offers a
//     Calendly call when the visitor would rather talk it through
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
// The visitor chooses: explain the project here in the chat, or book a
// call with Paul (Calendly). They can switch to a call at any point
// while describing the project.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CALL_CHIP = "I'd rather explain on a call";
const WANTS_CALL = /(book|schedule|call|consult|meeting|talk (to|with) paul|google meet|calendly)/;

// "I've said it already", "check our chat", "as I said earlier"…
const RECALL = /(already|earlier|before|above|i (have |ve |had )?(said|told|given|gave|dropped|sent|typed|shared|mentioned)|i told you|as i said|check (our|the|my|this) chat|scroll up)/;
// "what are you saying", "I don't understand"…
const CONFUSED = /^(what|huh|eh|sorry|pardon)\??$|what (are|r) (you|u) (saying|talking|asking)|what do you mean|(don ?t|dont|do not) (understand|get it)|i m confused|confusing/;
const FIND_EMAIL = /[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}/i;

// Pulls a clean name out of replies like "David, I have said it earlier"
export function cleanName(text) {
  let t = text
    .replace(FIND_EMAIL, " ")
    .replace(/^(hi|hello|hey)[,!.\s]+/i, "")
    .replace(/^(my name is|my name's|name is|name:|i am|i'm|im|it's|its|this is|call me)\s+/i, "");
  // stop at the first word that isn't part of a name
  t = t.split(/[,.!?;:(]|\s(?:and|but|i|i've|i'm|im|have|said|already|earlier|from|here|please|again|by|the|as)\b/i)[0];
  const words = t.trim().split(/\s+/).filter((w) => /^[\p{L}'-]+$/u.test(w)).slice(0, 3);
  const name = words.join(" ");
  if (name.length < 2) return "";
  return name.replace(/\b\p{Ll}/gu, (c) => c.toUpperCase());
}

const STEP_LABEL = {
  name: "your name",
  email: "your email",
  service: "the service you need",
  timeline: "when you'd like to start",
  budget: "your budget range",
  about: "what the project is",
  goals: "your goals",
  audience: "who it's for",
  inspiration: "any inspiration",
};

// The first question we don't have an answer to yet
function nextMissing(data) {
  return ORDER.find((k) =>
    k === "inspiration" ? !data.inspirationDone : data[k] == null || data[k] === "",
  );
}

const LEAD_STEPS = {
  choose: {
    ask: "Great, let's get your project to Paul. 🙌 **How would you like to tell him about it?**",
    chips: ["Explain it here in the chat", "Book a call with Paul"],
  },
  name: { ask: "Perfect. First, **what's your name?**", chips: [] },
  email: { ask: (d) => `Nice to meet you, ${d.name}! **What's the best email** for Paul to reply to?`, chips: [] },
  service: { ask: "**What do you need help with?**", chips: leadOptions.services },
  timeline: { ask: "**When would you like to start?**", chips: leadOptions.timelines },
  budget: {
    ask: "**Do you have a budget range in mind?** This just helps Paul tailor his proposal. He'll send you an exact quote.",
    chips: leadOptions.budgets,
  },
  about: {
    ask: "Now the fun part. **Tell me about your project in full detail:** your business or idea, what you need designed or built (pages, features, materials), what you already have (logo, colours, content, current website) and anything else Paul should know. The more detail, the better.",
    chips: [CALL_CHIP],
  },
  goals: {
    ask: "**What are your goals?** What should this project help you achieve?",
    chips: [CALL_CHIP],
  },
  audience: {
    ask: "**Who is it for?** Describe the people you want to reach.",
    chips: [CALL_CHIP],
  },
  inspiration: {
    ask: "Last one: **any inspiration?** Paste links to websites, brands or designs you like, and/or **attach files** (PDF, PNG, JPEG or any file) with the 📎 button below. Add as many as you like, then tap **Done**. You can also skip this.",
    chips: ["Done", "Skip", CALL_CHIP],
  },
};
const ORDER = ["name", "email", "service", "timeline", "budget", "about", "goals", "audience", "inspiration"];
const PROJECT_STEPS = ["about", "goals", "audience", "inspiration"];

function leadPrompt(step, data) {
  const s = LEAD_STEPS[step];
  return { answer: [{ text: typeof s.ask === "function" ? s.ask(data) : s.ask }], chips: s.chips };
}

// What Paul receives as "Project details"
export function projectDetails(d) {
  return [
    `Project details: ${d.about}`,
    `Goals: ${d.goals}`,
    `Who it's for: ${d.audience}`,
    `Inspiration links/notes: ${d.inspiration || "—"}`,
    `Attached files: ${fileList(d) || "—"}`,
  ].join("\n\n");
}

const fileList = (d) => (d.files || []).map((f) => f.name).join(", ");

function leadSummary(d) {
  return {
    answer: [
      { text: "Here's your brief. Does it look right?" },
      {
        list: [
          `**Name:** ${d.name}`,
          `**Email:** ${d.email}`,
          `**Service:** ${d.service}`,
          `**Start:** ${d.timeline}`,
          `**Budget:** ${d.budget}`,
          `**Project:** ${d.about}`,
          `**Goals:** ${d.goals}`,
          `**Who it's for:** ${d.audience}`,
          `**Inspiration:** ${d.inspiration || "—"}`,
          `**Files:** ${fileList(d) || "—"}`,
        ],
      },
    ],
    chips: ["Send it to Paul", "Book a call instead", "Start over", "Cancel"],
  };
}

// The "Book a call" answer, with the visitor's name/email filled in if known
export function bookingMessage(data = {}, intro) {
  return {
    answer: [
      {
        text:
          intro ||
          "No problem, sometimes it's easier to talk it through. **Book a 30-minute call with Paul** on Google Meet and he'll go through your project, goals, audience and inspiration with you.",
      },
      { actions: ["bookCall"], prefill: { name: data.name, email: data.email } },
    ],
    chips: ["Explain it here instead", "What services do you offer?"],
  };
}

function handleLead(message, state) {
  const lead = state.lead;
  const text = message.trim();
  const low = normalize(text);

  if (/^(cancel|stop|quit|exit|never ?mind)$/.test(low)) {
    return {
      messages: [{ answer: [{ text: "No problem, brief cancelled. Anything else I can help with?" }], chips: fallback.chips }],
      state: { ...state, lead: null },
    };
  }

  // Switch to a call: from the first choice, while describing the project, or at the summary
  // (any question; "call me David" on the name question is a name, not a booking)
  const canSwitch = !(lead.step === "name" && /^(call me|they call me)\b/.test(low)) && !FIND_EMAIL.test(text);
  if (canSwitch && WANTS_CALL.test(low) && !/explain it here/.test(low)) {
    return { messages: [bookingMessage(lead.data)], state: { ...state, memory: { ...lead.data }, lead: null, lastTopic: "call" } };
  }

  if (lead.step === "choose") {
    if (/here|chat|type|write|explain|continue|carry on/.test(low)) return resumeBrief(state);
    return { messages: [leadPrompt("choose", {})], state };
  }

  if (lead.step === "confirm") {
    if (/start over|restart|edit|change/.test(low)) {
      return { messages: [leadPrompt("name", {})], state: { ...state, memory: {}, lead: { step: "name", data: {} } } };
    }
    if (/send|yes|yep|correct|looks good|confirm|submit|ok/.test(low)) {
      const brief = { ...lead.data, details: projectDetails(lead.data) };
      return { messages: [], state: { ...state, lead: { ...lead, step: "sending" } }, submit: brief };
    }
    return {
      messages: [{ answer: [{ text: "Shall I send it?" }], chips: ["Send it to Paul", "Book a call instead", "Start over", "Cancel"] }],
      state,
    };
  }

  const data = { ...(state.memory || {}), ...lead.data };
  const ask = (t, chips = []) => ({ messages: [{ answer: [{ text: t }], chips }], state: { ...state, lead: { ...lead, data } } });

  // An email anywhere in the reply is remembered, whichever question we're on
  const emailInText = text.match(FIND_EMAIL)?.[0].replace(/[.,]$/, "");
  if (emailInText && EMAIL.test(emailInText) && lead.step !== "email") data.email = data.email || emailInText;

  // "What are you saying?" — explain the question again instead of treating it as an answer
  if (CONFUSED.test(low) && !emailInText) {
    const plain = {
      name: "Sorry, that wasn't clear! I just need **your name** so Paul knows who he's talking to.",
      email: "Sorry for the confusion! I just need **the email address Paul should reply to**, e.g. name@company.com.",
    }[lead.step];
    const p = leadPrompt(lead.step, data);
    return { messages: [plain ? { answer: [{ text: plain }], chips: [] } : { ...p, answer: [{ text: "Sorry, let me ask that more simply." }, ...p.answer] }], state };
  }

  // "I've said it already" on a later question: they mean details we already have
  if (!["name", "email"].includes(lead.step) && RECALL.test(low) && text.length < 90 && !emailInText) {
    const have = [data.name && `your name (**${data.name}**)`, data.email && `your email (**${data.email}**)`].filter(Boolean);
    const p = leadPrompt(lead.step, data);
    return {
      messages: [
        {
          ...p,
          answer: [
            { text: have.length ? `You're right, I already have ${have.join(" and ")}, so no need to type them again. Just this one:` : "Thanks! Just this one:" },
            ...p.answer,
          ],
        },
      ],
      state: { ...state, lead: { ...lead, data } },
    };
  }

  if (lead.step === "name") {
    const name = cleanName(text);
    if (!name) {
      if (RECALL.test(low) && data.name) {
        // fall through with the remembered name
      } else if (RECALL.test(low)) {
        return ask("Sorry, I couldn't find your name in our chat. Could you type it once more?");
      } else {
        return { messages: [leadPrompt("name", data)], state };
      }
    } else {
      data.name = name.slice(0, 80);
    }
  } else if (lead.step === "email") {
    if (emailInText && EMAIL.test(emailInText)) {
      data.email = emailInText;
    } else if (RECALL.test(low) && data.email) {
      // they already gave it: use the one we have
    } else if (RECALL.test(low)) {
      return ask("Sorry, I can't find an email in our chat. Could you type it once more? (e.g. **name@company.com**)");
    } else {
      return ask("Hmm, that doesn't look like an email address. Could you check it? (e.g. **name@company.com**)");
    }
  } else if (lead.step === "inspiration") {
    const finished = /^(done|that s all|thats all|that s it|finished|no more|continue|next)$/.test(low);
    const skip = /^(skip|none|no|nope|nothing|n\/a|na)$/.test(low);
    if (skip) {
      data.inspiration = data.inspiration || "";
    } else if (finished) {
      data.inspiration = data.inspiration || "";
    } else {
      // keep collecting links/notes until they tap Done
      data.inspiration = [data.inspiration, text.slice(0, 1000)].filter(Boolean).join("\n");
      return {
        messages: [{ answer: [{ text: "Got it, added. ✅ Add more links or attach files with 📎, or tap **Done** when you're ready." }], chips: ["Done", CALL_CHIP] }],
        state: { ...state, memory: { ...data }, lead: { step: "inspiration", data, collecting: true } },
      };
    }
  } else if (PROJECT_STEPS.includes(lead.step)) {
    if (lead.step === "about" && text.length < 25) {
      return {
        messages: [
          {
            answer: [{ text: "Could you share **a bit more detail**? For example: what your business does, what you need (logo, website, app, flyers, deck), the pages or features, and what you already have. Or book a call if it's easier to explain out loud." }],
            chips: [CALL_CHIP],
          },
        ],
        state,
      };
    }
    if (text.length < 4) {
      return {
        messages: [
          {
            answer: [{ text: "Could you add a little more? A sentence or two helps Paul a lot. Or book a call if it's easier to explain out loud." }],
            chips: [CALL_CHIP],
          },
        ],
        state,
      };
    }
    data[lead.step] = text.slice(0, 1000);
  } else {
    data[lead.step] = text.slice(0, 120);
  }

  if (lead.step === "inspiration") data.inspirationDone = true;

  // Next question we don't already have an answer to
  const memory = { ...data };
  const next = nextMissing(data);
  if (!next) {
    return { messages: [leadSummary(data)], state: { ...state, memory, lead: { step: "confirm", data } } };
  }
  const prompt = leadPrompt(next, data);
  if (lead.step === "name" && data.email && next !== "email") {
    prompt.answer = [{ text: `Nice to meet you, ${data.name}! I've already got your email as **${data.email}**.` }, ...prompt.answer];
  }
  return { messages: [prompt], state: { ...state, memory, lead: { step: next, data } } };
}

// Carry on from whatever the visitor has already told us (name, email, answers…)
function resumeBrief(state) {
  const data = { ...(state.memory || {}) };
  const step = nextMissing(data);
  const known = ORDER.filter((k) => k !== "inspiration" && data[k]);
  if (!step) {
    return { messages: [leadSummary(data)], state: { ...state, lead: { step: "confirm", data }, lastTopic: "lead" } };
  }
  const messages = [];
  if (known.length) {
    const who = data.name ? `, ${data.name.split(" ")[0]}` : "";
    const have = [data.email && `your email (**${data.email}**)`, known.length > 2 && "your answers so far"].filter(Boolean);
    messages.push({
      answer: [
        {
          text: `Welcome back${who}! I've kept ${have.length ? have.join(" and ") : "what you told me"}, so we'll carry on from where you left off: ${STEP_LABEL[step]}.`,
        },
      ],
    });
  }
  const prompt = leadPrompt(step, data);
  messages.push(prompt);
  return { messages, state: { ...state, lead: { step, data }, lastTopic: "lead" } };
}

// Files attached with the 📎 button. `files` = [{ name, size }] (the file data
// itself stays in the browser until the brief is sent). `rejected` = names
// that were too big or over the limit.
export function attachFiles(state, files, rejected = []) {
  const lead = state.lead;
  if (!lead) return { messages: [], state };
  const data = { ...(state.memory || {}), ...lead.data };
  data.files = [...(data.files || []), ...files];
  const texts = [];
  if (files.length) {
    texts.push(`📎 Got it: **${files.map((f) => f.name).join(", ")}** will be sent to Paul with your brief.`);
  }
  if (rejected.length) {
    texts.push(
      `Sorry, I couldn't attach **${rejected.join(", ")}**. Files can be up to 3 MB in total (5 files max). For bigger files, share a **Google Drive or Dropbox link** here instead.`,
    );
  }
  const onInspiration = lead.step === "inspiration";
  texts.push(onInspiration ? "Add more files or links, or tap **Done** when you're ready." : "Now, back to the question above. 👆");
  return {
    messages: [{ answer: texts.map((text) => ({ text })), chips: onInspiration ? ["Done", CALL_CHIP] : LEAD_STEPS[lead.step]?.chips || [] }],
    state: { ...state, memory: { ...data }, lead: { ...lead, data } },
  };
}

export function removeFiles(data = {}) {
  const { files, ...rest } = data;
  return rest;
}

// "Start a project": first ask how they'd like to share it
export function startLead(state) {
  return { messages: [leadPrompt("choose", {})], state: { ...state, lead: { step: "choose", data: { ...(state.memory || {}) } }, lastTopic: "lead" } };
}

// "Explain it here": skip the choice and go straight to the questions (or resume them)
export function startChatBrief(state) {
  return resumeBrief(state);
}

/* ---------------- Main entry ---------------- */

export function initialState(memory = {}) {
  return { lead: null, lastTopic: null, memory };
}

// Outside the brief, still remember an email or "my name is…" if the visitor shares it
function remember(message, state) {
  const memory = { ...(state.memory || {}) };
  const email = message.match(FIND_EMAIL)?.[0].replace(/[.,]$/, "");
  if (email && EMAIL.test(email)) memory.email = email;
  const named = message.match(/\b(?:my name is|my name's|i am|i'm|call me)\s+(.+)/i);
  if (named && !/\b(looking|interested|a |an |the |not |just |here|from|in |working)/i.test(named[1])) {
    const n = cleanName(named[1]);
    if (n) memory.name = n;
  }
  return { ...state, memory };
}

export function welcomeMessage() {
  return welcome;
}

// Returns { messages: [{answer, chips}], state, submit? }
export function reply(message, state) {
  if (state.lead && state.lead.step !== "sending") return handleLead(message, state);
  state = remember(message, state);

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

  if (best.t.id === "lead") {
    return /explain it here/.test(text) ? startChatBrief(state) : startLead(state);
  }

  // Add related follow-ups the topic doesn't already list
  const chips = [...(best.t.chips || [])];
  if (best.score < 4) {
    for (const q of relatedQuestions(message, [best.t.id], 2)) if (!chips.includes(q)) chips.push(q);
  }

  // "Book a call" buttons get the visitor's name/email filled in when we know them
  const m = state.memory || {};
  const answer = best.t.answer.map((b) =>
    b.actions?.includes("bookCall") ? { ...b, prefill: { name: m.name, email: m.email } } : b,
  );

  return {
    messages: [{ answer, chips: chips.slice(0, 4) }],
    state: { ...state, lastTopic: best.t.id },
  };
}
