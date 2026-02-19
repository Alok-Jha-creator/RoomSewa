import { useState, useEffect } from 'react';
import { getAllPropertiesAdmin, deletePropertyAdmin } from '../api/Services';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './AdminProperties.css';

function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllPropertiesAdmin();
      setProperties(data.properties || []);
    } catch (error) {
      toast.error('Failed to load properties');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Delete property "${title}"? This will also delete all related bookings.`)) {
      return;
    }

    try {
      await deletePropertyAdmin(id);
      toast.success('Property deleted successfully');
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete property');
    }
  };

  // Filter properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && property.isAvailable) ||
                         (filterStatus === 'rented' && !property.isAvailable);
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) return <Loader />;

  return (
    <div className="admin-properties">
      <div className="container">
        
        {/* Header */}
        <div className="admin-page-header">
          <h1>◈ Properties Management</h1>
          <p className="subtitle">Total Properties: {properties.length}</p>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <input
            type="text"
            placeholder="🔍 Search by title or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="room">Room</option>
            <option value="flat">Flat</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
          </select>
        </div>

        {/* Properties Table */}
        <div className="properties-table-container">
          {filteredProperties.length === 0 ? (
            <div className="no-data">
              <p>No properties found</p>
            </div>
          ) : (
            <table className="properties-table">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Owner</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map(property => (
                  <tr key={property._id}>
                    <td>
                      <div className="property-cell">
                        <div className="property-image">
                          {property.photos?.[0] ? (
                            <img src={property.photos[0]} alt={property.title} />
                          ) : (
                            <div className="no-image">🏠</div>
                          )}
                        </div>
                        <span className="property-title">{property.title}</span>
                      </div>
                    </td>
                    <td>
                      <div className="owner-info">
                        <span className="owner-name">{property.owner?.name}</span>
                        <span className="owner-email">{property.owner?.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`type-badge ${property.type}`}>
                        {property.type}
                      </span>
                    </td>
                    <td className="price-cell">Rs. {property.price?.toLocaleString()}</td>
                    <td>{property.location?.city || '—'}</td>
                    <td>
                      <span className={`status-badge ${property.isAvailable ? 'available' : 'rented'}`}>
                        {property.isAvailable ? 'Available' : 'Rented'}
                      </span>
                    </td>
                    <td>{new Date(property.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/properties/${property._id}`}
                          className="btn-view"
                          title="View property"
                        >
                          👁️
                        </Link>
                        <button
                          onClick={() => handleDeleteProperty(property._id, property.title)}
                          className="btn-delete"
                          title="Delete property"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}

export default AdminProperties;