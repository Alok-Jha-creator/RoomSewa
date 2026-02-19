import './InfoPages.css';

function Terms() {
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
          <p className="info-label">◈ Legal</p>
          <h1>Terms of Service</h1>
          <p className="info-subtitle">Last updated: January 2024</p>
        </div>

        {/* Content */}
        <div className="info-content">

          <div className="info-section">
            <h3>01 · Acceptance of Terms</h3>
            <p>
              By accessing or using RoomSewa, you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use our platform.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>02 · User Accounts</h3>
            <p>
              You must provide accurate information when creating an account. You are responsible
              for maintaining the confidentiality of your account credentials and for all
              activities that occur under your account.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>03 · Property Listings</h3>
            <p>
              Property owners are responsible for the accuracy of their listings. RoomSewa
              does not guarantee the availability, condition, or accuracy of any listed property.
              All listings must comply with local laws and regulations.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>04 · Bookings</h3>
            <p>
              Booking requests sent through RoomSewa are subject to owner approval.
              RoomSewa acts as a platform only and is not responsible for disputes
              between renters and property owners.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>05 · Privacy</h3>
            <p>
              We respect your privacy. Your personal information is only used to facilitate
              connections between renters and owners. We do not sell your data to third parties.
              See our Privacy Policy for more details.
            </p>
          </div>

          <div className="info-divider" />

          <div className="info-section">
            <h3>06 · Changes to Terms</h3>
            <p>
              RoomSewa reserves the right to modify these terms at any time.
              Continued use of the platform after changes constitutes acceptance
              of the new terms.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Terms;