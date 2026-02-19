import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminStats } from '../api/Services';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data.stats);
      setRecentActivities(data.recentActivities);
    } catch (error) {
      toast.error('Failed to load admin stats');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="admin-dashboard">
      <div className="container">
        
        {/* Header */}
        <div className="admin-header">
          <h1>◈ Admin Dashboard</h1>
          <p className="subtitle">System Overview & Management</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          
          {/* Users Stats */}
          <div className="stat-card users">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats?.users.total || 0}</p>
              <div className="stat-breakdown">
                <span>◈ Renters: {stats?.users.renters || 0}</span>
                <span>◈ Owners: {stats?.users.owners || 0}</span>
              </div>
            </div>
            <Link to="/admin/users" className="stat-link">View All →</Link>
          </div>

          {/* Properties Stats */}
          <div className="stat-card properties">
            <div className="stat-icon">🏠</div>
            <div className="stat-info">
              <h3>Total Properties</h3>
              <p className="stat-number">{stats?.properties.total || 0}</p>
              <div className="stat-breakdown">
                <span>◈ Available: {stats?.properties.available || 0}</span>
                <span>◈ Rented: {stats?.properties.rented || 0}</span>
              </div>
            </div>
            <Link to="/admin/properties" className="stat-link">View All →</Link>
          </div>

          {/* Bookings Stats */}
          <div className="stat-card bookings">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <h3>Total Bookings</h3>
              <p className="stat-number">{stats?.bookings.total || 0}</p>
              <div className="stat-breakdown">
                <span>◈ Pending: {stats?.bookings.pending || 0}</span>
                <span>◈ Approved: {stats?.bookings.approved || 0}</span>
              </div>
            </div>
            <Link to="/admin/bookings" className="stat-link">View All →</Link>
          </div>

        </div>

        {/* Recent Activities */}
        <div className="recent-activities">
          
          {/* Recent Users */}
          <div className="activity-section">
            <h2>◈ Recent Users</h2>
            <div className="activity-list">
              {recentActivities?.users.map(user => (
                <div key={user._id} className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-details">
                    <p className="activity-name">{user.name}</p>
                    <p className="activity-meta">{user.email} • {user.role}</p>
                  </div>
                  <span className="activity-date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Properties */}
          <div className="activity-section">
            <h2>◈ Recent Properties</h2>
            <div className="activity-list">
              {recentActivities?.properties.map(property => (
                <div key={property._id} className="activity-item">
                  <div className="activity-icon">🏠</div>
                  <div className="activity-details">
                    <p className="activity-name">{property.title}</p>
                    <p className="activity-meta">
                      By {property.owner?.name} • Rs. {property.price}
                    </p>
                  </div>
                  <span className="activity-date">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="activity-section">
            <h2>◈ Recent Bookings</h2>
            <div className="activity-list">
              {recentActivities?.bookings.map(booking => (
                <div key={booking._id} className="activity-item">
                  <div className="activity-icon">📋</div>
                  <div className="activity-details">
                    <p className="activity-name">{booking.property?.title}</p>
                    <p className="activity-meta">
                      By {booking.renter?.name} • {booking.status}
                    </p>
                  </div>
                  <span className="activity-date">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;