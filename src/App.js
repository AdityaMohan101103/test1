import React, { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleScrape = async () => {
    setError(null);
    setItems([]);
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    let fetchUrl = url.trim();
    if (!fetchUrl.endsWith("/order")) {
      fetchUrl += "/order";
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://test1-pyai.onrender.com/scrape?url=${encodeURIComponent(fetchUrl)}`
      );
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const data = await res.json();
      if (data.status === "success") {
        if (data.items.length === 0) {
          setError("No items found for this URL.");
        }
        setItems(data.items);
      } else {
        setError(data.message || "Error scraping data.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data.");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h1>Zomato Menu Scraper</h1>
      <input
        type="text"
        placeholder="Enter Zomato restaurant URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: 10, fontSize: 16 }}
      />
      <button onClick={handleScrape} style={{ marginTop: 10, padding: "10px 20px" }}>
        Scrape Menu
      </button>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {items.length > 0 && (
        <table
          style={{ marginTop: 20, width: "100%", borderCollapse: "collapse" }}
          border="1"
        >
          <thead>
            <tr>
              <th>Restaurant</th>
              <th>Category</th>
              <th>Sub-category</th>
              <th>Veg/NonVeg</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.restaurant}</td>
                <td>{item.category}</td>
                <td>{item.sub_category}</td>
                <td>{item.dietary_slugs}</td>
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
