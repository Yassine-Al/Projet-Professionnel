import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axios";

export default function Register() {
  const [form, setForm] = useState({ name:"", email:"", password:"", password_confirmation:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) { setError("Les mots de passe ne correspondent pas."); return; }
    setLoading(true); setError("");
    try {
      await axiosClient.post("/register", form);
      navigate("/Login");
    } catch (err) {
      setError(err.response?.data?.message || "Inscription échouée. Réessayez.");
    } finally { setLoading(false); }
  };

  const Field = ({ label, k, type="text", placeholder }) => (
    <div>
      <label className="form-label">{label}</label>
      <input type={type} value={form[k]} onChange={set(k)} placeholder={placeholder} required
        className="input-field" style={{ fontSize: 15 }}/>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-off)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 16px" }}>
      <div style={{ width: "100%", maxWidth: 520 }} className="anim-up">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: "none", display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 52, height: 52, background: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
              </svg>
            </div>
            <span style={{ fontFamily: "Manrope,sans-serif", fontWeight: 800, fontSize: 22, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
              ocazz<span style={{ color: "var(--accent-blue)" }}>.ma</span>
            </span>
          </Link>
          <p style={{ color: "var(--text-muted)", fontSize: 15, marginTop: 8, marginBottom: 0 }}>Créez votre compte gratuitement</p>
        </div>

        {/* Card */}
        <div style={{ background: "var(--bg-white)", border: "1px solid var(--border)", padding: "40px 36px" }}>
          {error && (
            <div style={{ background: "#FFF5F5", border: "1px solid var(--error)", borderLeft: "4px solid var(--error)", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
              <svg width="16" height="16" fill="none" stroke="var(--error)" viewBox="0 0 24 24" strokeWidth={2} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span style={{ color: "var(--error)", fontSize: 14 }}>{error}</span>
            </div>
          )}

          <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Nom complet" k="name" placeholder="Mohamed Alami"/>
            <Field label="Adresse email" k="email" type="email" placeholder="votre@email.ma"/>
            <Field label="Mot de passe" k="password" type="password" placeholder="Minimum 8 caractères"/>
            <Field label="Confirmer le mot de passe" k="password_confirmation" type="password" placeholder="Répéter le mot de passe"/>

            {/* Password strength hint */}
            <p style={{ color: "var(--text-faint)", fontSize: 12, margin: 0, background: "var(--bg-off)", padding: "10px 14px" }}>
              Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.
            </p>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: 4 }}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="anim-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                  Création…
                </span>
              ) : "Créer mon compte"}
            </button>
          </form>

          <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid var(--bg-off)", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
              Déjà inscrit ?{" "}
              <Link to="/Login" style={{ color: "var(--accent-blue)", fontWeight: 600, textDecoration: "none" }}>Se connecter</Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-faint)", fontSize: 12, marginTop: 20 }}>
          En vous inscrivant, vous acceptez nos{" "}
          <a href="#" style={{ color: "inherit" }}>Conditions d'utilisation</a> et notre{" "}
          <a href="#" style={{ color: "inherit" }}>Politique de confidentialité</a>.
        </p>
      </div>
    </div>
  );
}