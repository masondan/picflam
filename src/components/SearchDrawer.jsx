import './SearchDrawer.css';
import { FiSearch, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

function SearchDrawer({ onClose, onImageSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPageUrl, setNextPageUrl] = useState(null);

  const fetchImages = async (searchQuery) => {
    setLoading(true);
    setError(null);
    const url = searchQuery
      ? `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=15`
      : 'https://api.pexels.com/v1/curated?per_page=15';

    try {
      console.log('Fetching from Pexels:', url);
      console.log('API Key present:', !!PEXELS_API_KEY);
      const response = await fetch(url, {
        headers: {
          Authorization: PEXELS_API_KEY,
          'Origin': window.location.origin,
          'Referer': window.location.href,
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-Dest': 'empty',
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Fetch-User': '?1',
          'DNT': '1',
          'Upgrade-Insecure-Requests': '1',
        },
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      if (!response.ok) {
        // Let's create a more informative error message
        if (response.status === 401) {
          throw new Error('Pexels API key is invalid or missing. Please check your .env.local file and restart the server.');
        }
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Failed to fetch from Pexels: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      console.log('Success! Received', data.photos?.length || 0, 'photos');
      setResults(searchQuery ? data.photos : [...results, ...data.photos]);
      setNextPageUrl(data.next_page || null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!nextPageUrl) return;
    setLoading(true);
    setError(null);
    try {
      console.log('Loading more from:', nextPageUrl);
      const response = await fetch(nextPageUrl, {
        headers: {
          Authorization: PEXELS_API_KEY,
          'Origin': window.location.origin,
          'Referer': window.location.href,
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Sec-Fetch-Dest': 'empty',
          'Cache-Control': 'no-cache',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Sec-Fetch-User': '?1',
          'DNT': '1',
          'Upgrade-Insecure-Requests': '1',
        },
      });
      console.log('Load more response status:', response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Load more error response:', errorText);
        throw new Error(`Failed to fetch next page from Pexels: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Load more success! Received', data.photos?.length || 0, 'additional photos');
      setResults(prevResults => [...prevResults, ...data.photos]);
      setNextPageUrl(data.next_page || null);
    } catch (err) {
      console.error('Load more fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages('Digital');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchImages(query);
    }
  };

  return (
    <div className="search-modal-overlay" onClick={onClose}>
      <div className="drawer-content search-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-header-button" /> {/* Spacer */}
          <span className="drawer-title flex-grow">Search Pexels</span>
          <button className="drawer-header-button" onClick={onClose}><FiX /></button>
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
            {!loading && nextPageUrl && (
              <button className="load-more-button" onClick={loadMore}>Load More</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchDrawer;