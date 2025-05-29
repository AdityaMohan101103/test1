import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setData([]);

    try {
      const response = await fetch(`https://test1-pyai.onrender.com/scrape?url=${encodeURIComponent(url)}`);
      const result = await response.json();

      if (result.status === "success") {
        setData(result.items);
      } else {
        setError(result.message || "Scraping failed.");
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Zomato Menu Scraper</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter Zomato restaurant URL"
          style={{ width: "400px", padding: "10px" }}
        />
        <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>
          Scrape
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {data.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: "20px", width: "100%" }}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Category</th>
              <th>Sub-category</th>
              <th>Dietary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.price}</td>
                <td>{item.desc}</td>
                <td>{item.category}</td>
                <td>{item.sub_category}</td>
                <td>{item.dietary_slugs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
