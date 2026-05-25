import { useState, useEffect, useCallback } from "react";
import { axiosClient } from "../../api/axios";

const STATUS = {
  pending:  { cls: "badge-warning", label: "En attente" },
  approved: { cls: "badge-success", label: "Approuvée" },
  rejected: { cls: "badge-danger",  label: "Rejetée" },
};

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="anim-spin">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

export default function AdminAnnonces() {
  const [annonces, setAnnonces] = useState([]);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading]   = useState(true);
  const [page, setPage]         = useState(1);
  const [busy, setBusy]         = useState({});
  const [filter, setFilter]     = useState("all");
  const [error, setError]       = useState(null);

  const load = useCallback((p = 1) => {
    setLoading(true);
    setError(null);
    axiosClient.get(`/admin/annonces?page=${p}`)
      .then(r => {
        setAnnonces(r.data.data ?? []);
        setLastPage(r.data.meta?.last_page ?? r.data.last_page ?? 1);
      })
      .catch(e => setError(e.response?.data?.message ?? "Erreur de chargement"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(page); }, [page, load]);

  const doAction = async (id, endpoint) => {
    setBusy(b => ({ ...b, [id]: endpoint }));
    try {
      await axiosClient.post(`/admin/annonces/${id}/${endpoint}`);
      setAnnonces(prev => prev.map(a => a.id === id
        ? { ...a, status: endpoint === "approve" ? "approved" : "rejected" }
        : a
      ));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(b => { const n = { ...b }; delete n[id]; return n; });
    }
  };

  const displayed = filter === "all" ? annonces : annonces.filter(a => a.status === filter);

  return (
    <div style={{ padding: "40px 48px" }}>
      {/* Header */}
      <div style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: 30 }}>Annonces</h2>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: 14 }}>Modérez les annonces soumises par les vendeurs</p>
        </div>
        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--border)", background: "var(--bg-white)" }}>
          {[["all","Toutes"],["pending","En attente"],["approved","Approuvées"],["rejected","Rejetées"]].map(([val,lbl]) => (
            <button key={val} onClick={() => setFilter(val)} style={{
              padding: "8px 18px", background: filter === val ? "var(--accent-blue)" : "transparent",
              color: filter === val ? "#fff" : "var(--text-muted)", border: "none",
              borderRight: val !== "rejected" ? "1px solid var(--border)" : "none",
              fontSize: 13, fontWeight: filter === val ? 600 : 400, cursor: "pointer",
              fontFamily: "Manrope, sans-serif", transition: "all 0.15s",
            }}>
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: "#FFF5F5", border: "1px solid var(--error)", borderLeft: "4px solid var(--error)", padding: "14px 18px", marginBottom: 20, color: "var(--error)", fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)" }}>
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <Spinner /> Chargement…
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <div style={{ width: 52, height: 52, background: "var(--bg-off)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="26" height="26" fill="none" stroke="var(--text-faint)" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <p style={{ color: "var(--text-faint)", fontSize: 15, margin: 0 }}>Aucune annonce dans cette catégorie</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "var(--bg-off)" }}>
                  {["ID", "Titre", "Vendeur", "Prix", "Statut", "Date", "Actions"].map(h => (
                    <th key={h} style={{ padding: "13px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map(a => {
                  const s = STATUS[a.status] ?? STATUS.pending;
                  const isBusy = busy[a.id];
                  return (
                    <tr key={a.id} style={{ borderBottom: "1px solid var(--bg-off)", transition: "background 0.1s" }}
                      onMouseOver={e => e.currentTarget.style.background = "var(--bg-off)"}
                      onMouseOut={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "14px 16px", color: "var(--text-faint)", fontSize: 12, fontFamily: "monospace" }}>{a.id}</td>
                      <td style={{ padding: "14px 16px", maxWidth: 240 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
                        {a.city && <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-faint)" }}>{a.city}</p>}
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 14, color: "var(--text-secondary)" }}>{a.user?.name ?? "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "var(--accent-blue)", whiteSpace: "nowrap" }}>
                        {a.price ? `${Number(a.price).toLocaleString()} MAD` : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className={s.cls}>{s.label}</span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                        {a.created_at ? new Date(a.created_at).toLocaleDateString("fr-MA", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: 8 }}>
                          {a.status !== "approved" && (
                            <button
                              disabled={!!isBusy}
                              onClick={() => doAction(a.id, "approve")}
                              style={{ display: "flex", alignItems: "center", gap: 5, background: "var(--success)", color: "#fff", border: "none", padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.6 : 1, fontFamily: "Manrope, sans-serif", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                              {isBusy === "approve" ? <Spinner /> : (
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                              )}
                              Approuver
                            </button>
                          )}
                          {a.status !== "rejected" && (
                            <button
                              disabled={!!isBusy}
                              onClick={() => doAction(a.id, "reject")}
                              style={{ display: "flex", alignItems: "center", gap: 5, background: "transparent", color: "var(--error)", border: "1px solid var(--error)", padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: isBusy ? "not-allowed" : "pointer", opacity: isBusy ? 0.6 : 1, fontFamily: "Manrope, sans-serif", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                              {isBusy === "reject" ? <Spinner /> : (
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                              )}
                              Rejeter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <div style={{ padding: "14px 20px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
              className="btn-secondary" style={{ height: 36, lineHeight: "36px", padding: "0 16px", fontSize: 13, opacity: page === 1 ? 0.4 : 1 }}>
              ← Préc.
            </button>
            <span style={{ fontSize: 13, color: "var(--text-muted)", padding: "0 8px" }}>
              Page {page} / {lastPage}
            </span>
            <button disabled={page === lastPage} onClick={() => setPage(p => p + 1)}
              className="btn-secondary" style={{ height: 36, lineHeight: "36px", padding: "0 16px", fontSize: 13, opacity: page === lastPage ? 0.4 : 1 }}>
              Suiv. →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
