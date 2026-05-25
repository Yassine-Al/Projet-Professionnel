import { useState, useRef, useEffect } from "react";

const API = `${import.meta.env.VITE_BACKEND_URL}/api/chat/stream`;
const WELCOME = { role: "model", text: "Bonjour ! Je suis l'assistant ocazz.ma.\nComment puis-je vous aider ?" };

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "10px 14px", background: "var(--bg-off)", border: "1px solid var(--border)" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 7, height: 7, background: "var(--text-faint)", borderRadius: "50%", display: "inline-block", animation: `dot-bounce 1.2s ${i * 0.2}s infinite ease-in-out` }} />
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([WELCOME]);
  const [input, setInput]     = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const abortRef   = useRef(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open, msgs.length]);

  const send = async () => {
    const text = input.trim();
    if (!text || streaming) return;

    const history = msgs
      .filter(m => m.role === "user" || m.role === "model")
      .map(m => ({ role: m.role, text: m.text }));

    // Add user bubble + empty bot bubble immediately
    setMsgs(ms => [...ms, { role: "user", text }, { role: "model", text: "" }]);
    setInput("");
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(API, {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          "Accept": "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok) throw new Error("api_error");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer    = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop(); // hold incomplete last line

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === "[DONE]") continue;
          try {
            const chunk = JSON.parse(raw);
            const delta = chunk.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
            if (delta) {
              setMsgs(ms => {
                const last = ms[ms.length - 1];
                return [...ms.slice(0, -1), { ...last, text: last.text + delta }];
              });
            }
          } catch { /* malformed chunk — skip */ }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") return;
      setMsgs(ms => {
        const last = ms[ms.length - 1];
        if (last.role === "model" && last.text === "") {
          return [...ms.slice(0, -1), { role: "error", text: "Désolé, une erreur est survenue. Réessayez." }];
        }
        return ms;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  // Show typing dots only while waiting for the first token
  const lastMsg = msgs[msgs.length - 1];
  const awaitingFirst = streaming && lastMsg?.role === "model" && lastMsg?.text === "";

  return (
    <>
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .chat-window { animation: chat-slide-up 0.2s ease; }
        @keyframes chat-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="Assistant ocazz.ma"
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 1000,
          width: 56, height: 56,
          background: open ? "#333" : "var(--accent-blue)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
          transition: "background 0.15s",
        }}
      >
        {open ? (
          <svg width="20" height="20" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="22" height="22" fill="none" stroke="#fff" viewBox="0 0 24 24" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="chat-window"
          style={{
            position: "fixed", bottom: 96, right: 28, zIndex: 999,
            width: 360, height: 500,
            background: "var(--bg-white)",
            border: "1px solid var(--border)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            display: "flex", flexDirection: "column",
          }}
        >
          {/* Header */}
          <div style={{ padding: "14px 18px", background: "var(--accent-blue)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: 14, color: "#fff" }}>Assistant ocazz.ma</p>
              <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.75)" }}>Propulsé par Gemini AI</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px", display: "flex", flexDirection: "column", gap: 10 }}>
            {msgs.map((m, i) => {
              const isUser  = m.role === "user";
              const isError = m.role === "error";
              // Hide the empty placeholder bubble while waiting for first token
              const isEmpty = m.role === "model" && m.text === "" && i === msgs.length - 1 && awaitingFirst;
              if (isEmpty) return null;
              return (
                <div key={i} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "80%",
                    padding: "9px 13px",
                    fontSize: 13.5, lineHeight: "19px",
                    whiteSpace: "pre-wrap",
                    background: isUser ? "var(--accent-blue)" : isError ? "#fff3f3" : "var(--bg-off)",
                    color: isUser ? "#fff" : isError ? "var(--error)" : "var(--text-primary)",
                    border: isUser ? "none" : `1px solid ${isError ? "#fcc" : "var(--border)"}`,
                  }}>
                    {m.text}
                  </div>
                </div>
              );
            })}

            {/* Typing dots while waiting for first token */}
            {awaitingFirst && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <TypingDots />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, flexShrink: 0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez votre question…"
              className="textarea-field"
              style={{ flex: 1, minHeight: 42, maxHeight: 100, resize: "none", fontSize: 13, padding: "10px 12px", lineHeight: "18px" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || streaming}
              className="btn-primary"
              style={{ width: 42, height: 42, padding: 0, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
