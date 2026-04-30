import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import cutteryt from "../assets/cutteryt.mp4";

const FEATURED = [
  { id:1, year:2021, make:"Dacia", model:"Duster Prestige", price:148000, mileage:42000, fuel:"Diesel", city:"Casablanca", tag:"En vedette", img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop&q=80" },
  { id:2, year:2020, make:"Volkswagen", model:"Golf 8 R-Line", price:210000, mileage:28000, fuel:"Essence", city:"Rabat", tag:"Nouveau", img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" },
  { id:3, year:2022, make:"BMW", model:"Série 3 320d", price:385000, mileage:15000, fuel:"Diesel", city:"Marrakech", tag:"Premium", img:"https://images.unsplash.com/photo-1580273916550-22f79a72d97d?w=600&auto=format&fit=crop&q=80" },
  { id:4, year:2019, make:"Renault", model:"Clio 5 Intens", price:98000, mileage:67000, fuel:"Essence", city:"Fès", tag:"Bonne affaire", img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format&fit=crop&q=80" },
];

const BRANDS = ["Dacia","Volkswagen","BMW","Renault","Peugeot","Toyota","Mercedes","Hyundai","Ford","Kia"];

const TRUST = [
  { title:"Annonces vérifiées", desc:"Chaque annonce est contrôlée par notre équipe pour garantir l'authenticité des informations et protéger les acheteurs.", icon:"M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { title:"Messagerie sécurisée", desc:"Communiquez directement avec les vendeurs via notre système de messagerie intégré, chiffré et sécurisé.", icon:"M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  { title:"Estimation par IA", desc:"Notre moteur de Machine Learning analyse le marché marocain en temps réel pour vous donner une estimation de prix précise.", icon:"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" },
];

const STATS = [
  { val:"12 000+", label:"Annonces actives" },
  { val:"98%", label:"Taux de satisfaction" },
  { val:"48h", label:"Délai moyen de vente" },
  { val:"50k+", label:"Utilisateurs inscrits" },
];

function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}
      onMouseOver={e => { e.currentTarget.querySelector(".card-img").style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "var(--shadow-2)"; }}
      onMouseOut={e => { e.currentTarget.querySelector(".card-img").style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
      style={{ border: "1px solid var(--border)", background: "var(--bg-white)", transition: "box-shadow 0.2s ease" }}>
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img className="card-img" src={car.img} alt={`${car.make} ${car.model}`}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)" }}/>
        <span className="badge-primary" style={{ position: "absolute", top: 12, left: 12 }}>{car.tag}</span>
        <span className="badge-dark" style={{ position: "absolute", top: 12, right: 12, fontSize: 11 }}>{car.city}</span>
      </div>
      <div style={{ padding: 20 }}>
        <p style={{ color: "var(--text-muted)", fontSize: 12, marginBottom: 4 }}>{car.year} · {car.fuel} · {car.mileage.toLocaleString()} km</p>
        <h4 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 12px", color: "var(--text-primary)" }}>{car.make} {car.model}</h4>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 22, fontWeight: 800, color: "var(--accent-blue)" }}>{car.price.toLocaleString()}</span>
            <span style={{ fontSize: 13, color: "var(--text-muted)", marginLeft: 4 }}>MAD</span>
          </div>
          <span style={{ color: "var(--accent-blue)", fontSize: 13, fontWeight: 600 }}>Voir →</span>
        </div>
      </div>
    </Link>
  );
}

export default function Acceuil() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

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
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)" }}/>

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
            <form onSubmit={e => { e.preventDefault(); navigate(`/Marketplace${query ? `?q=${encodeURIComponent(query)}` : ""}`); }}
              style={{ display: "flex", maxWidth: 540, background: "#fff" }}>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Rechercher une marque, un modèle…"
                style={{ flex: 1, height: 60, padding: "0 20px", border: "none", outline: "none", fontFamily: "Manrope, sans-serif", fontSize: 15, color: "var(--text-secondary)" }}/>
              <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: "0 28px", borderRadius: 0 }}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                Rechercher
              </button>
            </form>

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
            {FEATURED.map(car => <CarCard key={car.id} car={car}/>)}
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
              <div key={item.title} className={`anim-up-${i+1}`}
                style={{ background: "var(--bg-white)", padding: "40px 32px", borderLeft: i === 0 ? "4px solid var(--accent-blue)" : "1px solid var(--bg-off)" }}>
                <div style={{ width: 52, height: 52, background: "#EBF3FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <svg width="26" height="26" fill="none" stroke="var(--accent-blue)" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon}/>
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
                {["Marque & Modèle","Année","Kilométrage","Carburant","Boîte de vitesse","Ville","État général","Saison"].map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 8, height: 8, background: "var(--accent-blue)", flexShrink: 0 }}/>
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