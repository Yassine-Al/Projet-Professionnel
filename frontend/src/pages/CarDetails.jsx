import { useState } from "react";
import { useParams, Link } from "react-router-dom";

const DB = {
  1:{ id:1,year:2021,make:"Dacia",model:"Duster Prestige",price:148000,mileage:42000,fuel:"Diesel",trans:"Manuelle",body:"SUV",color:"Gris Comète",city:"Casablanca",owners:1,vin:"VF1RJAL0H63742100",
    imgs:["https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1503736334-7b56d08ee7e0?w=900&auto=format&fit=crop&q=80"],
    desc:"Dacia Duster Prestige en excellent état. Carnet d'entretien complet chez le concessionnaire. Véhicule de première main, non fumeur. Révision faite il y a 3 000 km. Pneus neufs. Disponible immédiatement.",
    features:["Climatisation automatique","GPS intégré","Régulateur de vitesse","Caméra de recul","Sièges chauffants","Bluetooth","Radar de stationnement","Jantes aluminium 17\""] },
  2:{ id:2,year:2020,make:"Volkswagen",model:"Golf 8 R-Line",price:210000,mileage:28000,fuel:"Essence",trans:"Automatique",body:"Berline",color:"Blanc Nacré",city:"Rabat",owners:1,vin:"WVWZZZAUZKW123456",
    imgs:["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&auto=format&fit=crop&q=80","https://images.unsplash.com/photo-1580273916550-22f79a72d97d?w=900&auto=format&fit=crop&q=80"],
    desc:"Golf 8 R-Line en parfait état. Toutes les options de la finition R-Line. Entretien exclusivement chez VW Maroc. Non accidentée, une seule main.",
    features:["Pack R-Line","Toit ouvrant panoramique","Sièges sport","Matrix LED","Drive Mode Select","Park Assist","Keyless","Harman Kardon"] },
  3:{ id:3,year:2022,make:"BMW",model:"Série 3 320d",price:385000,mileage:15000,fuel:"Diesel",trans:"Automatique",body:"Berline",color:"Bleu Portimao",city:"Marrakech",owners:1,vin:"WBA5R3103LFH12345",
    imgs:["https://images.unsplash.com/photo-1580273916550-22f79a72d97d?w=900&auto=format&fit=crop&q=80"],
    desc:"BMW Série 3 320d M Sport quasi-neuve, garantie constructeur valable. Options haut de gamme. Importée neuve au Maroc.",
    features:["Pack M Sport","Jantes M 19\"","Affichage tête haute","Live Cockpit Pro","Siège électrique","BMW ConnectedDrive","Vitres athermiques","Aide au maintien voie"] },
};

function Spec({ label, value }) {
  return (
    <div style={{ background:"var(--bg-off)", padding:"16px 12px", borderLeft:"3px solid var(--accent-blue)" }}>
      <p style={{ color:"var(--text-faint)", fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.5px", margin:"0 0 4px" }}>{label}</p>
      <p style={{ fontWeight:700, fontSize:15, margin:0, color:"var(--text-primary)" }}>{value}</p>
    </div>
  );
}

export default function CarDetails() {
  const { id } = useParams();
  const car = DB[id] || DB[1];
  const [activeImg, setActiveImg] = useState(0);
  const [form, setForm] = useState({ name:"", phone:"", msg:"" });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ background:"var(--bg-white)", minHeight:"100vh", paddingBottom:60 }}>
      {/* Breadcrumb */}
      <div style={{ background:"var(--bg-off)", borderBottom:"1px solid var(--border)", padding:"14px 0" }}>
        <div className="container" style={{ display:"flex", gap:8, alignItems:"center", fontSize:14, color:"var(--text-muted)" }}>
          <Link to="/" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Accueil</Link>
          <span>/</span>
          <Link to="/Marketplace" style={{ color:"var(--text-muted)", textDecoration:"none" }}>Annonces</Link>
          <span>/</span>
          <span style={{ color:"var(--text-primary)", fontWeight:600 }}>{car.year} {car.make} {car.model}</span>
        </div>
      </div>

      <div className="container" style={{ paddingTop:40 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:32, alignItems:"start" }} className="details-grid">
          {/* Left */}
          <div>
            {/* Gallery */}
            <div style={{ border:"1px solid var(--border)", marginBottom:24 }}>
              <div style={{ position:"relative", height:420, overflow:"hidden" }}>
                <img src={car.imgs[activeImg]} alt={`${car.make} ${car.model}`} style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                <div style={{ position:"absolute", bottom:12, right:12, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:12, padding:"4px 10px", fontFamily:"Manrope,sans-serif" }}>
                  {activeImg+1} / {car.imgs.length}
                </div>
                {car.imgs.length > 1 && <>
                  <button onClick={()=>setActiveImg(i=>(i-1+car.imgs.length)%car.imgs.length)} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", width:40, height:40, background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button onClick={()=>setActiveImg(i=>(i+1)%car.imgs.length)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:40, height:40, background:"rgba(255,255,255,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </button>
                </>}
              </div>
              {car.imgs.length > 1 && (
                <div style={{ display:"flex", gap:4, padding:8, background:"var(--bg-off)" }}>
                  {car.imgs.map((src,i) => (
                    <button key={i} onClick={()=>setActiveImg(i)} style={{ flex:1, height:64, padding:0, border:activeImg===i?"2px solid var(--accent-blue)":"2px solid transparent", cursor:"pointer", overflow:"hidden", opacity:activeImg===i?1:0.55, transition:"opacity 0.15s, border-color 0.15s" }}>
                      <img src={src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs */}
            <div style={{ border:"1px solid var(--border)", padding:"24px 24px 28px", marginBottom:24 }}>
              <h3 style={{ fontSize:22, margin:"0 0 20px" }}>Caractéristiques</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(160px,1fr))", gap:12 }}>
                {[["Année",car.year],["Kilométrage",`${car.mileage.toLocaleString()} km`],["Carburant",car.fuel],["Boîte",car.trans],["Type",car.body],["Couleur",car.color],["Propriétaires",car.owners],["Accidents","Aucun"]].map(([l,v])=><Spec key={l} label={l} value={v}/>)}
              </div>
            </div>

            {/* Description */}
            <div style={{ border:"1px solid var(--border)", padding:"24px", marginBottom:24 }}>
              <h3 style={{ fontSize:22, margin:"0 0 16px" }}>Description</h3>
              <p style={{ color:"var(--text-secondary)", lineHeight:"24px", margin:0 }}>{car.desc}</p>
            </div>

            {/* Features */}
            <div style={{ border:"1px solid var(--border)", padding:"24px", marginBottom:24 }}>
              <h3 style={{ fontSize:22, margin:"0 0 20px" }}>Équipements</h3>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                {car.features.map(f=>(
                  <div key={f} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:"1px solid var(--bg-off)" }}>
                    <div style={{ width:8, height:8, background:"var(--accent-blue)", flexShrink:0 }}/>
                    <span style={{ fontSize:14, color:"var(--text-secondary)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* History badge */}
            <div style={{ border:"1px solid var(--success)", borderLeft:"4px solid var(--success)", padding:"16px 20px", display:"flex", gap:12, alignItems:"center" }}>
              <svg width="24" height="24" fill="none" stroke="var(--success)" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              <div>
                <p style={{ fontWeight:700, color:"var(--success)", margin:"0 0 2px" }}>Historique vérifié — Aucun accident</p>
                <p style={{ color:"var(--text-muted)", fontSize:13, margin:0 }}>{car.owners} seul propriétaire · VIN : <span style={{ fontFamily:"monospace" }}>{car.vin}</span></p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div style={{ position:"sticky", top:100 }}>
            {/* Price card */}
            <div style={{ border:"1px solid var(--border)", padding:"24px", marginBottom:20 }}>
              <p style={{ color:"var(--text-muted)", fontSize:13, margin:"0 0 8px" }}>{car.city} · Annonce certifiée</p>
              <h2 style={{ margin:"0 0 4px", fontSize:22 }}>{car.year} {car.make} {car.model}</h2>
              <p style={{ fontSize:36, fontWeight:800, color:"var(--accent-blue)", margin:"12px 0 4px" }}>{car.price.toLocaleString()}<span style={{ fontSize:16, color:"var(--text-muted)", fontWeight:400, marginLeft:6 }}>MAD</span></p>
              <p style={{ color:"var(--text-muted)", fontSize:13, margin:"0 0 20px" }}>{car.mileage.toLocaleString()} km · {car.color}</p>
              <button className="btn-primary" style={{ width:"100%", marginBottom:8 }}>Contacter le vendeur</button>
              <button className="btn-secondary" style={{ width:"100%", fontSize:14 }}>Enregistrer l'annonce</button>
            </div>

            {/* Contact form */}
            <div style={{ border:"1px solid var(--border)", padding:"24px" }}>
              <h4 style={{ margin:"0 0 4px", fontSize:18 }}>Envoyer un message</h4>
              <p style={{ color:"var(--text-muted)", fontSize:13, margin:"0 0 20px" }}>Vos données sont chiffrées et sécurisées.</p>
              {sent ? (
                <div style={{ textAlign:"center", padding:"32px 0" }}>
                  <div style={{ width:48, height:48, background:"#E8F5E9", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                    <svg width="24" height="24" fill="none" stroke="var(--success)" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <p style={{ fontWeight:700, margin:"0 0 4px" }}>Message envoyé !</p>
                  <p style={{ color:"var(--text-muted)", fontSize:13, margin:0 }}>Le vendeur vous contactera rapidement.</p>
                </div>
              ) : (
                <form onSubmit={e=>{e.preventDefault();setSent(true);}} style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  <div><label className="form-label">Prénom</label><input type="text" required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Votre prénom" className="input-field" style={{ height:48, padding:"0 12px", fontSize:14 }}/></div>
                  <div><label className="form-label">Téléphone</label><input type="tel" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+212 6XX XXX XXX" className="input-field" style={{ height:48, padding:"0 12px", fontSize:14 }}/></div>
                  <div><label className="form-label">Message</label><textarea value={form.msg} onChange={e=>setForm(f=>({...f,msg:e.target.value}))} placeholder={`Intéressé par le ${car.year} ${car.make}…`} className="textarea-field" style={{ fontSize:14, minHeight:90 }}/></div>
                  <button type="submit" className="btn-primary" style={{ width:"100%" }}>Envoyer</button>
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
