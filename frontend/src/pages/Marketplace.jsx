import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const CARS = [
  { id:1, year:2021, make:"Dacia", model:"Duster Prestige", price:148000, mileage:42000, fuel:"Diesel", trans:"Manuelle", body:"SUV", city:"Casablanca", tag:"En vedette", img:"https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&auto=format&fit=crop&q=80" },
  { id:2, year:2020, make:"Volkswagen", model:"Golf 8 R-Line", price:210000, mileage:28000, fuel:"Essence", trans:"Automatique", body:"Berline", city:"Rabat", tag:"Nouveau", img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&auto=format&fit=crop&q=80" },
  { id:3, year:2022, make:"BMW", model:"Série 3 320d", price:385000, mileage:15000, fuel:"Diesel", trans:"Automatique", body:"Berline", city:"Marrakech", tag:"Premium", img:"https://images.unsplash.com/photo-1580273916550-22f79a72d97d?w=600&auto=format&fit=crop&q=80" },
  { id:4, year:2019, make:"Renault", model:"Clio 5 Intens", price:98000, mileage:67000, fuel:"Essence", trans:"Manuelle", body:"Citadine", city:"Fès", tag:null, img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=600&auto=format&fit=crop&q=80" },
  { id:5, year:2023, make:"Toyota", model:"Corolla Cross", price:340000, mileage:8000, fuel:"Hybride", trans:"CVT", body:"SUV", city:"Casablanca", tag:"Nouveau", img:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&auto=format&fit=crop&q=80" },
  { id:6, year:2018, make:"Peugeot", model:"208 Active", price:85000, mileage:89000, fuel:"Diesel", trans:"Manuelle", body:"Citadine", city:"Agadir", tag:null, img:"https://images.unsplash.com/photo-1503736334-7b56d08ee7e0?w=600&auto=format&fit=crop&q=80" },
];

const S = { // shared inline styles
  card: { textDecoration:"none", color:"inherit", display:"block", border:"1px solid var(--border)", background:"var(--bg-white)", transition:"box-shadow 0.2s" },
  price: { fontWeight:800, fontSize:22, color:"var(--accent-blue)" },
  meta: { color:"var(--text-faint)", fontSize:12, margin:"0 0 4px" },
};

export default function Marketplace() {
  const [make, setMake]     = useState("Toutes");
  const [fuel, setFuel]     = useState("Tous");
  const [maxPrice, setMax]  = useState(500000);
  const [sort, setSort]     = useState("recent");

  const filtered = useMemo(() => {
    let list = CARS.filter(c =>
      (make === "Toutes" || c.make === make) &&
      (fuel === "Tous"   || c.fuel === fuel) &&
      c.price <= maxPrice
    );
    return list.sort((a,b) => sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="year"?b.year-a.year:b.id-a.id);
  }, [make, fuel, maxPrice, sort]);

  const Sel = ({ label, opts, val, set }) => (
    <div style={{ marginBottom:16 }}>
      <label className="form-label">{label}</label>
      <select value={val} onChange={e=>set(e.target.value)} className="select-field">{opts.map(o=><option key={o}>{o}</option>)}</select>
    </div>
  );

  return (
    <div style={{ background:"var(--bg-white)", minHeight:"100vh" }}>
      <div style={{ background:"var(--bg-off)", borderBottom:"1px solid var(--border)", padding:"32px 0" }}>
        <div className="container">
          <h1 style={{ margin:"0 0 4px" }}>Parcourir les annonces</h1>
          <p style={{ color:"var(--text-muted)", margin:0, fontSize:14 }}>{filtered.length} véhicule(s) trouvé(s)</p>
        </div>
      </div>

      <div className="container" style={{ paddingTop:40, paddingBottom:60, display:"grid", gridTemplateColumns:"220px 1fr", gap:32, alignItems:"start" }}>
        {/* Sidebar */}
        <aside style={{ border:"1px solid var(--border)", padding:"24px 20px", position:"sticky", top:100 }}>
          <h4 style={{ margin:"0 0 20px", fontSize:16 }}>Filtres</h4>
          <Sel label="Marque" opts={["Toutes","BMW","Dacia","Peugeot","Renault","Toyota","Volkswagen"]} val={make} set={setMake}/>
          <Sel label="Carburant" opts={["Tous","Diesel","Essence","Hybride"]} val={fuel} set={setFuel}/>
          <div style={{ marginBottom:16 }}>
            <label className="form-label">Prix max : <strong style={{ color:"var(--accent-blue)" }}>{maxPrice.toLocaleString()} MAD</strong></label>
            <input type="range" min={50000} max={500000} step={10000} value={maxPrice} onChange={e=>setMax(+e.target.value)} style={{ width:"100%", accentColor:"var(--accent-blue)", cursor:"pointer" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", color:"var(--text-faint)", fontSize:11, marginTop:4 }}><span>50k</span><span>500k</span></div>
          </div>
          <button onClick={()=>{setMake("Toutes");setFuel("Tous");setMax(500000);}} style={{ background:"none", border:"1px solid var(--border)", color:"var(--text-muted)", fontFamily:"Manrope,sans-serif", fontSize:13, padding:"8px 16px", cursor:"pointer", width:"100%" }}>
            Réinitialiser
          </button>
        </aside>

        {/* Main */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:12 }}>
            <p style={{ color:"var(--text-muted)", margin:0, fontSize:14 }}>{filtered.length} résultat(s)</p>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="select-field" style={{ width:"auto", height:44, padding:"0 40px 0 12px", fontSize:14 }}>
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year">Année</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0", border:"1px solid var(--border)", background:"var(--bg-off)" }}>
              <p style={{ color:"var(--text-muted)", fontSize:17, fontWeight:600, margin:"0 0 8px" }}>Aucun véhicule trouvé</p>
              <p style={{ color:"var(--text-faint)", fontSize:14, margin:0 }}>Modifiez vos filtres</p>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px,1fr))", gap:20 }}>
              {filtered.map(car => (
                <Link key={car.id} to={`/cars/${car.id}`} style={S.card}
                  onMouseOver={e=>e.currentTarget.style.boxShadow="var(--shadow-2)"}
                  onMouseOut={e=>e.currentTarget.style.boxShadow="none"}>
                  <div style={{ position:"relative", height:185, overflow:"hidden" }}>
                    <img src={car.img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s" }}
                      onMouseOver={e=>e.target.style.transform="scale(1.05)"} onMouseOut={e=>e.target.style.transform="scale(1)"}/>
                    <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(0,0,0,0.45) 0%,transparent 55%)" }}/>
                    {car.tag && <span className="badge-primary" style={{ position:"absolute", top:10, left:10 }}>{car.tag}</span>}
                    <span className="badge-dark" style={{ position:"absolute", top:10, right:10, fontSize:11 }}>{car.city}</span>
                  </div>
                  <div style={{ padding:18 }}>
                    <p style={S.meta}>{car.year} · {car.fuel} · {car.mileage.toLocaleString()} km</p>
                    <p style={{ fontWeight:700, fontSize:16, margin:"0 0 12px", color:"var(--text-primary)" }}>{car.make} {car.model}</p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={S.price}>{car.price.toLocaleString()} <span style={{ fontSize:13, color:"var(--text-muted)", fontWeight:400 }}>MAD</span></span>
                      <span style={{ color:"var(--accent-blue)", fontSize:13, fontWeight:600 }}>Voir →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}