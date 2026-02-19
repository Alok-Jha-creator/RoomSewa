import './Footer.css';

// Random star positions (pure CSS, no library needed)
const stars = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  delay: `${(Math.random() * 4).toFixed(1)}s`,
  duration: `${(2 + Math.random() * 3).toFixed(1)}s`,
  opacity: `${(0.2 + Math.random() * 0.5).toFixed(2)}`,
}));

function Footer() {
  return (
    <footer className="footer">

      {/* Star particles */}
      <div className="footer-stars">
        {stars.map((s) => (
          <span
            key={s.id}
            style={{
              top: s.top,
              left: s.left,
              '--delay': s.delay,
              '--d': s.duration,
              '--o': s.opacity,
            }}
          />
        ))}
      </div>

      <div className="container">
        <div className="footer-content">

          {/* ── BRAND ── */}
          <div className="footer-section">
            <div className="footer-brand">
              <span className="footer-brand-icon">🏠</span>
              <span className="footer-brand-name">RoomSewa</span>
            </div>
            <p className="footer-tagline">
              Find your perfect room in Nepal.<br />
              Connecting with trusted landlords and tenants since 2025.
            </p>
          </div>

          {/* ── QUICK LINKS ── */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>

          {/* ── CONTACT ── */}
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">📡</span>
              <span>ajha@gmail.com</span>
            </div>
            <div className="footer-contact-item">
              <span className="footer-contact-icon">◈</span>
              <span>+977-9807741196</span>
            </div>
          </div>

        </div>

        {/* ── BOTTOM BAR ── */}
        <div className="footer-bottom">
          <p className="footer-bottom-text">
            © 2024 <span>RoomSewa</span> · All rights reserved · Built for the cosmos
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;