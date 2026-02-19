import { useState } from 'react';
import './Filter.css';

function Filter({ onFilter }) {
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    type: '',
    city: ''
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({ minPrice: '', maxPrice: '', type: '', city: '' });
    onFilter({});
  };

  return (
    <div className="filter">
      {/* Corner Brackets */}
      <span className="filter-corner tl" />
      <span className="filter-corner tr" />
      <span className="filter-corner bl" />
      <span className="filter-corner br" />

      {/* Heading */}
      <div className="filter-heading">
        <span className="filter-heading-icon">◈</span>
        <span className="filter-heading-text">Filter Properties</span>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Price Range */}
        <div className="filter-group">
          <label>⬡ Price Range</label>
          <div className="price-inputs">
            <input
              type="number"
              name="minPrice"
              placeholder="Min"
              value={filters.minPrice}
              onChange={handleChange}
            />
            <span className="price-separator">—</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Property Type */}
        <div className="filter-group">
          <label>◧ Property Type</label>
          <div className="select-wrap">
            <select name="type" value={filters.type} onChange={handleChange}>
              <option value="">All Types</option>
              <option value="room">Room</option>
              <option value="flat">Flat</option>
              <option value="apartment">Apartment</option>
            </select>
          </div>
        </div>

        {/* City */}
        <div className="filter-group">
          <label>◉ City</label>
          <div className="select-wrap">
            <select name="city" value={filters.city} onChange={handleChange}>
              <option value="">All Cities</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Pokhara">Pokhara</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="filter-buttons">
          <button type="submit" className="btn-apply">⊕ Apply</button>
          <button type="button" onClick={handleReset} className="btn-reset">↺ Reset</button>
        </div>

      </form>
    </div>
  );
}

export default Filter;