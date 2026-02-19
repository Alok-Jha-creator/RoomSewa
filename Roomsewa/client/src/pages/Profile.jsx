import { useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import Loader from '../components/Loader';
import './Profile.css';

function Profile() {
  const { user, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'renter'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || 'renter'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // await updateUserProfile(formData); ← connect to your API
      updateUser(formData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'renter'
    });
    setEditing(false);
  };

  if (!user) return <Loader />;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">

          {/* ── PROFILE HEADER ── */}
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {user.name?.charAt(0).toUpperCase() || '◉'}
              </div>
            </div>
            <div className="profile-header-info">
              <h1>{user.name}</h1>
              <p className="user-email">◈ {user.email}</p>
              <span className="user-role">
                {user.role === 'owner' ? '🏠 Property Owner' : '🔍 Renter'}
              </span>
            </div>
          </div>

          {/* ── PROFILE INFO / FORM ── */}
          <div className="profile-content">
            <div className="section-header">
              <h2>Profile Information</h2>
              {!editing && (
                <button className="btn-edit" onClick={() => setEditing(true)}>
                  ✦ Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                  <label>◈ Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>◈ Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="input-disabled"
                  />
                  <small>// Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>◈ Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98XXXXXXXX"
                  />
                </div>

                <div className="form-group">
                  <label>◈ Account Type</label>
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="renter">Renter — Looking for room</option>
                    <option value="owner">Owner — Have property to rent</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={loading}>
                    {loading ? '⟳ Saving...' : '◈ Save Changes'}
                  </button>
                  <button type="button" className="btn-cancel" onClick={handleCancel}>
                    ✕ Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <span className="info-value">{user.phone || '// Not provided'}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Type</span>
                  <span className="info-value">
                    {user.role === 'owner' ? 'Property Owner' : 'Renter'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '// N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── STATS ── */}
          <div className="profile-stats">
            <h3>Account Overview</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🏠</span>
                <div className="stat-info">
                  <h4>Properties Listed</h4>
                  <p className="stat-number">0</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📋</span>
                <div className="stat-info">
                  <h4>Active Bookings</h4>
                  <p className="stat-number">0</p>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⭐</span>
                <div className="stat-info">
                  <h4>Reviews</h4>
                  <p className="stat-number">0</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECURITY ── */}
          <div className="profile-security">
            <h3>Security</h3>
            <div className="security-item">
              <div>
                <h4>Password</h4>
                <p>Last changed 30 days ago</p>
              </div>
              <button className="btn-change">◈ Change Password</button>
            </div>
            <div className="security-item">
              <div>
                <h4>Two-Factor Authentication</h4>
                <p>Add an extra layer of security</p>
              </div>
              <button className="btn-enable">⊕ Enable</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;