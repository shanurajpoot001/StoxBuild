import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { useToast } from '../../components/ui/Toast';

const navigateToDashboard = (username, token) => {
    const DASHBOARD_URL = (process.env.REACT_APP_DASHBOARD_URL || 'http://localhost:3001').replace(/\/$/, '');
    const params = new URLSearchParams({ username, token });
    window.location.href = `${DASHBOARD_URL}/?${params.toString()}`;
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:8080').replace(/\/$/, '');

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, { timeout: 15000 });
            localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));
            showToast('Login successful! Redirecting…', 'success');
            setTimeout(() => navigateToDashboard(data.username, data.token), 600);
        } catch (err) {
            const msg = err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK'
                ? 'Backend is not responding. Please check if the server is running.'
                : err.response?.data?.message || 'An unexpected error occurred. Please try again.';
            setError(msg);
            setShake(true);
            showToast(msg, 'error');
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`container login-page page-transition${shake ? ' shake-error' : ''}`}>
            <h2>Login</h2>
            <form autoComplete="off" onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email} autoComplete="new-email" onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-premium btn-gradient" disabled={loading}>
                    {loading ? 'Signing in…' : 'Login'}
                </button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            <p>Don't have an account? <a href="/signup">Signup</a></p>
        </div>
    );
};

export default Login;
