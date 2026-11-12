import { useCallback, useEffect, useRef, useState } from "react";
import { attachFiles, initialState, removeFiles, reply, startChatBrief, startLead, welcomeMessage } from "./engine.js";
import { onCalendlyBooked } from "./calendly.js";

// Keeps the conversation going: messages, "typing…" state, sending the
// project brief. The conversation and the visitor's details (name, email,
// answers so far) are remembered on this device for 30 days, so a returning
// visitor carries on from their last chat instead of starting again.
const KEEP_FOR = 30 * 24 * 60 * 60 * 1000;
const MEMORY_KEY = "pavora-assistant-memory"; // shared by the widget and the FAQ chat

function read(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && Date.now() - (saved.savedAt || 0) < KEEP_FOR) return saved;
  } catch {
    /* storage may be unavailable — that's fine */
  }
  return null;
}
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ ...value, savedAt: Date.now() }));
  } catch {
    /* ignore */
  }
}
function load(key) {
  const saved = read(key);
  return saved?.messages?.length ? saved : null;
}

let nextId = 1;
const id = () => `m${Date.now()}-${nextId++}`;

// storageKey lets the floating widget and the FAQ page keep separate chats
export default function useAssistant(storageKey = "pavora-assistant") {
  const saved = load(storageKey);
  const [messages, setMessages] = useState(
    saved?.messages || [{ id: id(), from: "bot", ...welcomeMessage() }],
  );
  const [state, setState] = useState(() => {
    const s = saved?.state || initialState();
    // details given in the other chat (widget ↔ FAQ page) are shared.
    // Attached files only live in this page visit, so forget their names on load.
    const memory = removeFiles({ ...(read(MEMORY_KEY)?.memory || {}), ...(s.memory || {}) });
    return { ...s, memory, lead: s.lead ? { ...s.lead, data: removeFiles(s.lead.data) } : s.lead };
  });
  // The attached files themselves (base64), kept in memory until the brief is sent
  const filesRef = useRef([]);
  const [typing, setTyping] = useState(false);
  const timer = useRef();

  useEffect(() => {
    write(storageKey, { messages: messages.slice(-60), state });
    write(MEMORY_KEY, { memory: state.memory || {} });
  }, [messages, state, storageKey]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Show bot replies one after another with a short "typing" pause
  const deliver = useCallback((replies) => {
    if (!replies.length) return;
    setTyping(true);
    const [first, ...rest] = replies;
    const words = (first.answer || []).reduce((n, b) => n + (b.text ? b.text.split(" ").length : 12), 0);
    const delay = Math.min(1400, 450 + words * 18);
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: id(), from: "bot", ...first }]);
      setTyping(false);
      if (rest.length) deliver(rest);
    }, delay);
  }, []);

  const submitBrief = useCallback(
    async (brief, current) => {
      setTyping(true);
      let ok = false;
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...brief,
            page: window.location.pathname,
            attachments: filesRef.current.map(({ filename, content, type }) => ({ filename, content, type })),
          }),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
      setTyping(false);
      // Brief sent: keep who they are, clear the project answers for next time
      const m = current.memory || {};
      const { attachments: _a, details: _d, ...answers } = brief;
      if (ok) filesRef.current = [];
      setState({ ...current, lead: null, memory: ok ? { name: m.name, email: m.email } : { ...m, ...answers } });
      deliver([
        ok
          ? {
              answer: [
                { text: `✅ **Sent!** Paul has your brief and will reply to **${brief.email}** personally.` },
                { text: "Want to talk it through as well? You can book a call with him:" },
                { actions: ["bookCall"], prefill: { name: brief.name, email: brief.email } },
                { text: "While you wait, have a look at some recent work:" },
                { card: "projects" },
              ],
              chips: ["Client reviews", "How do you work?"],
            }
          : {
              answer: [
                { text: "Sorry, I couldn't send that automatically right now. You can book a call with Paul or reach him here instead:" },
                { actions: ["bookCall", "upwork", "contact"], prefill: { name: brief.name, email: brief.email } },
              ],
              chips: ["Start over"],
            },
      ]);
    },
    [deliver],
  );

  const send = useCallback(
    (text) => {
      const clean = text.trim();
      if (!clean || typing) return;
      setMessages((m) => [...m, { id: id(), from: "user", text: clean }]);

      // Back from booking a call: carry on with the brief where it stopped
      if (/^(continue|carry on)( my| the)? (brief|chat|here)|^continue here$/i.test(clean) && !state.lead) {
        const r = startChatBrief(state);
        setState(r.state);
        deliver(r.messages);
        return;
      }

      if (/^start over$/i.test(clean)) filesRef.current = [];
      if (/^start over$/i.test(clean) && !state.lead) {
        const r = startLead(state);
        setState(r.state);
        deliver(r.messages);
        return;
      }

      const r = reply(clean, state);
      setState(r.state);
      if (r.submit) submitBrief(r.submit, r.state);
      else deliver(r.messages);
    },
    [state, typing, deliver, submitBrief],
  );

  // Buttons like "Start a project" / "Explain it here instead"
  const action = useCallback(
    (name) => {
      if (name === "lead" || name === "chatBrief") {
        setMessages((m) => [...m, { id: id(), from: "user", text: name === "lead" ? "Start a project" : "Explain it here instead" }]);
        const r = name === "lead" ? startLead(state) : startChatBrief(state);
        setState(r.state);
        deliver(r.messages);
      }
    },
    [state, deliver],
  );

  // 📎 Attach inspiration files (PDF, images or any file) to the brief
  const MAX_TOTAL = 3 * 1024 * 1024; // Vercel accepts ~4.5 MB per request; base64 adds a third
  const MAX_FILES = 5;
  const attach = useCallback(
    async (fileList) => {
      const picked = Array.from(fileList || []);
      if (!picked.length || !state.lead) return;
      let total = filesRef.current.reduce((n, f) => n + f.size, 0);
      const ok = [];
      const rejected = [];
      for (const file of picked) {
        if (filesRef.current.length + ok.length >= MAX_FILES || total + file.size > MAX_TOTAL) {
          rejected.push(file.name);
          continue;
        }
        total += file.size;
        ok.push(file);
      }
      const read = (file) =>
        new Promise((resolve) => {
          const r = new FileReader();
          r.onload = () => resolve({ filename: file.name, type: file.type, size: file.size, content: String(r.result).split(",")[1] || "" });
          r.onerror = () => resolve(null);
          r.readAsDataURL(file);
        });
      const loaded = (await Promise.all(ok.map(read))).filter(Boolean);
      filesRef.current = [...filesRef.current, ...loaded];
      setMessages((m) => [...m, { id: id(), from: "user", text: `📎 ${loaded.map((f) => f.filename).concat(rejected).join(", ")}` }]);
      const r = attachFiles(state, loaded.map((f) => ({ name: f.filename, size: f.size })), rejected);
      setState(r.state);
      deliver(r.messages);
    },
    [state, deliver],
  );

  // Confirm in the chat when a call is booked in the Calendly pop-up
  const memoryRef = useRef(state.memory);
  memoryRef.current = state.memory;
  useEffect(
    () =>
      onCalendlyBooked(() => {
        const m = memoryRef.current || {};
        const started = m.name || m.email || m.service;
        deliver([
          {
            answer: [
              { text: "🎉 **Your call is booked!** Calendly has emailed you the details and the Google Meet link." },
              {
                text: started
                  ? "Want to keep going here too? I've saved what you told me, so we'll pick up right where you stopped."
                  : "If you have links or files to share before the call, you can add them here or email Paul.",
              },
            ],
            chips: started ? ["Continue my brief here", "Show me your work"] : ["Show me your work", "How do you work?"],
          },
        ]);
      }),
    [deliver],
  );

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setTyping(false);
    filesRef.current = [];
    // New chat, but keep the visitor's name and email
    setState((s) => initialState({ name: s.memory?.name, email: s.memory?.email }));
    setMessages([{ id: id(), from: "bot", ...welcomeMessage() }]);
  }, []);

  return {
    messages,
    typing,
    send,
    action,
    reset,
    attach,
    inLead: !!state.lead,
    // the 📎 button shows while the client is describing the project
    canAttach: ["about", "goals", "audience", "inspiration"].includes(state.lead?.step),
  };
}
