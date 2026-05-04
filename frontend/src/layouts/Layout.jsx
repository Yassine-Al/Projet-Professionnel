import { Outlet, Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const NAV = [
  { label: "Accueil", path: "/" },
  { label: "Acheter une voiture", path: "/Marketplace" },
  { label: "Vendre une voiture", path: "/sell" },
  { label: "Estimation de prix", path: "/Predict" },
];

function Logo() {
  return (
    <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, background: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
          <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
        </svg>
      </div>
      <span style={{ fontFamily: "Manrope, sans-serif", fontWeight: 800, fontSize: 20, color: "#fff", letterSpacing: "-0.3px" }}>
        ocazz<span style={{ color: "var(--accent-blue)" }}>.ma</span>
      </span>
    </Link>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-white)" }}>
      {/* ── Header ── */}
      <header style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 100, 
        background: isScrolled || !isHome ? "rgba(0, 0, 0, 0.9)" : "transparent",
        backdropFilter: isScrolled || !isHome ? "blur(10px)" : "none",
        transition: "background 0.3s ease, backdrop-filter 0.3s ease",
        borderBottom: "none", 
        height: 80 
      }}>
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Logo />

          {/* Desktop Nav */}
          <nav style={{ display: "flex", alignItems: "center" }} className="hide-mobile">
            {NAV.map(({ label, path }) => (
              <Link key={label} to={path} className={`nav-link ${location.pathname === path ? "active" : ""}`} style={{ color: location.pathname === path ? "var(--brand-blue)" : "#fff" }}>
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }} className="hide-mobile">
            <Link to="/Login" className="btn-ghost" style={{ height: 44, lineHeight: "44px", padding: "0 16px", fontSize: 15, color: "#fff" }}>
              Connexion
            </Link>
            <Link to="/Register" className="btn-primary" style={{ height: 44, lineHeight: "44px", padding: "0 24px", fontSize: 15 }}>
              Créer un compte
            </Link>
          </div>

          {/* Hamburger */}
          <button onClick={() => setOpen(!open)} style={{ display: "none", width: 44, height: 44, background: "none", border: "none", cursor: "pointer", alignItems: "center", justifyContent: "center", color: "#fff" }} className="show-mobile-flex">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div style={{ background: "#000", borderTop: "1px solid #333", padding: "16px 16px 24px" }} className="anim-fade">
            {NAV.map(({ label, path }) => (
              <Link key={label} to={path} onClick={() => setOpen(false)}
                style={{ display: "block", padding: "14px 0", color: location.pathname === path ? "var(--brand-blue)" : "#fff", fontWeight: location.pathname === path ? 600 : 400, fontSize: 17, textDecoration: "none", borderBottom: "1px solid #333" }}>
                {label}
              </Link>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <Link to="/Login" onClick={() => setOpen(false)} className="btn-secondary" style={{ flex: 1, height: 48, lineHeight: "48px", fontSize: 14, textAlign: "center" }}>Connexion</Link>
              <Link to="/Register" onClick={() => setOpen(false)} className="btn-primary" style={{ flex: 1, height: 48, lineHeight: "48px", fontSize: 14, textAlign: "center" }}>Inscription</Link>
            </div>
          </div>
        )}
      </header>

      {/* ── Page Content ── */}
      <main style={{ flex: 1 }}><Outlet /></main>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--bg-dark)", color: "#fff", paddingTop: 60, paddingBottom: 40 }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 32, height: 32, background: "var(--accent-blue)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/><circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/></svg>
                </div>
                <span style={{ fontWeight: 800, fontSize: 18 }}>ocazz<span style={{ color: "var(--accent-blue)" }}>.ma</span></span>
              </div>
              <p style={{ color: "#888", fontSize: 14, lineHeight: "21px", maxWidth: 260 }}>La plateforme marocaine de référence pour l'achat et la vente de véhicules d'occasion.</p>
            </div>
            {[
              { title: "Plateforme", links: ["À propos", "Comment ça marche", "Espace revendeur", "Blog"] },
              { title: "Légal", links: ["Conditions d'utilisation", "Politique de confidentialité", "Cookies"] },
              { title: "Support", links: ["Centre d'aide", "Contact", "FAQ", "Signaler une annonce"] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#fff", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {links.map(l => <li key={l} style={{ marginBottom: 10 }}><a href="#" style={{ color: "#888", fontSize: 14, textDecoration: "none", transition: "color 0.15s" }} onMouseOver={e => e.target.style.color="#fff"} onMouseOut={e => e.target.style.color="#888"}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #333", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#555", fontSize: 13 }}>© {new Date().getFullYear()} ocazz.ma — Tous droits réservés.</p>
            <div style={{ display: "flex", gap: 20 }}>
              {["Facebook", "Instagram", "Twitter"].map(s => <a key={s} href="#" style={{ color: "#555", fontSize: 13, textDecoration: "none" }}>{s}</a>)}
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .hide-mobile { display: flex !important; }
        .show-mobile-flex { display: none !important; }
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .show-mobile-flex { display: flex !important; }
        }
      `}</style>
    </div>
  );
}