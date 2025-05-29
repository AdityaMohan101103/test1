import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScrape = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://test1-pyai.onrender.com/scrape?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status === 'success') {
        setMenuItems(data.items);
      } else {
        setError(data.message || 'Failed to scrape.');
      }
    } catch (err) {
      setError('Something went wrong while fetching.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Zomato Menu Scraper</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter Zomato restaurant URL"
        style={{ width: '60%', padding: 10 }}
      />
      <button onClick={handleScrape} style={{ padding: 10, marginLeft: 10 }}>
        Scrape Menu
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {menuItems.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: 20, width: '100%' }}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sub-category</th>
              <th>Veg/NonVeg</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.item_name}</td>
                <td>{item.price}</td>
                <td>{item.category}</td>
                <td>{item.sub_category}</td>
                <td>{item.dietary_slugs}</td>
                <td>{item.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
