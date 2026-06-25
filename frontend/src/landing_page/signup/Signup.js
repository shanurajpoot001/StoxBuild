import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { useToast } from '../../components/ui/Toast';

const Register = () => {
    const [mode, setMode] = useState('register');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const { showToast } = useToast();

    const API_BASE = (process.env.REACT_APP_API_BASE || 'http://localhost:8080').replace(/\/$/, '');
    const DASHBOARD_URL = (process.env.REACT_APP_DASHBOARD_URL || 'http://localhost:3001').replace(/\/$/, '');

    const goToDashboard = (username, token) => {
        const params = new URLSearchParams({ username, token });
        window.location.href = `${DASHBOARD_URL}/?${params.toString()}`;
    };

    const showError = (message) => {
        setError(message);
        setShake(true);
        showToast(message, 'error');
        setTimeout(() => setShake(false), 500);
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post(`${API_BASE}/api/auth/register`, { name, email, password }, { timeout: 15000 });
            showToast('Account created! Login with the same details.', 'success');
            setMode('login');
        } catch (err) {
            const msg = err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK'
                ? 'Backend is not responding. Please check if the server is running.'
                : err.response?.data?.message || 'Registration failed. Please try again.';
            showError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password }, { timeout: 15000 });
            localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => goToDashboard(data.username, data.token), 600);
        } catch (err) {
            const msg = err.code === 'ECONNABORTED' || err.code === 'ERR_NETWORK'
                ? 'Backend is not responding. Please check if the server is running.'
                : err.response?.data?.message || 'Login failed. Please try again.';
            showError(msg);
        } finally {
            setLoading(false);
        }
    };

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setError('');
    };

    return (
        <div className={`container signup-page page-transition${shake ? ' shake-error' : ''}`}>
            <h2>Register</h2>
            <p className="auth-intro">Create your account or login from one simple StoxFlow entry point.</p>
            <div className="auth-tabs" role="tablist" aria-label="Register or login">
                <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => switchMode('register')}>
                    Signup
                </button>
                <button type="button" className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>
                    Login
                </button>
            </div>
            <form autoComplete="off" onSubmit={mode === 'register' ? handleRegister : handleLogin}>
                {mode === 'register' && (
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Username</label>
                        <input type="text" className="form-control" id="name" value={name} autoComplete="new-username" onChange={(event) => setName(event.target.value)} required />
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email} autoComplete="new-email" onChange={(event) => setEmail(event.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} autoComplete="new-password" onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-premium btn-gradient" disabled={loading}>
                    {loading ? (mode === 'register' ? 'Creating account...' : 'Signing in...') : (mode === 'register' ? 'Create account' : 'Login')}
                </button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>}
            <p className="auth-helper">
                {mode === 'register' ? 'Already have an account?' : "Don't have an account?"}
                <button type="button" onClick={() => switchMode(mode === 'register' ? 'login' : 'register')}>
                    {mode === 'register' ? 'Login here' : 'Signup here'}
                </button>
            </p>
        </div>
    );
};

export default Register;
