import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  const isActive = (path: string) => location.pathname === path;
  const navClass = `navbar ${scrolled || !isHome ? 'scrolled' : ''} ${mobileMenuOpen ? 'mobile-active' : ''}`;

  return (
    <nav className={navClass}>
      <Link to="/" className="nav-brand">
        <span className="brand-icon">✦</span>
        <div className="brand-text">
          <div className="brand-name">TravelEase</div>
          <div className="brand-sub">Palawan</div>
        </div>
      </Link>

      <ul className={`nav-links ${mobileMenuOpen ? 'show' : ''}`}>
        <li className="mobile-only" style={{textAlign:'right', padding:'10px 0'}}>
        <button onClick={() => setMobileMenuOpen(false)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>✕</button>
        </li>
        <li><Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
        <li><Link to="/destinations" className={`nav-link ${isActive('/destinations') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Destinations</Link></li>
        <li><Link to="/hotels" className={`nav-link ${isActive('/hotels') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Hotels</Link></li>
        <li><Link to="/flights" className={`nav-link ${isActive('/flights') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Flights</Link></li>
        <li><Link to="/transport" className={`nav-link ${isActive('/transport') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Transport</Link></li>
        <li><Link to="/feedback" className={`nav-link ${isActive('/feedback') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Feedback</Link></li>
        <li><Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Map</Link></li>
        {user?.role === 'admin' && (
          <li><Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>Admin</Link></li>
        )}
        <li className="mobile-only">
          {user ? (
            <button className="btn-primary" onClick={logout}>Logout</button>
          ) : (
            <Link to="/login" className="btn-primary">Sign In</Link>
          )}
        </li>
      </ul>

      <div className="nav-actions">
        <div className="nav-cta">
          {user ? (
            <div className="user-nav-group">
              
              <div className={`user-profile ${profileOpen ? 'active' : ''}`} onClick={() => setProfileOpen(!profileOpen)}>
                <div className="user-avatar">{user.full_name.charAt(0)}</div>
                <div className="user-dropdown glass">
                  <div className="dropdown-header">
                    <strong>{user.full_name}</strong>
                    <span>{user.email}</span>
                  </div>
                  <hr />
                  <Link to="/my-bookings" className="dropdown-item">🎫 My Bookings</Link>
                  <button onClick={logout} className="dropdown-item"> Logout</button>
                </div>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary">Sign In</Link>
          )}
        </div>

        <button className="hamburger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
          <span className={mobileMenuOpen ? 'open' : ''}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
