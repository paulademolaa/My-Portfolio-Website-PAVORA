import { useCallback, useEffect, useRef, useState } from "react";
import { initialState, reply, startLead, welcomeMessage } from "./engine.js";

// Keeps the conversation going: messages, "typing…" state, sending the
// project brief. The conversation is remembered while the tab is open.
function load(key) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(key));
    if (saved?.messages?.length) return saved;
  } catch {
    /* ignore */
  }
  return null;
}

let nextId = 1;
const id = () => `m${Date.now()}-${nextId++}`;

// storageKey lets the floating widget and the FAQ page keep separate chats
export default function useAssistant(storageKey = "pavora-assistant") {
  const saved = load(storageKey);
  const [messages, setMessages] = useState(
    saved?.messages || [{ id: id(), from: "bot", ...welcomeMessage() }],
  );
  const [state, setState] = useState(saved?.state || initialState());
  const [typing, setTyping] = useState(false);
  const timer = useRef();

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ messages: messages.slice(-60), state }));
    } catch {
      /* storage may be unavailable — that's fine */
    }
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
          body: JSON.stringify({ ...brief, page: window.location.pathname }),
        });
        ok = res.ok;
      } catch {
        ok = false;
      }
      setTyping(false);
      setState({ ...current, lead: null });
      deliver([
        ok
          ? {
              answer: [
                { text: `✅ **Sent!** Paul has your brief and will reply to **${brief.email}** personally.` },
                { text: "While you wait, have a look at some recent work:" },
                { card: "projects" },
              ],
              chips: ["Client reviews", "How do you work?"],
            }
          : {
              answer: [
                { text: "Sorry — I couldn't send that automatically right now. You can reach Paul directly here instead:" },
                { actions: ["upwork", "contact"] },
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

  // Buttons like "Start a project"
  const action = useCallback(
    (name) => {
      if (name === "lead") {
        setMessages((m) => [...m, { id: id(), from: "user", text: "Start a project" }]);
        const r = startLead(state);
        setState(r.state);
        deliver(r.messages);
      }
    },
    [state, deliver],
  );

  const reset = useCallback(() => {
    clearTimeout(timer.current);
    setTyping(false);
    setState(initialState());
    setMessages([{ id: id(), from: "bot", ...welcomeMessage() }]);
  }, []);

  return { messages, typing, send, action, reset, inLead: !!state.lead };
}
