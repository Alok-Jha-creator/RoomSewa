import './InfoPages.css';

function About() {
  return (
    <div className="info-page">
      <div className="info-container">

        {/* Corner Brackets */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        {/* Header */}
        <div className="info-header">
          <p className="info-label">◈ About Us</p>
          <h1>Who We Are</h1>
          <p className="info-subtitle">Nepal's most advanced rental network</p>
        </div>

        {/* Content */}
        <div className="info-content">

          <div className="info-section">
            <h3>🚀 Our Mission</h3>
            <p>
              RoomSewa was built to solve one of Nepal's most common problems — finding a reliable,
              affordable room or flat. We connect renters and property owners across the country
              through a fast, transparent, and modern platform.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>🌐 What We Do</h3>
            <p>
              We provide a galaxy-level digital platform where property owners can list their
              rooms, flats, and apartments — and renters can search, filter, and book them
              instantly. No middlemen. No hidden charges. Just direct connections.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Properties Listed</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Happy Renters</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Cities Covered</span>
            </div>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>⬡ Our Vision</h3>
            <p>
              To become Nepal's #1 trusted rental platform — making room hunting as easy
              as a single click, for every Nepali, everywhere.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default About;