import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import cutteryt from "../assets/cutteryt.mp4";
import { axiosClient } from "../api/axios";


const BRANDS     = ["Dacia", "Volkswagen", "BMW", "Renault", "Peugeot", "Toyota", "Mercedes", "Hyundai", "Ford", "Kia"];
const ALL_BRANDS = ["Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai", "Kia", "Land Rover",
  "Mercedes", "Nissan", "Opel", "Peugeot", "Renault", "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo"];

const TRUST = [
  { title: "Annonces vérifiées", desc: "Chaque annonce est contrôlée par notre équipe pour garantir l'authenticité des informations et protéger les acheteurs.", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title: "Messagerie sécurisée", desc: "Communiquez directement avec les vendeurs via notre système de messagerie intégré, chiffré et sécurisé.", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { title: "Estimation par IA", desc: "Notre moteur de Machine Learning analyse le marché marocain en temps réel pour vous donner une estimation de prix précise.", icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
];

const STATS = [
  { val: "12 000+", label: "Annonces actives" },
  { val: "98%", label: "Taux de satisfaction" },
  { val: "48h", label: "Délai moyen de vente" },
  { val: "50k+", label: "Utilisateurs inscrits" },
];

function CarCard({ car }) {
  const img   = car.images?.[0]?.url;
  const price = Number(car.price).toLocaleString("fr-MA");
  const km    = Number(car.mileage).toLocaleString("fr-MA");
  return (
    <Link to={`/cars/${car.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseOver={e => { e.currentTarget.querySelector(".card-img")?.style && (e.currentTarget.querySelector(".card-img").style.transform = "scale(1.05)"); e.currentTarget.style.boxShadow = "var(--shadow-2)"; }}
      onMouseOut={e => { e.currentTarget.querySelector(".card-img")?.style && (e.currentTarget.querySelector(".card-img").style.transform = "scale(1)"); e.currentTarget.style.boxShadow = "none"; }}
      style={{ border: "1px solid var(--border)", background: "var(--bg-white)", transition: "box-shadow 0.2s ease" }}>
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "var(--bg-off)" }}>
        {img ? (
          <img className="card-img" src={img} alt={`${car.brand} ${car.model}`} referrerPolicy="no-referrer"
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="48" height="48" fill="none" stroke="var(--border)" strokeWidth={1.2} viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }} />
        {car.city && <span className="badge-dark" style={{ position: "absolute", top: 12, right: 12, fontSize: 11 }}>{car.city}</span>}
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>{car.model_year} · {car.fuel_type} · {km} km</p>
        <h4 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 12px", color: "var(--text-primary)" }}>{car.brand} {car.model}</h4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-blue)" }}>{price}</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>MAD</span>
          </div>
          <span style={{ color: "var(--accent-blue)", fontSize: 13, fontWeight: 600 }}>Voir →</span>
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg-white)" }}>
      <div style={{ height: 200, background: "var(--bg-off)" }} />
      <div style={{ padding: 20 }}>
        <div style={{ height: 12, width: "60%", background: "var(--bg-off)", marginBottom: 10 }} />
        <div style={{ height: 16, width: "80%", background: "var(--bg-off)", marginBottom: 14 }} />
        <div style={{ height: 20, width: "40%", background: "var(--bg-off)" }} />
      </div>
    </div>
  );
}

export default function Acceuil() {
  const [query,       setQuery]       = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg,    setShowSugg]    = useState(false);
  const [featured,    setFeatured]    = useState([]);
  const [featLoading, setFeatLoading] = useState(true);
  const navigate     = useNavigate();
  const debounceRef  = useRef(null);
  const inputWrapRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (inputWrapRef.current && !inputWrapRef.current.contains(e.target)) {
        setShowSugg(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    axiosClient.get("/annonces", { params: { status: "approved", per_page: 4, sort: "created_at", dir: "desc" } })
      .then(res => setFeatured(res.data.data ?? []))
      .catch(() => setFeatured([]))
      .finally(() => setFeatLoading(false));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        } else {
          entry.target.classList.remove("in-view");
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(".scroll-section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleSearchInput = (value) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    if (value.length < 2) { setSuggestions([]); setShowSugg(false); return; }

    const lower = value.toLowerCase();
    const brandMatches = ALL_BRANDS
      .filter(b => b.toLowerCase().includes(lower))
      .slice(0, 4);

    debounceRef.current = setTimeout(() => {
      axiosClient.get("/annonces", { params: { search: value, per_page: 8, status: "approved" } })
        .then(res => {
          const seen = new Set(brandMatches.map(b => b.toLowerCase()));
          const modelSuggs = [];
          res.data.data.forEach(car => {
            const key = `${car.brand} ${car.model}`;
            if (!seen.has(key.toLowerCase())) {
              seen.add(key.toLowerCase());
              modelSuggs.push({ label: key, type: "model" });
            }
          });
          const all = [
            ...brandMatches.map(b => ({ label: b, type: "brand" })),
            ...modelSuggs.slice(0, 5),
          ];
          setSuggestions(all);
          setShowSugg(all.length > 0);
        })
        .catch(() => {
          const all = brandMatches.map(b => ({ label: b, type: "brand" }));
          setSuggestions(all);
          setShowSugg(all.length > 0);
        });
    }, 220);
  };

  const selectSuggestion = (val) => {
    clearTimeout(debounceRef.current);
    setShowSugg(false);
    navigate(`/Marketplace?q=${encodeURIComponent(val)}`);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", marginTop: "-80px", paddingTop: "80px" }}>
        <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "hidden", background: "#000" }}>
          <video
            src={cutteryt}
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.8 }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" }} />

        <div className="container" style={{ position: "relative", paddingTop: 120, paddingBottom: 120 }}>
          <div style={{ maxWidth: 640 }} className="anim-up">
            <div className="badge-primary" style={{ marginBottom: 20, fontSize: 12, letterSpacing: "0.5px" }}>
              N°1 au Maroc pour les véhicules d'occasion
            </div>
            <h1 style={{ color: "#fff", marginBottom: 20, fontSize: "clamp(36px, 5vw, 56px)" }}>
              Achetez & vendez votre voiture en toute confiance
            </h1>
            <p style={{ color: "#ccc", fontSize: 18, lineHeight: "27px", marginBottom: 40, maxWidth: 520 }}>
              Des milliers d'annonces vérifiées, une messagerie sécurisée et une IA d'estimation de prix pour un marché automobile transparent.
            </p>

            {/* Search bar */}
            <div ref={inputWrapRef} style={{ position: "relative", maxWidth: 560 }}>
              <form onSubmit={e => { e.preventDefault(); setShowSugg(false); navigate(`/Marketplace${query ? `?q=${encodeURIComponent(query)}` : ""}`); }}
                style={{
                  display: "flex",
                  background: "#fff",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                  overflow: "hidden",
                }}>
                <input
                  type="text"
                  value={query}
                  onChange={e => handleSearchInput(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                  placeholder="Rechercher une marque, un modèle…"
                  autoComplete="off"
                  style={{
                    flex: 1,
                    height: 52,
                    padding: "0 20px",
                    border: "none",
                    outline: "none",
                    fontFamily: "Inter, sans-serif",
                    fontSize: 14,
                    fontWeight: 400,
                    color: "var(--text-secondary)",
                    background: "transparent",
                  }}
                />
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flexShrink: 0, padding: "0 28px", height: 52, lineHeight: "52px" }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Rechercher
                </button>
              </form>

              {showSugg && suggestions.length > 0 && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, right: 0,
                  background: "#fff",
                  borderTop: "1px solid #eee",
                  zIndex: 100,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                }}>
                  {suggestions.map((s, i) => (
                    <div
                      key={i}
                      onMouseDown={() => selectSuggestion(s.label)}
                      style={{
                        padding: "10px 16px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        borderBottom: i < suggestions.length - 1 ? "1px solid #f0f0f0" : "none",
                        fontSize: 14,
                        color: "var(--text-primary)",
                      }}
                      onMouseOver={e => e.currentTarget.style.background = "#f7f9fc"}
                      onMouseOut={e => e.currentTarget.style.background = "transparent"}
                    >
                      <svg width="14" height="14" fill="none" stroke="#aaa" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                        {s.type === "brand"
                          ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                          : <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                        }
                      </svg>
                      <span style={{ flex: 1 }}>{s.label}</span>
                      {s.type === "brand" && (
                        <span style={{ fontSize: 11, color: "#aaa", background: "#f0f0f0", padding: "2px 6px" }}>
                          Marque
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 40, marginTop: 48, flexWrap: "wrap" }} className="anim-up-1">
              {STATS.map(({ val, label }) => (
                <div key={label}>
                  <p style={{ color: "#fff", fontWeight: 800, fontSize: 28, margin: 0 }}>{val}</p>
                  <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Search Filters ── */}
      <section className="scroll-section" style={{ background: "var(--accent-blue)", padding: "0" }}>
        <div className="container" style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {BRANDS.map(b => (
            <Link key={b} to={`/Marketplace?make=${b}`}
              style={{ flexShrink: 0, padding: "0 20px", height: 52, lineHeight: "52px", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500, textDecoration: "none", borderRight: "1px solid rgba(255,255,255,0.15)", whiteSpace: "nowrap", transition: "background 0.15s, color 0.15s" }}
              onMouseOver={e => { e.target.style.background = "rgba(255,255,255,0.15)"; e.target.style.color = "#fff"; }}
              onMouseOut={e => { e.target.style.background = "transparent"; e.target.style.color = "rgba(255,255,255,0.8)"; }}>
              {b}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Listings ── */}
      <section className="scroll-section" style={{ padding: "80px 0", background: "var(--bg-white)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 40 }}>
            <div>
              <p style={{ color: "var(--accent-blue)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Annonces récentes</p>
              <h2 style={{ margin: 0 }}>Véhicules à la une</h2>
            </div>
            <Link to="/Marketplace" className="btn-ghost" style={{ height: "auto", lineHeight: "normal", padding: 0, fontSize: 15, color: "var(--accent-blue)" }}>
              Voir toutes les annonces →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {featLoading
              ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
              : featured.map(car => <CarCard key={car.id} car={car} />)
            }
          </div>
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link to="/Marketplace" className="btn-primary" style={{ fontSize: 16, padding: "0 48px", height: 52, lineHeight: "52px", display: "inline-block" }}>
              Voir toutes les annonces
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Section ── */}
      <section className="scroll-section" style={{ padding: "80px 0", background: "var(--bg-off)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ color: "var(--accent-blue)", fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Pourquoi ocazz.ma</p>
            <h2 style={{ margin: 0 }}>La confiance, notre priorité</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 1 }}>
            {TRUST.map((item, i) => (
              <div key={item.title} className={`anim-up-${i + 1}`}
                style={{ background: "var(--bg-white)", padding: "40px 32px", borderLeft: i === 0 ? "4px solid var(--accent-blue)" : "1px solid var(--bg-off)" }}>
                <div style={{ width: 52, height: 52, background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <svg width="26" height="26" fill="none" stroke="var(--accent-blue)" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <h4 style={{ margin: "0 0 12px" }}>{item.title}</h4>
                <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 15, lineHeight: "22.5px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Estimator CTA ── */}
      <section className="scroll-section" style={{ padding: "80px 0", background: "var(--bg-white)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, border: "1px solid var(--border)" }} className="responsive-grid">
            <div style={{ background: "var(--accent-blue)", padding: "72px 52px", color: "#fff" }}>
              <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16, opacity: 0.8 }}>Powered by Machine Learning</p>
              <h2 style={{ color: "#fff", margin: "0 0 20px" }}>Combien vaut votre voiture ?</h2>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, lineHeight: "24px", marginBottom: 32 }}>
                Obtenez une estimation gratuite et précise en secondes grâce à notre moteur IA entraîné sur des milliers de transactions marocaines.
              </p>
              <Link to="/Predict" style={{ background: "#fff", color: "var(--accent-blue)", padding: "0 32px", height: 60, lineHeight: "60px", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, fontSize: 15, textDecoration: "none", transition: "background 0.15s" }}
                onMouseOver={e => e.currentTarget.style.background = "var(--bg-off)"}
                onMouseOut={e => e.currentTarget.style.background = "#fff"}>
                Estimer maintenant →
              </Link>
            </div>
            <div style={{ background: "var(--bg-off)", padding: "72px 52px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 24, color: "var(--text-muted)" }}>Facteurs analysés par notre IA</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {["Marque & Modèle", "Année", "Kilométrage", "Carburant", "Boîte de vitesse", "Ville", "État général", "Saison"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 8, height: 8, background: "var(--accent-blue)", flexShrink: 0 }} />
                    <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sell CTA ── */}
      <section className="scroll-section" style={{ padding: "80px 0", background: "var(--bg-dark)" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ color: "#fff", margin: "0 0 16px" }}>Prêt à vendre votre voiture ?</h2>
          <p style={{ color: "#888", fontSize: 18, marginBottom: 40, maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Publiez votre annonce gratuitement en moins de 5 minutes et touchez des milliers d'acheteurs qualifiés.
          </p>
          <Link to="/sell" className="btn-primary" style={{ fontSize: 16 }}>Déposer une annonce gratuite</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 767px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}