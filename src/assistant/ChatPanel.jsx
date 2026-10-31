import { useEffect, useRef, useState } from "react";
import { Symbol } from "../components/Logo.jsx";
import Icon from "../components/Icons.jsx";
import Blocks from "./Blocks.jsx";
import useAssistant from "./useAssistant.js";

function Avatar({ size = "size-8" }) {
  return (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800`}>
      <Symbol color="#FFFFFF" className="h-[45%] w-auto" />
    </span>
  );
}

function Typing() {
  return (
    <div className="flex items-end gap-2" aria-label="Assistant is typing">
      <Avatar size="size-7" />
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-ink-800 px-4 py-3.5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="size-1.5 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: `${d}ms`, animationDuration: "1s" }}
          />
        ))}
      </div>
    </div>
  );
}

// The full chat: header, messages, suggestion chips and the input.
//   onClose:    show a close button (used by the floating widget)
//   onNavigate: called when a link inside the chat is clicked
//   storageKey: keeps separate conversations for different places
export default function ChatPanel({ onClose, onNavigate, storageKey, className = "" }) {
  const { messages, typing, send, action, reset, inLead } = useAssistant(storageKey);
  const [input, setInput] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  // Keep the newest message in view
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const submit = (e) => {
    e.preventDefault();
    send(input);
    setInput("");
    inputRef.current?.focus();
  };

  const last = messages[messages.length - 1];
  const chips = !typing && last?.from === "bot" ? last.chips || [] : [];

  return (
    <div className={`flex min-h-0 flex-col overflow-hidden bg-ink-900 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ink-800 bg-ink-950/60 px-4 py-3.5">
        <span className="relative">
          <Avatar size="size-10" />
          <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-ink-950 bg-emerald-400" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-[15px] font-medium text-white">PAVORA Assistant</p>
          <p className="truncate text-xs text-slate-400">Instant answers · Paul replies personally</p>
        </div>
        <button
          type="button"
          onClick={reset}
          title="New conversation"
          aria-label="Start a new conversation"
          className="grid size-9 cursor-pointer place-items-center rounded-full text-slate-400 transition-colors hover:bg-ink-800 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5" />
          </svg>
        </button>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="grid size-9 cursor-pointer place-items-center rounded-full text-slate-400 transition-all duration-300 hover:rotate-90 hover:bg-ink-800 hover:text-white"
          >
            <Icon name="close" className="size-[18px]" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={listRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-5" aria-live="polite">
        {messages.map((m) =>
          m.from === "user" ? (
            <div key={m.id} className="animate-fade-in flex justify-end">
              <p className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-600 px-4 py-2.5 text-[14px] leading-relaxed text-white">
                {m.text}
              </p>
            </div>
          ) : (
            <div key={m.id} className="animate-fade-in flex items-end gap-2">
              <Avatar size="size-7" />
              <div className="max-w-[88%] rounded-2xl rounded-bl-md bg-ink-800 px-4 py-3">
                <Blocks blocks={m.answer || []} onAsk={send} onAction={action} onNavigate={onNavigate} />
              </div>
            </div>
          ),
        )}
        {typing && <Typing />}
      </div>

      {/* Suggestion chips */}
      {chips.length > 0 && (
        <div className="flex gap-2 overflow-x-auto border-t border-ink-800 px-4 pt-3 pb-1">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => (c === "Start a project" ? action("lead") : send(c))}
              className="shrink-0 cursor-pointer rounded-full border border-ink-700 px-3.5 py-1.5 text-[13px] whitespace-nowrap text-slate-200 transition-all duration-300 hover:border-blue-500 hover:bg-blue-600/15 hover:text-white active:scale-95"
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={submit} className="flex items-center gap-2 p-3">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={inLead ? "Type your answer…" : "Ask about services, process, tools…"}
          aria-label="Message the assistant"
          maxLength={2000}
          className="min-w-0 flex-1 rounded-full border border-ink-700 bg-ink-950 px-4 py-3 text-[14px] text-white placeholder:text-slate-500 transition-colors focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || typing}
          aria-label="Send"
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700 active:scale-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Icon name="arrow-up" className="size-5" />
        </button>
      </form>
    </div>
  );
}
