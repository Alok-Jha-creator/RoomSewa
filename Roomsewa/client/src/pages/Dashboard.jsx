import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { getMyProperties, getMyBookings, deleteProperty, updateBookingStatus } from '../api/Services';
import Loader from '../components/Loader';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('properties');
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'properties') {
        const data = await getMyProperties(user._id);
        // ✅ Fixed
        if (data && data.listings) {
          setProperties(data.listings);
        } else if (data && Array.isArray(data)) {
          setProperties(data);
        } else {
          setProperties([]);
        }
      } else {
        const data = await getMyBookings();
        // ✅ Fixed
        if (data && data.bookings) {
          setBookings(data.bookings);
        } else if (data && Array.isArray(data)) {
          setBookings(data);
        } else {
          setBookings([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      if (activeTab === 'properties') {
        setProperties([]);
      } else {
        setBookings([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      await deleteProperty(id);
      toast.success('Property deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleBookingStatus = async (id, status) => {
    try {
      await updateBookingStatus(id, status);
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* ── HEADER ── */}
        <div className="galaxy-card dashboard-header">
          <h1>◧ Command Center</h1>
          <p>Welcome back, <strong>{user?.name}</strong> — system online ⬡</p>
        </div>

        {/* ── TABS ── */}
        <div className="dashboard-tabs">
          <button
            className={activeTab === 'properties' ? 'active' : ''}
            onClick={() => setActiveTab('properties')}
          >
            ⬡ My Properties ({properties.length})
          </button>
          <button
            className={activeTab === 'bookings' ? 'active' : ''}
            onClick={() => setActiveTab('bookings')}
          >
            ◈ My Bookings ({bookings.length})
          </button>
        </div>

        {/* ── CONTENT ── */}
        <div className="galaxy-card dashboard-content">
          {loading ? (
            <Loader />
          ) : activeTab === 'properties' ? (

            /* ── PROPERTIES SECTION ── */
            <div className="properties-section">
              <div className="section-header">
                <h2>My Properties</h2>
                <Link to="/add-property" className="btn-add-property">
                  ⊕ Add Property
                </Link>
              </div>

              {properties.length === 0 ? (
                <div className="empty-state">
                  <h3>// No Properties Found</h3>
                  <p>Transmit your first listing to the network</p>
                  <Link to="/add-property" className="btn-primary">⊕ Add Property</Link>
                </div>
              ) : (
                <div className="properties-list">
                  {properties.map((property) => (
                    <div key={property._id} className="property-item">
                      <img
                        src={property.photos?.[0] || 'https://via.placeholder.com/300x200'}
                        alt={property.title}
                      />
                      <div className="property-info">
                        <h3>{property.title}</h3>
                        <p className="location">◉ {property.location?.address}</p>
                        <p className="price">Rs. {property.price}/month</p>
                        <span className={`status ${property.isAvailable ? 'available' : 'unavailable'}`}>
                          {property.isAvailable ? '● Online' : '● Offline'}
                        </span>
                      </div>
                      <div className="property-actions">
                        <Link to={`/properties/${property._id}`} className="btn-view">
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          ) : (

            /* ── BOOKINGS SECTION ── */
            <div className="bookings-section">
              <h2>My Bookings</h2>

              {bookings.length === 0 ? (
                <div className="empty-state">
                  <h3>// No Bookings Found</h3>
                  <p>Browse the network and make your first booking</p>
                  <Link to="/properties" className="btn-primary">◈ Browse Properties</Link>
                </div>
              ) : (
                <div className="bookings-list">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="booking-item">

                      <div className="booking-property">
                        <img
                          src={booking.property?.photos?.[0] || 'https://via.placeholder.com/150'}
                          alt={booking.property?.title}
                        />
                        <div>
                          <h3>{booking.property?.title}</h3>
                          <p>◉ {booking.property?.location?.address}</p>
                          <p className="price">Rs. {booking.property?.price}/month</p>
                        </div>
                      </div>

                      <div className="booking-details">
                        <p>
                          <strong>Status:</strong>
                          <span className={`booking-status ${booking.status}`}>
                            {booking.status}
                          </span>
                        </p>
                        {booking.message && (
                          <p><strong>Message:</strong> {booking.message}</p>
                        )}
                        <p className="booking-date">
                          ⬡ Requested {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {user?._id === booking.property?.owner?._id && booking.status === 'pending' && (
                        <div className="booking-actions">
                          <button
                            onClick={() => handleBookingStatus(booking._id, 'approved')}
                            className="btn-approve"
                          >
                            ✓ Approve
                          </button>
                          <button
                            onClick={() => handleBookingStatus(booking._id, 'rejected')}
                            className="btn-reject"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;