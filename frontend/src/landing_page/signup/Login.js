import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 


 
  const navigateToDashboard = (username, token) => {
    const DASHBOARD_URL = (process.env.REACT_APP_DASHBOARD_URL || 'https://stoxbuild-frontend.onrender.com').replace(/\/$/, '');
    const params = new URLSearchParams({ username, token });
    window.location.href = `${DASHBOARD_URL}/?${params.toString()}`;
  };
  



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const navigate = useNavigate();

    const API_BASE = process.env.REACT_APP_API_BASE || 'https://stoxbuild-backend.onrender.com';

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });

            // Save user data in local storage
            console.log(data.username)
            localStorage.setItem('user', JSON.stringify({ username: data.username, token: data.token }));

            // Navigate to dashboard
            navigateToDashboard(data.username, data.token);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message); 
                navigate('/login');
            } else {
                setError('An unexpected error occurred. Please try again later.');
                navigate('/login');
            }
        }
    };

    return (
        <div className="container login-page">
            <h2>Login</h2>
            <form autoComplete="off" onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={email}   autoComplete="new-email"   onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password}  autoComplete="new-password"   onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>} {/* Display error message */}
            <p>Don't have an account? <a href="/signup">Signup</a></p>
        </div>
    );
};

export default Login;
