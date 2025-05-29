// App.js
import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setError('');
    setItems([]);
    setLoading(true);

    try {
      let fetchUrl = url.trim();
      if (!fetchUrl.endsWith('/order')) {
        fetchUrl += '/order';
      }

      // Your Render backend URL here:
      const backendAPI = 'https://test1-pyai.onrender.com/scrape?url=' + encodeURIComponent(fetchUrl);

      const response = await fetch(backendAPI);
      const data = await response.json();

      if (data.status === 'success') {
        setItems(data.items);
      } else {
        setError(data.message || 'Error fetching data');
      }
    } catch (err) {
      setError('Fetch error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Zomato Menu Scraper</h1>
      <input
        type="text"
        placeholder="Enter Zomato restaurant URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '100%', padding: '8px', fontSize: '16px' }}
      />
      <button onClick={fetchData} style={{ marginTop: 10, padding: '10px 20px', fontSize: '16px' }}>
        Scrape Menu
      </button>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {items.map((item, idx) => (
          <li key={idx} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
            <b>{item.item_name}</b> - {item.price} <br />
            <small>
              Category: {item.category} / Sub-category: {item.sub_category}
            </small>
            <p>{item.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
