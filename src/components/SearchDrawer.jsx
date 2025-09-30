import './SearchDrawer.css';
import { FiX, FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

function SearchDrawer({ onClose, onImageSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchImages = async (searchQuery) => {
    setLoading(true);
    setError(null);
    const url = searchQuery
      ? `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=15`
      : 'https://api.pexels.com/v1/curated?per_page=15';

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      if (!response.ok) {        // Let's create a more informative error message
        if (response.status === 401) {
          throw new Error('Pexels API key is invalid or missing. Please check your .env.local file and restart the server.');
        }
        const errorText = await response.text();
        throw new Error(`Failed to fetch from Pexels: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setResults(data.photos);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch curated photos on initial load
    fetchImages('');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchImages(query);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <span className="drawer-title">Search Pexels</span>
          <button className="drawer-header-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="search-drawer-body">
          <form className="search-bar" onSubmit={handleSearch}>
            <FiSearch className="search-bar-icon" />
            <input
              type="text"
              placeholder="Search for images..."
              className="search-bar-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>
          <div className="search-results-grid">
            {loading && <p>Loading...</p>}
            {error && <p className="search-error">{error}</p>}
            {results.map((photo) => (
              <div key={photo.id} className="search-result-item" onClick={() => onImageSelect(photo.src.large2x)}>
                <img src={photo.src.medium} alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchDrawer;