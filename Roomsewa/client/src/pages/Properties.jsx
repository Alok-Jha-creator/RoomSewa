import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import Filter from '../components/Filter';
import Loader from '../components/Loader';
import { getAllProperties } from '../api/Services';
import './Properties.css';

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [searchParams] = useSearchParams();

  const searchFromURL = searchParams.get('search') || '';
  const cityFromURL   = searchParams.get('city')   || '';

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchFromURL) params.search = searchFromURL;
      if (cityFromURL)   params.city   = cityFromURL;
      const data = await getAllProperties(params);
      if (data && data.listings)       setProperties(data.listings);
      else if (data && Array.isArray(data)) setProperties(data);
      else                              setProperties([]);
    } catch (error) {
      console.error('Error:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = properties;
    if (filters.minPrice) filtered = filtered.filter(p => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) filtered = filtered.filter(p => p.price <= Number(filters.maxPrice));
    if (filters.type)     filtered = filtered.filter(p => p.type === filters.type);
    if (filters.city)     filtered = filtered.filter(p => p.location?.city?.toLowerCase() === filters.city.toLowerCase());
    setProperties(filtered);
  };

  const isSearching = searchFromURL || cityFromURL;

  return (
    <div className="properties-page">

      {/* ── COMPACT HEADER ── */}
      <div className="properties-header">
        <div className="properties-header-inner">
          <h1>{isSearching ? 'Search Results' : 'Find Your Perfect Room'}</h1>
          {isSearching && (
            <div className="search-tags">
              {searchFromURL && <span className="search-tag">◈ {searchFromURL}</span>}
              {cityFromURL   && <span className="search-tag">◉ {cityFromURL}</span>}
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="container">
        <div className="properties-content">

          {/* FILTER — static, no scroll */}
          <aside className={`filter-sidebar ${showFilter ? 'show' : ''}`}>
            <button className="close-filter" onClick={() => setShowFilter(false)}>✕</button>
            <Filter onFilter={handleFilter} />
          </aside>

          {/* PROPERTIES — scrollable */}
          <main className="properties-main">
            <div className="properties-toolbar">
              <p className="results-count">
                {properties.length} {isSearching ? 'results found' : 'properties found'}
              </p>
              <button className="btn-toggle-filter" onClick={() => setShowFilter(!showFilter)}>
                🔍 Filters
              </button>
            </div>

            {loading ? (
              <Loader />
            ) : properties.length === 0 ? (
              <div className="no-results">
                <p className="no-results-code">// No Properties Found</p>
                <p className="no-results-sub">
                  {isSearching
                    ? 'No properties match your search.'
                    : 'No properties available yet.'}
                </p>
              </div>
            ) : (
              <div className="properties-grid">
                {properties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </main>

        </div>
      </div>

    </div>
  );
}

export default Properties;