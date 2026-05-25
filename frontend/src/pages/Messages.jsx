import { useState, useEffect, useRef, useCallback } from "react";
import { axiosClient } from "../api/axios";

function formatTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return d.toLocaleDateString("fr-MA", { weekday: "short" });
  return d.toLocaleDateString("fr-MA", { day: "2-digit", month: "short" });
}

function Avatar({ name, size = 36 }) {
  const colors = ["#007BFF", "#5881BC", "#28A745", "#6C757D", "#343A40"];
  const bg = colors[(name?.charCodeAt(0) ?? 0) % colors.length];
  return (
    <div style={{ width: size, height: size, background: bg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Manrope, sans-serif", fontWeight: 700, fontSize: Math.round(size * 0.38), flexShrink: 0 }}>
      {name?.charAt(0).toUpperCase() ?? "?"}
    </div>
  );
}

function Spinner({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="anim-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("user")) ?? {}; }
  catch { return {}; }
}

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [text, setText]                   = useState("");
  const [loadingConvs, setLoadingConvs]   = useState(true);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [sending, setSending]             = useState(false);
  const [convError, setConvError]         = useState(null);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const currentUser = getCurrentUser();

  const loadConversations = useCallback(() => {
    axiosClient.get("/conversations")
      .then(r => setConversations(r.data.data ?? r.data))
      .catch(e => setConvError(e.response?.data?.message ?? "Erreur de chargement"))
      .finally(() => setLoadingConvs(false));
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const openConversation = useCallback((conv) => {
    if (activeConv?.id === conv.id) return;
    setActiveConv(conv);
    setMessages([]);
    setLoadingMsgs(true);
    axiosClient.get(`/conversations/${conv.id}`)
      .then(r => {
        setMessages(r.data.messages?.data ?? r.data.messages ?? []);
        setConversations(cs => cs.map(c => c.id === conv.id ? { ...c, unread_count: 0 } : c));
      })
      .catch(console.error)
      .finally(() => setLoadingMsgs(false));
  }, [activeConv?.id]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Poll active conversation for new messages every 4s
  useEffect(() => {
    if (!activeConv) return;
    const id = activeConv.id;
    const interval = setInterval(() => {
      axiosClient.get(`/conversations/${id}`)
        .then(r => {
          const fresh = r.data.messages?.data ?? r.data.messages ?? [];
          setMessages(current => {
            const hasNew = fresh.some(m => !current.find(c => c.id === m.id));
            if (!hasNew) return current;
            const temps = current.filter(m => String(m.id).startsWith("temp-"));
            return [...fresh, ...temps];
          });
        })
        .catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, [activeConv?.id]);

  // Poll inbox for unread badge updates every 10s
  useEffect(() => {
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, [loadConversations]);

  const sendMessage = async (e) => {
    e?.preventDefault();
    const content = text.trim();
    if (!content || !activeConv || sending) return;
    setSending(true);
    const optimistic = { id: `temp-${Date.now()}`, content, is_mine: true, created_at: new Date().toISOString(), sender: { name: currentUser?.name }, is_read: false };
    setMessages(ms => [...ms, optimistic]);
    setText("");
    try {
      const res = await axiosClient.post(`/conversations/${activeConv.id}/messages`, { content });
      const sent = res.data?.data ?? res.data;
      setMessages(ms => ms.map(m => m.id === optimistic.id ? sent : m));
      loadConversations();
    } catch (err) {
      setMessages(ms => ms.filter(m => m.id !== optimistic.id));
      setText(content);
      console.error(err);
    } finally {
      setSending(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const totalUnread = conversations.reduce((s, c) => s + (c.unread_count ?? 0), 0);

  return (
    <div style={{ height: "calc(100vh - 80px)", display: "flex", overflow: "hidden", background: "var(--bg-off)" }}>

      {/* ── Left panel: conversation list ── */}
      <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", background: "var(--bg-white)", borderRight: "1px solid var(--border)" }}>
        {/* Header */}
        <div style={{ padding: "18px 20px 16px", borderBottom: "1px solid var(--border)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h4 style={{ margin: 0, fontSize: 18 }}>Messages</h4>
            {totalUnread > 0 && (
              <span className="badge-primary" style={{ minWidth: 22, height: 22, lineHeight: "22px", textAlign: "center", fontSize: 11 }}>
                {totalUnread}
              </span>
            )}
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {loadingConvs ? (
            <div style={{ padding: "50px 20px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "var(--text-faint)", fontSize: 14 }}>
              <Spinner /> Chargement…
            </div>
          ) : convError ? (
            <div style={{ padding: "40px 20px", textAlign: "center" }}>
              <p style={{ color: "var(--error)", fontSize: 14, margin: "0 0 12px" }}>{convError}</p>
              <button onClick={loadConversations} className="btn-outline" style={{ height: 38, lineHeight: "38px", padding: "0 18px", fontSize: 13 }}>
                Réessayer
              </button>
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ width: 60, height: 60, background: "var(--bg-off)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="30" height="30" fill="none" stroke="var(--text-faint)" viewBox="0 0 24 24" strokeWidth={1.3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <p style={{ color: "var(--text-faint)", fontSize: 14, margin: "0 0 4px", fontWeight: 600 }}>Aucune conversation</p>
              <p style={{ color: "var(--text-faint)", fontSize: 13, margin: 0 }}>Contactez un vendeur depuis une annonce</p>
            </div>
          ) : (
            conversations.map(conv => {
              const isActive = activeConv?.id === conv.id;
              const hasUnread = conv.unread_count > 0;
              return (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv)}
                  style={{
                    width: "100%", padding: "14px 20px", background: isActive ? "var(--bg-off)" : "transparent",
                    border: "none", borderBottom: "1px solid #f0f0f0",
                    borderLeft: `3px solid ${isActive ? "var(--accent-blue)" : "transparent"}`,
                    cursor: "pointer", textAlign: "left", display: "flex", gap: 12, alignItems: "center",
                    transition: "background 0.12s",
                  }}
                  onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "#fafafa"; }}
                  onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
                >
                  <Avatar name={conv.participant?.name} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: hasUnread ? 700 : 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 150 }}>
                        {conv.participant?.name ?? "—"}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-faint)", flexShrink: 0, marginLeft: 6 }}>
                        {formatTime(conv.last_message_at)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                      <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {conv.last_message?.content ?? <em style={{ fontStyle: "normal" }}>{conv.annonce?.title ?? "—"}</em>}
                      </p>
                      {hasUnread && (
                        <span className="badge-primary" style={{ minWidth: 18, height: 18, lineHeight: "18px", textAlign: "center", fontSize: 10, flexShrink: 0 }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Right panel: chat ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {!activeConv ? (
          /* Empty state */
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
            <div style={{ width: 80, height: 80, background: "var(--bg-white)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="40" height="40" fill="none" stroke="var(--text-faint)" viewBox="0 0 24 24" strokeWidth={1.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
              </svg>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 600, fontFamily: "Manrope, sans-serif", color: "var(--text-secondary)" }}>
                Sélectionnez une conversation
              </p>
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-faint)" }}>
                Choisissez une discussion dans la liste à gauche
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-white)", display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
              <Avatar name={activeConv.participant?.name} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, fontFamily: "Manrope, sans-serif" }}>
                  {activeConv.participant?.name}
                </p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  Annonce : <span style={{ color: "var(--accent-blue)", fontWeight: 500 }}>{activeConv.annonce?.title ?? "—"}</span>
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div style={{ flex: 1, overflowY: "auto", padding: "24px 24px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
              {loadingMsgs ? (
                <div style={{ textAlign: "center", paddingTop: 60, color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <Spinner /> Chargement des messages…
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 60 }}>
                  <p style={{ color: "var(--text-faint)", fontSize: 14, margin: 0 }}>
                    Aucun message — démarrez la conversation !
                  </p>
                </div>
              ) : (
                messages.map(msg => {
                  const mine = msg.is_mine ?? (msg.sender?.id === currentUser?.id);
                  const isTemp = typeof msg.id === "string" && msg.id.startsWith("temp-");
                  return (
                    <div key={msg.id} style={{ display: "flex", flexDirection: mine ? "row-reverse" : "row", alignItems: "flex-end", gap: 8 }}>
                      {!mine && <Avatar name={msg.sender?.name} size={28} />}
                      <div style={{ maxWidth: "62%" }}>
                        <div style={{
                          background: mine ? "var(--accent-blue)" : "var(--bg-white)",
                          color: mine ? "#fff" : "var(--text-primary)",
                          padding: "10px 14px",
                          fontSize: 14, lineHeight: "20px",
                          border: mine ? "none" : "1px solid var(--border)",
                          opacity: isTemp ? 0.7 : 1,
                          transition: "opacity 0.2s",
                        }}>
                          {msg.content}
                        </div>
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: "var(--text-faint)", textAlign: mine ? "right" : "left", display: "flex", alignItems: "center", justifyContent: mine ? "flex-end" : "flex-start", gap: 4 }}>
                          {formatTime(msg.created_at)}
                          {mine && !isTemp && (
                            <svg width="12" height="12" fill="none" stroke={msg.is_read ? "var(--success)" : "var(--text-faint)"} viewBox="0 0 24 24" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                          )}
                          {isTemp && <Spinner size={10} />}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              style={{ padding: "14px 20px", background: "var(--bg-white)", borderTop: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}
            >
              <textarea
                ref={inputRef}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Votre message… (Entrée pour envoyer, Maj+Entrée pour un saut de ligne)"
                className="textarea-field"
                style={{ flex: 1, minHeight: 52, maxHeight: 130, resize: "none", fontSize: 14, padding: "14px", lineHeight: "20px" }}
              />
              <button
                type="submit"
                disabled={!text.trim() || sending}
                className="btn-primary"
                style={{ height: 52, padding: "0 20px", flexShrink: 0, display: "flex", alignItems: "center", gap: 8 }}
              >
                {sending ? <Spinner /> : (
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                )}
                Envoyer
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
