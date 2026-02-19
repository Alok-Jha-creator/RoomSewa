import { useState, useEffect } from 'react';
import { getAllBookingsAdmin } from '../api/Services';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './AdminBookings.css';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookingsAdmin();
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error('Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.renter?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader />;

  return (
    <div className="admin-bookings">
      <div className="container">
        
        {/* Header */}
        <div className="admin-page-header">
          <h1>◈ Bookings Management</h1>
          <p className="subtitle">Total Bookings: {bookings.length}</p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Search by property, renter, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="bookings-table-container">
          {filteredBookings.length === 0 ? (
            <div className="no-data">
              <p>No bookings found</p>
            </div>
          ) : (
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Renter</th>
                  <th>Owner</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map(booking => (
                  <tr key={booking._id}>
                    <td>
                      <div className="property-info">
                        <span className="property-name">
                          {booking.property?.title || 'N/A'}
                        </span>
                        <span className="property-location">
                          {booking.property?.location?.city || '—'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{booking.renter?.name}</span>
                        <span className="user-email">{booking.renter?.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        <span className="user-name">{booking.owner?.name}</span>
                        <span className="user-email">{booking.owner?.email}</span>
                      </div>
                    </td>
                    <td className="price-cell">
                      Rs. {booking.property?.price?.toLocaleString() || '—'}
                    </td>
                    <td>
                      <span className={`booking-status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="message-cell">
                        {booking.message || '—'}
                      </div>
                    </td>
                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Stats */}
        <div className="booking-stats">
          <div className="stat-item pending">
            <span className="stat-label">Pending</span>
            <span className="stat-value">
              {bookings.filter(b => b.status === 'pending').length}
            </span>
          </div>
          <div className="stat-item approved">
            <span className="stat-label">Approved</span>
            <span className="stat-value">
              {bookings.filter(b => b.status === 'approved').length}
            </span>
          </div>
          <div className="stat-item rejected">
            <span className="stat-label">Rejected</span>
            <span className="stat-value">
              {bookings.filter(b => b.status === 'rejected').length}
            </span>
          </div>
          <div className="stat-item cancelled">
            <span className="stat-label">Cancelled</span>
            <span className="stat-value">
              {bookings.filter(b => b.status === 'cancelled').length}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminBookings;