import React, { useState } from 'react';

function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    if (!url) return;
    setLoading(true);
    setData([]);
    try {
      const response = await fetch(
        `https://test1-pyai.onrender.com/scrape?url=${encodeURIComponent(url)}`
      );
      const result = await response.json();
      setData(result.items || []);
    } catch (error) {
      alert("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Zomato Menu Scraper</h2>
      <input
        type="text"
        placeholder="Enter Zomato URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: '60%', padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleScrape} style={{ padding: '0.5rem 1rem' }}>
        Scrape Menu
      </button>

      {loading && <p>Loading...</p>}

      {data.length > 0 && (
        <table border="1" cellPadding="8" style={{ marginTop: '2rem', width: '100%' }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Sub-category</th>
              <th>Price</th>
              <th>Veg/NonVeg</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{item.item_name}</td>
                <td>{item.category}</td>
                <td>{item.sub_category}</td>
                <td>{item.price}</td>
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
