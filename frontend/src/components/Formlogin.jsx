import { useState } from 'react';
import { axiosClient } from '../api/axios';
import { User_Dashboard } from '../router';
import { useNavigate } from 'react-router-dom';

export default function Formlogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            setError('');

            const response = await axiosClient.post('/login', values);

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                console.log('Login successful!', response.data.user);
                navigate(User_Dashboard);
            } else {
                setError('Login failed: no token received');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            {error && (
                <div style={{ background: "#FFF5F5", border: "1px solid #DC3545", borderLeft: "4px solid #DC3545", padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
                    <svg width="16" height="16" fill="none" stroke="#DC3545" viewBox="0 0 24 24" strokeWidth={2} style={{ flexShrink: 0 }}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span style={{ color: "#DC3545", fontSize: 14, fontFamily: "Manrope,sans-serif" }}>{error}</span>
                </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); onSubmit({ email, password }); }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                <div>
                    <label htmlFor="email" style={{ display: "block", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8, fontFamily: "Manrope,sans-serif" }}>Adresse email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.ma"
                        required
                        className="input-field"
                        style={{ fontSize: 15 }}
                    />
                </div>

                <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <label htmlFor="password" style={{ fontSize: 14, fontWeight: 600, color: "#333", fontFamily: "Manrope,sans-serif" }}>Mot de passe</label>
                        <a href="#" style={{ fontSize: 13, color: "#007BFF", textDecoration: "none", fontFamily: "Manrope,sans-serif" }}>Mot de passe oublié ?</a>
                    </div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="input-field"
                        style={{ fontSize: 15 }}
                    />
                </div>

                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", marginTop: 8 }}>
                    {loading ? (
                        <span style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="anim-spin"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
                            Connexion…
                        </span>
                    ) : "Se connecter"}
                </button>
            </form>
        </div>
    );
}