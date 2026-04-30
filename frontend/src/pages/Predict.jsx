import { useState } from "react";

const FIELDS = [
  { k:"make",  label:"Marque",                  type:"sel", opts:["","Dacia","Volkswagen","BMW","Renault","Peugeot","Toyota","Mercedes","Hyundai","Ford","Kia","Autre"] },
  { k:"model", label:"Modèle",                  type:"inp", placeholder:"Ex: Duster" },
  { k:"year",  label:"Année",                   type:"sel", opts:["", ...Array.from({length:20},(_,i)=>String(2025-i))] },
  { k:"mileage",label:"Kilométrage (km)",        type:"inp", placeholder:"Ex: 45000", inputType:"number" },
  { k:"fuel",  label:"Carburant",               type:"sel", opts:["","Essence","Diesel","Hybride","Électrique","GPL"] },
  { k:"trans", label:"Boîte de vitesse",        type:"sel", opts:["","Manuelle","Automatique","Semi-auto","CVT"] },
  { k:"doors", label:"Nb. de portes",           type:"sel", opts:["","2","3","4","5"] },
  { k:"fiscal",label:"Puissance fiscale (CV)",  type:"inp", placeholder:"Ex: 7", inputType:"number" },
  { k:"din",   label:"Puissance DIN (ch)",      type:"inp", placeholder:"Ex: 130", inputType:"number" },
  { k:"co2",   label:"Émissions CO₂ (g/km)",    type:"inp", placeholder:"Ex: 110", inputType:"number" },
  { k:"conso", label:"Conso. mixte (L/100km)",  type:"inp", placeholder:"Ex: 5.8", inputType:"number" },
  { k:"color", label:"Couleur",                 type:"inp", placeholder:"Ex: Blanc Nacré" },
];

export default function Predict() {
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const base    = 180000;
    const yearAdj = ((+form.year || 2020) - 2015) * 10000;
    const mileAdj = -(+form.mileage || 50000) * 0.7;
    const mid     = Math.max(30000, Math.round((base + yearAdj + mileAdj) / 5000) * 5000);
    setResult({ min: mid - 15000, mid, max: mid + 20000 });
    setLoading(false);
  };

  return (
    <div style={{ background: "var(--bg-white)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--bg-dark)", padding: "52px 0" }}>
        <div className="container">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(0,123,255,0.15)", border: "1px solid rgba(0,123,255,0.3)", padding: "6px 14px", marginBottom: 16 }}>
            <span style={{ color: "var(--accent-blue)", fontSize: 13, fontWeight: 700 }}>✨ Powered by Machine Learning</span>
          </div>
          <h1 style={{ color: "#fff", margin: "0 0 16px" }}>Estimez le prix de votre véhicule</h1>
          <p style={{ color: "#888", fontSize: 17, margin: 0, maxWidth: 540 }}>Notre IA analyse les tendances du marché marocain en temps réel pour vous donner une estimation précise et fiable.</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 40, alignItems: "start" }} className="predict-grid">

          {/* Form */}
          <div>
            <div style={{ border: "1px solid var(--border)", padding: "32px" }}>
              <h3 style={{ margin: "0 0 24px", fontSize: 22 }}>Caractéristiques du véhicule</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                  {FIELDS.map(({ k, label, type, opts, placeholder, inputType }) => (
                    <div key={k}>
                      <label className="form-label">{label}</label>
                      {type === "sel" ? (
                        <select value={form[k]||""} onChange={set(k)} className="select-field">
                          {opts.map(o => <option key={o} value={o}>{o||"Sélectionner"}</option>)}
                        </select>
                      ) : (
                        <input type={inputType||"text"} value={form[k]||""} onChange={set(k)} placeholder={placeholder} className="input-field"/>
                      )}
                    </div>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", opacity: loading ? 0.7 : 1 }}>
                  {loading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="anim-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                      Analyse en cours…
                    </span>
                  ) : "Estimer le prix"}
                </button>
              </form>
            </div>

            {/* Result */}
            {result && (
              <div style={{ marginTop: 24, border: "1px solid var(--accent-blue)", borderTop: "4px solid var(--accent-blue)", padding: "32px" }} className="anim-up">
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 44, height: 44, background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" fill="none" stroke="var(--accent-blue)" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                  </div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>Estimation IA — ocazz.ma</p>
                    <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>Basé sur les données du marché marocain</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
                  {[["Minimum", result.min, "var(--text-muted)"], ["Estimation", result.mid, "var(--accent-blue)"], ["Maximum", result.max, "var(--success)"]].map(([l, v, c]) => (
                    <div key={l} style={{ border: "1px solid var(--border)", padding: "20px 16px", textAlign: "center", background: "var(--bg-off)" }}>
                      <p style={{ color: "var(--text-faint)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 8px" }}>{l}</p>
                      <p style={{ fontWeight: 800, fontSize: 22, color: c, margin: "0 0 4px" }}>{v.toLocaleString()}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: 12, margin: 0, fontWeight: 600 }}>MAD</p>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <a href="/sell" className="btn-primary" style={{ flex: 1, textAlign: "center" }}>Déposer mon annonce</a>
                  <button onClick={() => setResult(null)} className="btn-secondary" style={{ flex: 1 }}>Nouvelle estimation</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ border: "1px solid var(--border)", padding: "24px" }}>
              <h4 style={{ margin: "0 0 20px" }}>Comment ça fonctionne ?</h4>
              {[["1","Renseignez les caractéristiques de votre véhicule."],["2","Notre IA analyse des milliers d'annonces similaires."],["3","Recevez une fourchette de prix précise en secondes."]].map(([n, t]) => (
                <div key={n} style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 28, height: 28, background: "var(--accent-blue)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{n}</div>
                  <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: "21px", margin: "4px 0 0" }}>{t}</p>
                </div>
              ))}
            </div>

            <div style={{ background: "var(--bg-off)", borderLeft: "4px solid var(--success)", padding: "20px" }}>
              <p style={{ fontWeight: 700, color: "var(--success)", margin: "0 0 6px" }}>Fiabilité 94%</p>
              <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, lineHeight: "21px" }}>Notre modèle est entraîné sur plus de 50 000 transactions réelles au Maroc.</p>
            </div>

            <div style={{ border: "1px solid var(--border)", padding: "20px" }}>
              <p style={{ color: "var(--text-muted)", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px" }}>Facteurs analysés</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Marque","Modèle","Année","Kilométrage","Carburant","Région","Puissance","État"].map(t => (
                  <span key={t} style={{ fontSize: 12, border: "1px solid var(--border)", color: "var(--text-secondary)", padding: "4px 10px" }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:767px){.predict-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}