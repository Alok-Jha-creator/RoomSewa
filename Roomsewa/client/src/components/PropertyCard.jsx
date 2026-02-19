import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './PropertyCard.css';


function PropertyCard({ property }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const image =
    property.photos && property.photos.length > 0
      ? property.photos[0]
      : 'https://via.placeholder.com/400x200?text=No+Image';

  const handleViewDetails = (e) => {
    if (!user) {
      e.preventDefault();
      toast.info('Please login to view property details');
      navigate('/login');
    }
  };

  return (
    <div className="property-card">

     

      {/* ── Image ── */}
      <img src={image} alt={property.title} />

      {/* ── Content ── */}
      <div className="card-content">
        <h3>{property.title}</h3>

        <p className="location">
          ◉ {property.location?.address}, {property.location?.city}
        </p>

        <span className="type">{property.type}</span>

        <div className="card-footer">
          <p className="price">Rs. {property.price?.toLocaleString()}/month</p>
          <Link
            to={user ? `/properties/${property._id}` : '/login'}
            className="btn-view"
            onClick={handleViewDetails}
          >
            View
          </Link>
        </div>
      </div>

    </div>
  );
}

export default PropertyCard;