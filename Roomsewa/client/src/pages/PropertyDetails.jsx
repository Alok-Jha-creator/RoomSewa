import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getPropertyById, createBooking } from '../api/Services';
import Loader from '../components/Loader';
import ChatBox from '../components/ChatBox'; // ← NEW
import './PropertyDetails.css';

function PropertyDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showChat, setShowChat] = useState(false); // ← NEW

  useEffect(() => { fetchPropertyDetails(); }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const data = await getPropertyById(id);
      if (data && data.listing) {
        setProperty(data.listing);
      } else if (data && data.property) {
        setProperty(data.property);
      } else {
        setProperty(data);
      }
    } catch (error) {
      toast.error('Failed to load property details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to book a property');
      navigate('/login');
      return;
    }
    try {
      setSubmitting(true);
      await createBooking({ property: property._id, message: bookingMessage });
      toast.success('Booking request sent! 🎉');
      setShowBookingForm(false);
      setBookingMessage('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ← NEW
  const handleChat = () => {
    if (!user) {
      toast.error('Please login to message the owner');
      navigate('/login');
      return;
    }
    if (user._id === property.owner._id) {
      toast.warning('You cannot message yourself!');
      return;
    }
    setShowChat(true);
  };

  if (loading) return <Loader />;

  if (!property) {
    return (
      <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Orbitron', monospace", color: '#00f5ff', letterSpacing: '0.15em' }}>
          // Property Not Found
        </h2>
      </div>
    );
  }

  const images = property.photos?.length > 0
    ? property.photos
    : ['https://via.placeholder.com/800x500'];

  return (
    <div className="property-details">
      <div className="container">

        {/* ── IMAGE GALLERY ── */}
        <div className="image-gallery">
          <div className="main-image">
            <img src={images[currentImage]} alt={property.title} />
          </div>
          {images.length > 1 && (
            <div className="thumbnail-images">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${property.title} ${index + 1}`}
                  className={currentImage === index ? 'active' : ''}
                  onClick={() => setCurrentImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── PROPERTY INFO ── */}
        <div className="property-info-section">

          {/* Info Main */}
          <div className="info-main">
            <div className="property-header">
              <h1>{property.title}</h1>
              <p className="location">◉ {property.location?.address}</p>
              <p className="price">Rs. {property.price}/month</p>
            </div>

            <div className="property-type">
              <span className="badge">{property.type}</span>
              <span className={`badge ${property.isAvailable ? 'available' : 'unavailable'}`}>
                {property.isAvailable ? '● Online' : '● Offline'}
              </span>
            </div>

            <div className="property-description">
              <h3>Description</h3>
              <p>{property.description || 'No description available.'}</p>
            </div>

            {property.amenities?.length > 0 && (
              <div className="property-amenities">
                <h3>Amenities</h3>
                <div className="amenities-list">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-item">{amenity}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="booking-card">
            <span className="bc-corner tl" />
            <span className="bc-corner tr" />
            <span className="bc-corner bl" />
            <span className="bc-corner br" />

            <div className="card-content">
              <h3>◈ Interested in this property?</h3>
              <p className="price-highlight">Rs. {property.price}/month</p>

              {!showBookingForm ? (
                <div className="action-btns"> {/* ← NEW wrapper */}
                  <button
                    className="btn-book"
                    onClick={() => setShowBookingForm(true)}
                    disabled={!property.isAvailable}
                  >
                    {property.isAvailable ? '⊕ Book Now' : '✕ Not Available'}
                  </button>

                  {/* ← NEW Chat Button */}
                  <button
                    className="btn-chat"
                    onClick={handleChat}
                  >
                    💬 Message Owner
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBooking}>
                  <textarea
                    placeholder="Add a message to the owner (optional)"
                    value={bookingMessage}
                    onChange={(e) => setBookingMessage(e.target.value)}
                    rows="4"
                  />
                  <button type="submit" className="btn-book" disabled={submitting}>
                    {submitting ? '⟳ Sending...' : '⊕ Send Booking Request'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setShowBookingForm(false)}
                  >
                    ✕ Cancel
                  </button>
                </form>
              )}
            </div>

            {property.owner && (
              <div className="owner-info">
                <h4>Property Owner</h4>
                <p><strong>{property.owner.name}</strong></p>
                <p>📡 {property.owner.email}</p>
                {property.owner.phone && <p>◈ {property.owner.phone}</p>}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ← NEW ChatBox */}
      {showChat && property.owner && (
        <ChatBox
          property={property}
          owner={property.owner}
          onClose={() => setShowChat(false)}
        />
      )}

    </div>
  );
}

export default PropertyDetails;