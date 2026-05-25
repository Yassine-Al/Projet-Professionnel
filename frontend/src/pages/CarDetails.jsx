import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { axiosClient } from "../api/axios";

function Spec({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ background:"var(--bg-off)", padding:"16px 12px", borderLeft:"3px solid var(--accent-blue)" }}>
      <p style={{ color:"var(--text-faint)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 4px" }}>{label}</p>
      <p style={{ fontWeight:700, fontSize:15, margin:0, color:"var(--text-primary)" }}>{value}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{ background:"var(--bg-white)", minHeight:"100vh", paddingBottom:60 }}>
      <div style={{ background:"var(--bg-off)", borderBottom:"1px solid var(--border)", padding:"14px 0" }}>
        <div className="container" style={{ height:20, width:300, background:"var(--border)" }}/>
      </div>
      <div className="container" style={{ paddingTop:40 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32 }} className="details-grid">
          <div>
            <div style={{ height:420, background:"var(--bg-off)", marginBottom:24 }}/>
            <div style={{ height:200, background:"var(--bg-off)", marginBottom:24 }}/>
          </div>
          <div style={{ height:300, background:"var(--bg-off)" }}/>
        </div>
      </div>
    </div>
  );
}

export default function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [msg, setMsg]           = useState("");
  const [sent, setSent]         = useState(false);
  const [sending, setSending]   = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosClient.get(`/annonces/${id}`)
      .then(res => { setCar(res.data); setLoading(false); })
      .catch(err => {
        setLoading(false);
        if (err.response?.status === 404) setNotFound(true);
      });
  }, [id]);

  if (loading) return <Skeleton />;

  if (notFound || !car) {
    return (
      <div style={{ minHeight:"60vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:16 }}>
        <h2>Annonce introuvable</h2>
        <Link to="/Marketplace" className="btn-primary">Voir les annonces</Link>
      </div>
    );
  }

  const imgs  = car.images?.map(i => i.url) ?? [];
  const price = Number(car.price).toLocaleString("fr-MA");
  const km    = Number(car.mileage).toLocaleString("fr-MA");

  const opts = car.options ?? {};
  const LABELS = {
    abs:"ABS", airbags:"Airbags", bluetooth:"Bluetooth", camera_recul:"Caméra de recul",
    climatisation:"Climatisation", esp:"ESP", jantes_alu:"Jantes aluminium",
    limiteur_vitesse:"Limiteur de vitesse", ordinateur_bord:"Ordinateur de bord",
    radar_recul:"Radar de recul", regulateur:"Régulateur de vitesse",
    sieges_cuir:"Sièges cuir", gps:"GPS", toit_ouvrant:"Toit ouvrant",
    verrouillage:"Verrouillage centralisé", vitres_electriques:"Vitres électriques",
  };
  const features = Object.entries(opts).filter(([,v]) => v).map(([k]) => LABELS[k] ?? k);

  const user = (() => { try { return JSON.parse(localStorage.getItem("user")); } catch { return null; } })();

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!user) { navigate(`/Login?redirect=/cars/${id}`); return; }
    setSending(true);
    try {
      await axiosClient.post("/conversations", { annonce_id: car.id, message: msg });
      setSent(true);
    } catch {
      // conversation may already exist — still navigate to messages
      navigate("/messages");
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{ background:"var(--bg-white)", minHeight:"100vh", paddingBottom:60 }}>
      {/* Breadcrumb */}
      <div style={{ background:"var(--bg-off)", borderBottom:"1px solid var(--border)", padding:"14px 0" }}>
        <div className="container" style={{ display:"flex", gap:8, alignItems:"center", fontSize:14, color:"var(--text-muted)" }}>
          <Link to="/" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Accueil</Link>
          <span>/</span>
          <Link to="/Marketplace" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Annonces</Link>
          <span>/</span>
          <span style={{ color:"var(--text-primary)", fontWeight:600 }}>{car.model_year} {car.brand} {car.model}</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop:40 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32, alignItems:"start" }} className="details-grid">

          {/* Left */}
          <div>
            {/* Gallery */}
            <div style={{ border:"1px solid var(--border)", marginBottom:24 }}>
              {imgs.length > 0 ? (
                <>
                  <div style={{ position:"relative", height:420, overflow:"hidden", background:"var(--bg-off)" }}>
                    <img src={imgs[activeImg]} alt={`${car.brand} ${car.model}`}
                      referrerPolicy="no-referrer"
                      style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    <div style={{ position:"absolute", bottom:12, right:12, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:12, padding:"4px 10px", fontFamily:"Manrope,sans-serif" }}>
                      {activeImg+1} / {imgs.length}
                    </div>
                    {imgs.length > 1 && <>
                      <button onClick={() => setActiveImg(i => (i-1+imgs.length)%imgs.length)}
                        style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:40, height:40, background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                      </button>
                      <button onClick={() => setActiveImg(i => (i+1)%imgs.length)}
                        style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:40, height:40, background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                      </button>
                    </>}
                  </div>
                  {imgs.length > 1 && (
                    <div style={{ display:"flex", gap:4, padding:8, background:"var(--bg-off)" }}>
                      {imgs.map((src, i) => (
                        <button key={i} onClick={() => setActiveImg(i)}
                          style={{ flex:1, height:64, padding:0, border:activeImg===i?"2px solid var(--accent-blue)":"2px solid transparent", cursor:"pointer", overflow:"hidden", opacity:activeImg===i?1:0.55, transition:"opacity 0.15s, border-color 0.15s" }}>
                          <img src={src} alt="" referrerPolicy="no-referrer" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div style={{ height:420, background:"var(--bg-off)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="64" height="64" fill="none" stroke="var(--border)" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
                    <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
                  </svg>
                </div>
              )}
            </div>

            {/* Specs */}
            <div style={{ border:"1px solid var(--border)", padding:"24px 24px 28px", marginBottom:24 }}>
              <h3 style={{ fontSize:22, margin:"0 0 20px" }}>Caractéristiques</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:12 }}>
                <Spec label="Année"       value={car.model_year} />
                <Spec label="Kilométrage" value={`${km} km`} />
                <Spec label="Carburant"   value={car.fuel_type} />
                <Spec label="Boîte"       value={car.transmission} />
                <Spec label="État"        value={car.car_condition} />
                <Spec label="Puissance"   value={car.fiscal_power} />
                <Spec label="Origine"     value={car.origin} />
                <Spec label="Ville"       value={car.city} />
                {car.doors && <Spec label="Portes" value={car.doors} />}
                {car.first_hand && <Spec label="Première main" value="Oui" />}
              </div>
            </div>

            {/* Description */}
            <div style={{ border:"1px solid var(--border)", padding:"24px", marginBottom:24 }}>
              <h3 style={{ fontSize:22, margin:"0 0 16px" }}>Description</h3>
              <p style={{ color:"var(--text-secondary)", lineHeight:"24px", margin:0, whiteSpace:"pre-line" }}>{car.description}</p>
            </div>

            {/* Equipment options */}
            {features.length > 0 && (
              <div style={{ border:"1px solid var(--border)", padding:"24px" }}>
                <h3 style={{ fontSize:22, margin:"0 0 20px" }}>Équipements</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  {features.map(f => (
                    <div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid var(--bg-off)" }}>
                      <div style={{ width:8, height:8, background:"var(--accent-blue)", flexShrink:0 }}/>
                      <span style={{ fontSize:14, color:"var(--text-secondary)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ position:"sticky", top:100 }}>
            {/* Price card */}
            <div style={{ border:"1px solid var(--border)", padding:"24px", marginBottom:20 }}>
              {car.city && <p style={{ color:"var(--text-muted)", fontSize:13, margin:"0 0 8px" }}>{car.city}</p>}
              <h2 style={{ margin:"0 0 4px", fontSize:20 }}>{car.model_year} {car.brand} {car.model}</h2>
              <p style={{ fontSize:36, fontWeight:800, color:"var(--accent-blue)", margin:"12px 0 4px" }}>
                {price}<span style={{ fontSize:16, color:"var(--text-muted)", fontWeight:400, marginLeft:6 }}>MAD</span>
              </p>
              <p style={{ color:"var(--text-muted)", fontSize:13, margin:"0 0 20px" }}>{km} km · {car.fuel_type}</p>
              <Link to="/messages" className="btn-primary" style={{ display:"block", textAlign:"center", marginBottom:8 }}>
                Contacter le vendeur
              </Link>
            </div>

            {/* Message form */}
            <div style={{ border:"1px solid var(--border)", padding:"24px" }}>
              <h4 style={{ margin:"0 0 4px", fontSize:18 }}>Envoyer un message</h4>
              <p style={{ color:"var(--text-muted)", fontSize:13, margin:"0 0 20px" }}>Posez une question directement au vendeur.</p>
              {sent ? (
                <div style={{ textAlign:"center", padding:"24px 0" }}>
                  <div style={{ width:48, height:48, background:"#E8F5E9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                    <svg width="24" height="24" fill="none" stroke="var(--success)" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p style={{ fontWeight:700, margin:"0 0 4px" }}>Message envoyé !</p>
                  <Link to="/messages" style={{ color:"var(--accent-blue)", fontSize:13, fontWeight:600, textDecoration:"none" }}>Voir mes messages →</Link>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <textarea required value={msg} onChange={e => setMsg(e.target.value)}
                    placeholder={`Intéressé par ce ${car.brand} ${car.model}…`}
                    className="textarea-field" style={{ fontSize:14, minHeight:100 }}/>
                  <button type="submit" disabled={sending} className="btn-primary" style={{ width:"100%" }}>
                    {user ? (sending ? "Envoi…" : "Envoyer") : "Se connecter pour écrire"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:767px){.details-grid{grid-template-columns:1fr !important;}}`}</style>
    </div>
  );
}
