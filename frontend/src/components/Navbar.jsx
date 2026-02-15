import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav style={{
            padding: '1rem 2rem',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0 }}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                        FitTrack
                    </h2>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <Link to="/about" className={`nav-link ${isActive('/about')}`}>About</Link>
                            <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
                            <Link to="/nutrition" className={`nav-link ${isActive('/nutrition')}`}>Nutrition</Link>
                            <Link to="/profile" className={`nav-link ${isActive('/profile')}`}>Profile</Link>

                            <div style={{ marginLeft: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Link to="/settings" className={`nav-link ${isActive('/settings')}`} style={{ marginRight: 0 }}>
                                    My Account
                                </Link>
                                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
