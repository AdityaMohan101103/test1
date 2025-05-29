import React, { useState } from "react";

const BACKEND_URL = "https://test1-pyai.onrender.com";

function App() {
  const [url, setUrl] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setLoading(true);
    setError(null);
    setItems([]);
    try {
      const res = await fetch(`${BACKEND_URL}/scrape?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.status === "success") {
        setItems(data.items);
      } else {
        setError(data.message || "Error fetching data");
      }
    } catch (err) {
      setError("Failed to connect to backend");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Zomato Menu Scraper</h2>
      <input
        type="text"
        placeholder="Enter Zomato restaurant URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "80%", padding: "8px" }}
      />
      <button onClick={handleScrape} disabled={loading} style={{ padding: "8px 12px", marginLeft: "8px" }}>
        {loading ? "Loading..." : "Scrape"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Category</th>
              <th>Sub-category</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.category}</td>
                <td>{item.sub_category}</td>
                <td>{item.item_name}</td>
                <td>{item.price}</td>
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
