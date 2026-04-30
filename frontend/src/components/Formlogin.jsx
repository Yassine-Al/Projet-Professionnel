import { useState } from 'react';
import { axiosClient } from '../api/axios';
import { User_Dashboard } from '../router';
import { useNavigate } from 'react-router-dom';

export default function Formlogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const onSubmit = async (values) => {
        try {
            setError('');

            const response = await axiosClient.post('/login', values);

            // Vérifier si login réussi
            if (response.data.token) {
                // Sauvegarder token
                localStorage.setItem('token', response.data.token);

                console.log('Login successful!', response.data.user);

                // ✅ REDIRECTION ICI
                navigate(User_Dashboard);
            } else {
                setError('Login failed: no token received');
            }

        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Login failed');
        }
    }

    return (
        <div>
            <h1>Formlogin Page</h1>
            <br />

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmit({ email, password });
            }}>
                <label htmlFor="email">Email</label>
                <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button type="submit">Login</button>
            </form>
        </div>
    );
}