import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../api/Services';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'renter'
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    try {
      setLoading(true);
      const data = await registerUser(formData);
      login(data.user, data.token);
      toast.success('Registration successful! 🎉');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page register">
      <div className="auth-box">

        {/* Corner Brackets */}
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <span className="auth-icon">✦</span>
          </div>
          <h2>Create Account</h2>
          <p className="auth-subtitle">Join RoomSewa Network</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          {/* Name + Phone side by side */}
          <div className="form-row-half">
            <div className="form-group">
              <label>◈ Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>◈ Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder="98XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>◈ Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>◈ Password *</label>
            <input
              type="password"
              name="password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Role selector */}
          <div className="form-group">
            <label>◈ I am a</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-btn ${formData.role === 'renter' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'renter' })}
              >
                <span className="role-icon">🔍</span>
                <span className="role-label">Renter</span>
                <span className="role-sub">Looking for room</span>
              </button>
              <button
                type="button"
                className={`role-btn ${formData.role === 'owner' ? 'active-owner' : ''}`}
                onClick={() => setFormData({ ...formData, role: 'owner' })}
              >
                <span className="role-icon">🏠</span>
                <span className="role-label">Owner</span>
                <span className="role-sub">Have property</span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? '⟳ Creating Account...' : '✦ Register'}
          </button>

        </form>

        {/* Divider */}
        <div className="auth-divider"><span>OR</span></div>

        {/* Link */}
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here ›</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;