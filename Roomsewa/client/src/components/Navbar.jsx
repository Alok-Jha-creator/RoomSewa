import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`navbar-galaxy ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <div className="navbar-container">
          
          {/* ── LOGO ── */}
          <Link to="/" className="logo-galaxy">
            <div className="logo-icon-wrap">
              <span className="logo-emoji">🏠</span>
            </div>
            <div className="logo-text-wrap">
              <span className="logo-main">RoomSewa</span>
              <span className="logo-sub">Find · Rent · Live</span>
            </div>
          </Link>

          {/* ── NAV LINKS ── */}
          <ul className="nav-links-galaxy">
            <li>
              <Link to="/" className="nav-link-galaxy">
                <span className="nav-icon">⬡</span>
                <span className="nav-label">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/properties" className="nav-link-galaxy">
                <span className="nav-icon">◈</span>
                <span className="nav-label">Properties</span>
              </Link>
            </li>

            {user ? (
              <>
                <li>
                  <Link to="/add-property" className="nav-link-galaxy">
                    <span className="nav-icon">⊕</span>
                    <span className="nav-label">Add</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="nav-link-galaxy">
                    <span className="nav-icon">◧</span>
                    <span className="nav-label">Dashboard</span>
                  </Link>
                </li>

                {/* ✅ ADMIN LINK - Only show if user is admin */}
                {user.role === 'admin' && (
                  <li>
                    <Link to="/admin" className="nav-link-galaxy nav-link-admin">
                      <span className="nav-icon">👨‍💼</span>
                      <span className="nav-label">Admin</span>
                    </Link>
                  </li>
                )}

                <div className="nav-divider" />

                <li>
                  <Link to="/profile" className="nav-link-galaxy nav-link-profile">
                    <span className="nav-icon">◉</span>
                    <span className="nav-label">{user.name}</span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout-galaxy">
                    <span>⏻</span>
                    <span>Logout</span>
                  </button>
                </li>
              </>
            ) : (
              <>
                <div className="nav-divider" />
                <li>
                  <Link to="/login" className="btn-login-galaxy">
                    <span>◈</span>
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="btn-register-galaxy">
                    <span>✦</span>
                    <span>Register</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;