import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { axiosClient } from "../api/axios";

const BRANDS = ["Toutes", "Audi", "BMW", "Citroën", "Dacia", "Fiat", "Ford", "Honda", "Hyundai",
  "Kia", "Land Rover", "Mercedes", "Nissan", "Opel", "Peugeot", "Renault",
  "Seat", "Skoda", "Toyota", "Volkswagen", "Volvo"];
const FUELS  = ["Tous", "Diesel", "Essence", "Hybride", "Electrique", "LPG"];
const TRANS  = ["Toutes", "Manuelle", "Automatique"];
const CONDS  = ["Tous", "Neuf", "Excellent", "Très bon", "Bon", "Correct"];
const CURRENT_YEAR = new Date().getFullYear();

function CarCard({ car }) {
  const img   = car.images?.[0]?.url;
  const km    = Number(car.mileage).toLocaleString("fr-MA");
  const price = Number(car.price).toLocaleString("fr-MA");

  return (
    <Link to={`/cars/${car.id}`} style={{ textDecoration: "none", color: "inherit", display: "block",
      border: "1px solid var(--border)", background: "var(--bg-white)", transition: "box-shadow 0.2s" }}
      onMouseOver={e => e.currentTarget.style.boxShadow = "var(--shadow-2)"}
      onMouseOut={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ position: "relative", height: 185, overflow: "hidden", background: "var(--bg-off)" }}>
        {img ? (
          <img src={img} alt={car.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
            onMouseOver={e => e.target.style.transform = "scale(1.05)"}
            onMouseOut={e => e.target.style.transform = "scale(1)"} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth={1.5}>
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99z"/>
              <circle cx="7.5" cy="14.5" r="1.5"/><circle cx="16.5" cy="14.5" r="1.5"/>
            </svg>
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 55%)" }}/>
        {car.city && <span className="badge-dark" style={{ position: "absolute", top: 10, right: 10, fontSize: 11 }}>{car.city}</span>}
      </div>
      <div style={{ padding: 18 }}>
        <p style={{ color: "var(--text-faint)", fontSize: 12, margin: "0 0 4px" }}>
          {car.model_year} · {car.fuel_type} · {km} km
        </p>
        <p style={{ fontWeight: 700, fontSize: 16, margin: "0 0 12px", color: "var(--text-primary)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {car.brand} {car.model}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: 20, color: "var(--accent-blue)" }}>
            {price} <span style={{ fontSize: 12, fontWeight: 400, color: "var(--text-muted)" }}>MAD</span>
          </span>
          <span style={{ color: "var(--accent-blue)", fontSize: 13, fontWeight: 600 }}>Voir →</span>
        </div>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div style={{ border: "1px solid var(--border)", background: "var(--bg-white)" }}>
      <div style={{ height: 185, background: "var(--bg-off)" }} />
      <div style={{ padding: 18 }}>
        <div style={{ height: 12, width: "60%", background: "var(--bg-off)", marginBottom: 8 }} />
        <div style={{ height: 16, width: "80%", background: "var(--bg-off)", marginBottom: 12 }} />
        <div style={{ height: 20, width: "40%", background: "var(--bg-off)" }} />
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [searchParams] = useSearchParams();

  const [search,   setSearch]   = useState(searchParams.get("q") || "");
  const [brand,    setBrand]    = useState("Toutes");
  const [fuel,     setFuel]     = useState("Tous");
  const [trans,    setTrans]    = useState("Toutes");
  const [cond,     setCond]     = useState("Tous");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minYear,  setMinYear]  = useState(2000);
  const [maxYear,  setMaxYear]  = useState(CURRENT_YEAR);
  const [sort,     setSort]     = useState("recent");
  const [page,     setPage]     = useState(1);

  const [cars,        setCars]        = useState([]);
  const [total,       setTotal]       = useState(0);
  const [lastPage,    setLastPage]    = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [showSugg,    setShowSugg]    = useState(false);

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

  const handleSearchInput = (value) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    if (value.length < 2) { setSuggestions([]); setShowSugg(false); return; }

    const lower = value.toLowerCase();
    const brandMatches = BRANDS
      .filter(b => b !== "Toutes" && b.toLowerCase().includes(lower))
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
    setSearch(val);
    setSuggestions([]);
    setShowSugg(false);
    setPage(1);
  };

  const fetch = useCallback(() => {
    setLoading(true);
    const params = { status: "approved", page, per_page: 12 };
    if (search)              params.search        = search;
    if (brand  !== "Toutes") params.brand         = brand;
    if (fuel   !== "Tous")   params.fuel_type     = fuel;
    if (trans  !== "Toutes") params.transmission  = trans;
    if (cond   !== "Tous")   params.car_condition = cond;
    if (maxPrice < 1000000)  params.max_price     = maxPrice;
    if (minYear  > 2000)     params.min_year      = minYear;
    if (maxYear  < CURRENT_YEAR) params.max_year  = maxYear;
    if (sort === "price-asc")  { params.sort = "price";      params.dir = "asc"; }
    if (sort === "price-desc") { params.sort = "price";      params.dir = "desc"; }
    if (sort === "year")       { params.sort = "model_year"; params.dir = "desc"; }

    axiosClient.get("/annonces", { params })
      .then(res => {
        setCars(res.data.data);
        setTotal(res.data.total);
        setLastPage(res.data.last_page);
      })
      .catch(() => setCars([]))
      .finally(() => setLoading(false));
  }, [search, brand, fuel, trans, cond, maxPrice, minYear, maxYear, sort, page]);

  useEffect(() => { fetch(); }, [fetch]);

  const reset = () => {
    setSearch(""); setBrand("Toutes"); setFuel("Tous"); setTrans("Toutes");
    setCond("Tous"); setMaxPrice(1000000); setMinYear(2000);
    setMaxYear(CURRENT_YEAR); setSort("recent"); setPage(1);
  };

  const Sel = ({ label, opts, val, set }) => (
    <div style={{ marginBottom: 16 }}>
      <label className="form-label">{label}</label>
      <select value={val} onChange={e => { set(e.target.value); setPage(1); }} className="select-field">
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ background: "var(--bg-white)", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "var(--bg-off)", borderBottom: "1px solid var(--border)", padding: "32px 0" }}>
        <div className="container">
          <h1 style={{ margin: "0 0 16px" }}>Parcourir les annonces</h1>
          <form onSubmit={e => { e.preventDefault(); setShowSugg(false); setPage(1); fetch(); }}
            style={{ display: "flex", gap: 0, maxWidth: 540, position: "relative" }}
            ref={inputWrapRef}>
            <input
              type="text"
              value={search}
              onChange={e => handleSearchInput(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSugg(true)}
              placeholder="Marque, modèle, titre…"
              className="input-field"
              style={{ flex: 1, fontSize: 15, borderRight: "none" }}
              autoComplete="off"
            />
            <button type="submit" className="btn-primary" style={{ width: 48, padding: 0, flexShrink: 0 }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
              </svg>
            </button>

            {showSugg && suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0,
                width: "calc(100% - 48px)",
                background: "var(--bg-white)",
                border: "1px solid var(--border)",
                borderTop: "none",
                zIndex: 100,
                boxShadow: "var(--shadow-2)",
              }}>
                {suggestions.map((s, i) => (
                  <div
                    key={i}
                    onMouseDown={() => selectSuggestion(s.label)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                      fontSize: 14,
                      color: "var(--text-primary)",
                    }}
                    onMouseOver={e => e.currentTarget.style.background = "var(--bg-off)"}
                    onMouseOut={e => e.currentTarget.style.background = "transparent"}
                  >
                    <svg width="14" height="14" fill="none" stroke="var(--text-faint)" strokeWidth={2} viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                      {s.type === "brand"
                        ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        : <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"/>
                      }
                    </svg>
                    <span style={{ flex: 1 }}>{s.label}</span>
                    {s.type === "brand" && (
                      <span style={{ fontSize: 11, color: "var(--text-faint)", background: "var(--bg-off)", padding: "2px 6px", border: "1px solid var(--border)" }}>
                        Marque
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60, display: "grid", gridTemplateColumns: "220px 1fr", gap: 32, alignItems: "start" }}>
        {/* Sidebar */}
        <aside style={{ border: "1px solid var(--border)", padding: "24px 20px", position: "sticky", top: 100 }}>
          <h4 style={{ margin: "0 0 20px", fontSize: 16 }}>Filtres</h4>
          <Sel label="Marque" opts={BRANDS} val={brand} set={setBrand} />
          <Sel label="Carburant" opts={FUELS} val={fuel} set={setFuel} />
          <Sel label="Boîte" opts={TRANS} val={trans} set={setTrans} />
          <Sel label="État" opts={CONDS} val={cond} set={setCond} />

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">
              Prix max : <strong style={{ color: "var(--accent-blue)" }}>
                {maxPrice === 1000000 ? "Tous" : Number(maxPrice).toLocaleString("fr-MA") + " MAD"}
              </strong>
            </label>
            <input type="range" min={0} max={1000000} step={10000} value={maxPrice}
              onChange={e => { setMaxPrice(+e.target.value); setPage(1); }}
              style={{ width: "100%", accentColor: "var(--accent-blue)", cursor: "pointer" }} />
            <div style={{ display: "flex", justifyContent: "space-between", color: "var(--text-faint)", fontSize: 11, marginTop: 4 }}>
              <span>0</span><span>1 000 000</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Année : {minYear} – {maxYear}</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" min={1990} max={maxYear} value={minYear}
                onChange={e => { setMinYear(+e.target.value); setPage(1); }}
                className="input-field" style={{ fontSize: 13, padding: "6px 8px", width: "50%" }} />
              <input type="number" min={minYear} max={CURRENT_YEAR} value={maxYear}
                onChange={e => { setMaxYear(+e.target.value); setPage(1); }}
                className="input-field" style={{ fontSize: 13, padding: "6px 8px", width: "50%" }} />
            </div>
          </div>

          <button onClick={reset}
            style={{ background: "none", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: "Manrope,sans-serif", fontSize: 13, padding: "8px 16px", cursor: "pointer", width: "100%" }}>
            Réinitialiser
          </button>
        </aside>

        {/* Results */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 14 }}>
              {loading ? "Chargement…" : `${total} véhicule(s) trouvé(s)`}
            </p>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
              className="select-field" style={{ width: "auto", height: 44, padding: "0 40px 0 12px", fontSize: 14 }}>
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="year">Année</option>
            </select>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
              {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)}
            </div>
          ) : cars.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", border: "1px solid var(--border)", background: "var(--bg-off)" }}>
              <p style={{ color: "var(--text-muted)", fontSize: 17, fontWeight: 600, margin: "0 0 8px" }}>Aucun véhicule trouvé</p>
              <p style={{ color: "var(--text-faint)", fontSize: 14, margin: 0 }}>Modifiez vos filtres</p>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
                {cars.map(car => <CarCard key={car.id} car={car} />)}
              </div>

              {lastPage > 1 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 40 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "8px 16px", border: "1px solid var(--border)", background: "none",
                      cursor: page === 1 ? "not-allowed" : "pointer", opacity: page === 1 ? 0.4 : 1,
                      fontFamily: "Manrope,sans-serif", fontSize: 14 }}>
                    ← Précédent
                  </button>
                  <span style={{ fontSize: 14, color: "var(--text-muted)", padding: "0 8px" }}>
                    Page {page} / {lastPage}
                  </span>
                  <button onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
                    style={{ padding: "8px 16px", border: "1px solid var(--border)", background: "none",
                      cursor: page === lastPage ? "not-allowed" : "pointer", opacity: page === lastPage ? 0.4 : 1,
                      fontFamily: "Manrope,sans-serif", fontSize: 14 }}>
                    Suivant →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
