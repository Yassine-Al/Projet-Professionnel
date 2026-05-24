import { useState } from "react";

const STEPS = ["Votre véhicule", "Prix & Photos", "Coordonnées"];

export default function SellYourCar() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ make:"", model:"", year:"", mileage:"", fuel:"", trans:"", color:"", price:"", desc:"", name:"", phone:"", email:"" });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const Field = ({ label, children }) => (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );

  const Sel = ({ k, label, opts }) => (
    <Field label={label}>
      <select value={form[k]} onChange={set(k)} className="select-field">
        <option value="">Sélectionner</option>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </Field>
  );

  const Inp = ({ k, label, type="text", placeholder="" }) => (
    <Field label={label}>
      <input type={type} value={form[k]} onChange={set(k)} placeholder={placeholder} className="input-field"/>
    </Field>
  );

  return (
    <div style={{ background: "var(--bg-white)", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "var(--accent-blue)", padding: "52px 0" }}>
        <div className="container">
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Déposer une annonce</p>
          <h1 style={{ color: "#fff", margin: "0 0 16px" }}>Vendez votre voiture gratuitement</h1>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 17, margin: 0, maxWidth: 520 }}>Renseignez les informations de votre véhicule et touchez des milliers d'acheteurs sur ocazz.ma.</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 60 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40, alignItems: "start" }} className="sell-grid">

          {/* ── Form ── */}
          <div>
            {submitted ? (
              <div style={{ border: "1px solid var(--border)", padding: "60px 40px", textAlign: "center" }}>
                <div style={{ width: 64, height: 64, background: "#E8F5E9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <svg width="32" height="32" fill="none" stroke="var(--success)" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                </div>
                <h2 style={{ margin: "0 0 12px" }}>Annonce soumise !</h2>
                <p style={{ color: "var(--text-muted)", margin: "0 0 32px", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>Notre équipe examinera votre annonce dans les 24h. Vous serez notifié par email.</p>
                <button onClick={() => { setSubmitted(false); setStep(1); setForm({ make:"",model:"",year:"",mileage:"",fuel:"",trans:"",color:"",price:"",desc:"",name:"",phone:"",email:"" }); }}
                  className="btn-primary">Déposer une autre annonce</button>
              </div>
            ) : (
              <>
                {/* Step indicators */}
                <div style={{ display: "flex", marginBottom: 32, borderBottom: "1px solid var(--border)" }}>
                  {STEPS.map((label, i) => {
                    const n = i + 1;
                    const active = step === n;
                    const done = step > n;
                    return (
                      <div key={label} onClick={() => done && setStep(n)} style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: done ? "pointer" : "default", borderBottom: active ? "3px solid var(--accent-blue)" : "3px solid transparent", marginBottom: -1 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: active ? "var(--accent-blue)" : done ? "var(--success)" : "var(--bg-off)", border: active || done ? "none" : "1px solid var(--border)", color: active || done ? "#fff" : "var(--text-faint)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
                          {done ? "✓" : n}
                        </div>
                        <span style={{ fontSize: 13, color: active ? "var(--accent-blue)" : done ? "var(--success)" : "var(--text-faint)", fontWeight: active ? 600 : 400 }}>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Step 1 */}
                {step === 1 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
                    <h3 style={{ margin: 0, fontSize: 22 }}>Informations du véhicule</h3>
                    <div>
                      <label className="form-label">Immatriculation ou VIN</label>
                      <div style={{ display: "flex", gap: 0 }}>
                        <input type="text" placeholder="Ex: 12345-أ-1" className="input-field" style={{ flex: 1, borderRight: 0 }}/>
                        <button className="btn-primary" style={{ flexShrink: 0, padding: "0 24px", fontSize: 14 }}>Récupérer</button>
                      </div>
                      <p style={{ color: "var(--text-faint)", fontSize: 12, marginTop: 6 }}>🔒 Vos données sont sécurisées</p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Sel k="make" label="Marque" opts={["Dacia","Volkswagen","BMW","Renault","Peugeot","Toyota","Mercedes","Hyundai","Ford","Kia"]}/>
                      <Inp k="model" label="Modèle" placeholder="Ex: Duster"/>
                      <Sel k="year" label="Année" opts={Array.from({length:20},(_,i)=>String(2025-i))}/>
                      <Inp k="mileage" label="Kilométrage (km)" type="number" placeholder="Ex: 45000"/>
                      <Sel k="fuel" label="Carburant" opts={["Essence","Diesel","Hybride","Électrique","GPL"]}/>
                      <Sel k="trans" label="Boîte de vitesse" opts={["Manuelle","Automatique","CVT"]}/>
                    </div>
                    <button onClick={() => setStep(2)} className="btn-primary" style={{ alignSelf: "flex-start" }}>Continuer →</button>
                  </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
                    <h3 style={{ margin: 0, fontSize: 22 }}>Prix et description</h3>
                    <div>
                      <label className="form-label">Prix demandé (MAD)</label>
                      <div style={{ position: "relative" }}>
                        <input type="number" value={form.price} onChange={set("price")} placeholder="Ex: 150000" className="input-field" style={{ paddingRight: 60 }}/>
                        <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 14, fontWeight: 600 }}>MAD</span>
                      </div>
                    </div>
                    <Inp k="color" label="Couleur" placeholder="Ex: Blanc Nacré"/>
                    <div>
                      <label className="form-label">Description</label>
                      <textarea value={form.desc} onChange={set("desc")} placeholder="Décrivez l'état général, les options, l'historique d'entretien…" className="textarea-field" style={{ minHeight: 140 }}/>
                    </div>
                    <div style={{ border: "2px dashed var(--border)", padding: "40px 20px", textAlign: "center", cursor: "pointer" }}
                      onMouseOver={e=>e.currentTarget.style.borderColor="var(--accent-blue)"}
                      onMouseOut={e=>e.currentTarget.style.borderColor="var(--border)"}>
                      <svg width="40" height="40" fill="none" stroke="var(--text-faint)" viewBox="0 0 24 24" style={{ marginBottom: 12 }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <p style={{ fontWeight: 600, margin: "0 0 4px", color: "var(--text-secondary)" }}>Ajouter des photos</p>
                      <p style={{ color: "var(--text-faint)", fontSize: 13, margin: 0 }}>PNG, JPG · Max 10 MB · 8 photos max</p>
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button onClick={() => setStep(1)} className="btn-secondary">← Retour</button>
                      <button onClick={() => setStep(3)} className="btn-primary">Continuer →</button>
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                  <form onSubmit={e=>{e.preventDefault();setSubmitted(true);}} style={{ display: "flex", flexDirection: "column", gap: 20 }} className="anim-fade">
                    <h3 style={{ margin: 0, fontSize: 22 }}>Vos coordonnées</h3>
                    <Inp k="name" label="Nom complet" placeholder="Mohamed Alami"/>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <Inp k="phone" label="Téléphone" type="tel" placeholder="+212 6XX XXX XXX"/>
                      <Inp k="email" label="Email" type="email" placeholder="votre@email.ma"/>
                    </div>
                    <p style={{ color: "var(--text-faint)", fontSize: 13, border: "1px solid var(--bg-off)", background: "var(--bg-off)", padding: "12px 16px", margin: 0 }}>
                      En soumettant, vous acceptez nos <a href="#" style={{ color: "var(--accent-blue)" }}>conditions d'utilisation</a> et notre <a href="#" style={{ color: "var(--accent-blue)" }}>politique de confidentialité</a>.
                    </p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <button type="button" onClick={() => setStep(2)} className="btn-secondary">← Retour</button>
                      <button type="submit" className="btn-primary">Publier l'annonce</button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { title: "Estimation instantanée", desc: "Résultat basé sur les données réelles du marché marocain.", color: "var(--accent-blue)" },
              { title: "Photos guidées", desc: "Notre interface vous guide pour des photos professionnelles.", color: "#28A745" },
              { title: "100% Gratuit", desc: "La publication est entièrement gratuite pour les particuliers.", color: "#6610F2" },
              { title: "Processus sécurisé", desc: "Acheteurs vérifiés, messagerie chiffrée et gestion des formalités.", color: "#E83E8C" },
            ].map(item => (
              <div key={item.title} style={{ padding: "20px 20px", background: "var(--bg-off)", borderLeft: `4px solid ${item.color}` }}>
                <p style={{ fontWeight: 700, margin: "0 0 6px", color: "var(--text-primary)" }}>{item.title}</p>
                <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0, lineHeight: "21px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:767px){.sell-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
