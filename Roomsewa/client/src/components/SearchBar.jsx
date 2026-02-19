import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import './SearchBar.css';

const PROPERTY_TYPES = ['Room', 'Flat', 'Apartment', 'House'];
const CITIES = ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Biratnagar', 'Chitwan'];

function SearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [scanning, setScanning] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const { user } = useContext(AuthContext); // ← Get user from context
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // ✅ Check if user is logged in
    if (!user) {
      toast.warning('⚠️ Please login to search properties!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Redirect to login after 1 second
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      
      return; // ← Stop execution
    }
    
    // ✅ User is logged in - proceed with search
    setScanning(true);
    setShowTypeDropdown(false);
    setShowCityDropdown(false);
    
    setTimeout(() => setScanning(false), 1000);
    
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm.toLowerCase());
    if (location) params.set('city', location);
    
    navigate(`/properties?${params.toString()}`);
  };

  const selectType = (type) => {
    setSearchTerm(type);
    setShowTypeDropdown(false);
  };

  const selectCity = (city) => {
    setLocation(city);
    setShowCityDropdown(false);
  };

  return (
    <form className="searchbar-galaxy" onSubmit={handleSubmit}>
      {/* Corner brackets */}
      <span className="sb-corner tl" />
      <span className="sb-corner tr" />
      <span className="sb-corner bl" />
      <span className="sb-corner br" />

      <div className="searchbar-fields">
        {/* ── Property Type ── */}
        <div 
          className="sb-field" 
          onClick={() => { 
            setShowTypeDropdown(!showTypeDropdown); 
            setShowCityDropdown(false); 
          }}
        >
          <span className="sb-icon">◈</span>
          <input
            type="text"
            placeholder="Room, Flat, Apartment..."
            value={searchTerm}
            readOnly
          />
          <span className="sb-arrow">{showTypeDropdown ? '▲' : '▼'}</span>
          
          {showTypeDropdown && (
            <div className="sb-dropdown">
              <div className="sb-dropdown-item sb-all" onClick={() => selectType('')}>
                ◈ All Types
              </div>
              {PROPERTY_TYPES.map(type => (
                <div
                  key={type}
                  className={`sb-dropdown-item ${searchTerm === type ? 'active' : ''}`}
                  onClick={() => selectType(type)}
                >
                  {searchTerm === type ? '◉' : '◈'} {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── City ── */}
        <div 
          className="sb-field" 
          onClick={() => { 
            setShowCityDropdown(!showCityDropdown); 
            setShowTypeDropdown(false); 
          }}
        >
          <span className="sb-icon">◉</span>
          <input
            type="text"
            placeholder="Kathmandu, Pokhara..."
            value={location}
            readOnly
          />
          <span className="sb-arrow">{showCityDropdown ? '▲' : '▼'}</span>
          
          {showCityDropdown && (
            <div className="sb-dropdown">
              <div className="sb-dropdown-item sb-all" onClick={() => selectCity('')}>
                ◉ All Cities
              </div>
              {CITIES.map(city => (
                <div
                  key={city}
                  className={`sb-dropdown-item ${location === city ? 'active' : ''}`}
                  onClick={() => selectCity(city)}
                >
                  {location === city ? '◉' : '◈'} {city}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Button */}
        <button type="submit" className={`sb-btn ${scanning ? 'scanning' : ''}`}>
          <span className="sb-btn-icon">⌖</span>
          <span>{scanning ? 'Scanning...' : 'Search'}</span>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;