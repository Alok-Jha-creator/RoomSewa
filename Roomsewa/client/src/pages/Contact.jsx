import './InfoPages.css';

function Contact() {
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
          <p className="info-label">◈ Get In Touch</p>
          <h1>Contact Us</h1>
          <p className="info-subtitle">We're here to help — reach out anytime</p>
        </div>

        {/* Content */}
        <div className="info-content">

          <div className="contact-grid">

            <div className="contact-card">
              <span className="contact-icon">📡</span>
              <h3>Email</h3>
              <p>info@roomsewa.com</p>
              <span className="contact-tag">24/7 Support</span>
            </div>

            <div className="contact-card">
              <span className="contact-icon">◈</span>
              <h3>Phone</h3>
              <p>+977-9800000000</p>
              <span className="contact-tag">Sun–Fri, 9AM–6PM</span>
            </div>

            <div className="contact-card">
              <span className="contact-icon">◉</span>
              <h3>Office</h3>
              <p>Kathmandu, Nepal</p>
              <span className="contact-tag">Thamel, KTM</span>
            </div>

          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>⬡ Response Time</h3>
            <p>
              We typically respond to all emails within 24 hours.
              For urgent queries, please call us directly during office hours.
              Our team is always ready to assist you with any property or booking issues.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Contact;