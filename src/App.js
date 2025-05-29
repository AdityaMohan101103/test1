import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScrape = async () => {
    setLoading(true);
    setError("");
    setData([]);
    try {
      const response = await fetch(
        `https://test1-pyai.onrender.com/scrape?url=${encodeURIComponent(url)}`
      );
      const result = await response.json();
      if (result.status === "success") {
        setData(result.items);
      } else {
        setError(result.message || "Scraping failed");
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Zomato Menu Scraper</h1>
      <input
        type="text"
        value={url}
        placeholder="Enter Zomato restaurant URL"
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "60%", padding: "0.5rem" }}
      />
      <button onClick={handleScrape} style={{ padding: "0.5rem", marginLeft: "1rem" }}>
        Scrape Menu
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: "2rem", width: "100%" }}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Subcategory</th>
              <th>Price</th>
              <th>Veg/Non-Veg</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
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
