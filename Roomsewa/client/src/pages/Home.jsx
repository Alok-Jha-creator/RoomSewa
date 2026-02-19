import { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PropertyCard from '../components/PropertyCard';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import { getAllProperties } from '../api/Services';
import './Home.css';

function Home() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  const fetchFeaturedProperties = async () => {
    try {
      setLoading(true);
      setSearched(false);
      const data = await getAllProperties({ limit: 6 });
      if (data && data.listings) {
        setProperties(data.listings);
      } else if (data && Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async ({ searchTerm, location }) => {
    try {
      setLoading(true);
      setSearched(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (location)   params.city   = location;
      const data = await getAllProperties(params);
      if (data && data.listings) {
        setProperties(data.listings);
      } else if (data && Array.isArray(data)) {
        setProperties(data);
      } else {
        setProperties([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Login check handler ──
  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      toast.info('Please login first!');
      navigate('/login');
    }
  };

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            System Online · Nepal Rental Network
          </div>
          <h1>
            <span className="solid">Find Your Perfect</span>{' '}
            <span className="highlight">Room in Nepal</span>
          </h1>
          <p>Thousands of verified rooms and flats available across the galaxy</p>
          <div className="hero-search-wrap">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        <div className="scroll-indicator">Scroll</div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <div className="container">
          <p className="section-label">◈ Protocol</p>
          <h2>How RoomSewa Works</h2>
          <div className="steps">
            <div className="step">
              <span className="step-number">01</span>
              <span className="step-icon">🔍</span>
              <h3>Search</h3>
              <p>Browse thousands of verified properties across Nepal's network</p>
            </div>
            <div className="step">
              <span className="step-number">02</span>
              <span className="step-icon">📋</span>
              <h3>Book</h3>
              <p>Send a booking request directly to property owners</p>
            </div>
            <div className="step">
              <span className="step-number">03</span>
              <span className="step-icon">🏠</span>
              <h3>Move In</h3>
              <p>Connect with the owner and move into your new home</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="featured-properties">
        <div className="container">
          <div className="section-header">
            <div className="section-header-left">
              <span className="section-label">◈ Live Listings</span>
              <h2>{searched ? 'Search Results' : 'Featured Properties'}</h2>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {searched && (
                <button
                  onClick={fetchFeaturedProperties}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(0,245,255,0.3)',
                    color: '#00f5ff',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '3px',
                    cursor: 'pointer',
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    letterSpacing: '0.1em',
                  }}
                >
                  ↺ Reset
                </button>
              )}
              {/* View All — login chaincha */}
              <Link
                to={user ? '/properties' : '/login'}
                className="view-all"
                onClick={(e) => handleProtectedClick(e, '/properties')}
              >
                View All ›
              </Link>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : properties.length === 0 ? (
            <div className="empty-state">
              <p style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.85rem',
                color: 'rgba(0,245,255,0.4)',
                letterSpacing: '0.1em',
                marginBottom: '1.5rem',
              }}>
                {searched ? '// No properties found' : '// No properties available yet'}
              </p>
              {searched ? (
                <button className="btn-cta" onClick={fetchFeaturedProperties}>↺ Reset Search</button>
              ) : (
                <Link
                  to={user ? '/add-property' : '/login'}
                  className="btn-cta"
                  onClick={(e) => handleProtectedClick(e, '/add-property')}
                >
                  ⊕ Add First Property
                </Link>
              )}
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2>Have a Property to Rent?</h2>
            <p>List your property and connect with thousands of renters across Nepal's most advanced rental network.</p>
            {/* List Property — login chaincha */}
            <Link
              to={user ? '/add-property' : '/login'}
              className="btn-cta"
              onClick={(e) => handleProtectedClick(e, '/add-property')}
            >
              ⊕ List Your Property
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;