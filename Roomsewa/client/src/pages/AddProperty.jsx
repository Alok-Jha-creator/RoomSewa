import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { createProperty } from '../api/Services';
import API from '../api/Axios';
import './AddProperty.css';

function AddProperty() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '', description: '', type: 'room', price: '',
    location: { address: '', city: '' },
    amenities: [], photos: []
  });

  const [amenityInput, setAmenityInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'address' || name === 'city') {
      setFormData({ ...formData, location: { ...formData.location, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenityInput.trim()] });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index) => {
    setFormData({ ...formData, amenities: formData.amenities.filter((_, i) => i !== index) });
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (formData.photos.length + files.length > 5) { toast.error('Maximum 5 photos!'); return; }
    try {
      setUploadingPhoto(true);
      const data = new FormData();
      files.forEach(file => data.append('images', file));
      const res = await API.post('/upload/multiple', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFormData({ ...formData, photos: [...formData.photos, ...res.data.urls] });
      toast.success(`${files.length} photo(s) uploaded! ✅`);
    } catch { toast.error('Photo upload failed!'); }
    finally { setUploadingPhoto(false); e.target.value = ''; }
  };

  const removePhoto = (index) => {
    setFormData({ ...formData, photos: formData.photos.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    if (!formData.title || !formData.price || !formData.location.address) {
      toast.error('Please fill all required fields'); return;
    }
    try {
      setLoading(true);
      await createProperty(formData);
      toast.success('Property added! 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add property');
    } finally { setLoading(false); }
  };

  return (
    <div className="add-property-page">
      <div className="ap-container">
        <span className="corner tl" /><span className="corner tr" />
        <span className="corner bl" /><span className="corner br" />

        {/* Header */}
        <div className="ap-header">
          <h1>⊕ Add Property</h1>
          <p className="subtitle">Transmit your listing to the network</p>
        </div>

        <form onSubmit={handleSubmit} className="ap-form">

          {/* ── LEFT COLUMN ── */}
          <div className="ap-col">

            {/* Title */}
            <div className="form-group">
              <label>Property Title *</label>
              <input type="text" name="title" placeholder="e.g., Spacious room in Kathmandu"
                value={formData.title} onChange={handleChange} required />
            </div>

            {/* Description */}
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" placeholder="Describe your property..."
                value={formData.description} onChange={handleChange} rows="3" />
            </div>

            {/* Type + Price */}
            <div className="form-row">
              <div className="form-group">
                <label>Type *</label>
                <div className="select-wrap">
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="room">Room</option>
                    <option value="flat">Flat</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Rent (Rs.) *</label>
                <input type="number" name="price" placeholder="e.g., 10000"
                  value={formData.price} onChange={handleChange} required />
              </div>
            </div>

            {/* Address + City */}
            <div className="form-row">
              <div className="form-group">
                <label>Address *</label>
                <input type="text" name="address" placeholder="e.g., Thamel"
                  value={formData.location.address} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>City *</label>
                <div className="select-wrap">
                  <select name="city" value={formData.location.city} onChange={handleChange} required>
                    <option value="">Select City</option>
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Pokhara">Pokhara</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                    <option value="Biratnagar">Biratnagar</option>
                    <option value="Chitwan">Chitwan</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="ap-col">

            {/* Amenities */}
            <div className="form-group">
              <label>Amenities</label>
              <div className="add-item-group">
                <input type="text" placeholder="WiFi, Parking, Kitchen..."
                  value={amenityInput} onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())} />
                <button type="button" onClick={addAmenity} className="btn-add">⊕</button>
              </div>
              <div className="items-list">
                {formData.amenities.map((a, i) => (
                  <div key={i} className="item-tag">
                    <span>◈ {a}</span>
                    <button type="button" onClick={() => removeAmenity(i)}>✕</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div className="form-group">
              <label>Photos</label>
              <div className="photo-upload-area">
                <label className={`btn-upload ${uploadingPhoto ? 'uploading' : ''}`}>
                  {uploadingPhoto ? '⟳ Uploading...' : '⊕ Upload Photos'}
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload}
                    disabled={uploadingPhoto || formData.photos.length >= 5}
                    style={{ display: 'none' }} />
                </label>
                <span className="upload-hint">// Max 5 · 5MB each</span>
              </div>

              <div className="photos-preview">
                {formData.photos.map((photo, i) => (
                  <div key={i} className="photo-item">
                    <img src={photo} alt={`Property ${i + 1}`} />
                    <button type="button" onClick={() => removePhoto(i)} className="btn-remove">✕</button>
                  </div>
                ))}
              </div>
              {formData.photos.length === 0 && !uploadingPhoto && (
                <p className="helper-text">// No photos uploaded yet</p>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={loading || uploadingPhoto}>
                {loading ? '⟳ Transmitting...' : '⊕ Add Property'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => navigate('/dashboard')}>
                ✕ Cancel
              </button>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
}

export default AddProperty;