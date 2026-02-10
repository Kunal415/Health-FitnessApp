import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', width: '100%', maxWidth: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Welcome Back</h2>
          {error && <div style={{ color: '#fca5a5', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Sign In
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>
              Forgot Password?
            </Link>
          </p>
          <p style={{ marginTop: '0.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign up</Link>
          </p>
          <div style={{ marginTop: '2rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', textAlign: 'center' }}>
            <Link to="/admin/login" style={{ color: '#fca5a5', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>
              🔒 Admin Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
