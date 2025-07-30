import { useState } from "react";
import axios from "axios";
import { Log } from "logging-middleware/log";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [shortened, setShortened] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/shorten", {
        originalUrl: url,
        customCode: code,
      });

      setShortened(response.data.shortUrl);
      await Log("frontend", "info", "component", `Short URL created: ${response.data.shortUrl}`);
    } catch (err) {
      await Log("frontend", "error", "component", err.message);
    }
  };

  return (
    <div>
      <h2>URL Shortener</h2>
      <input placeholder="Enter URL" value={url} onChange={(e) => setUrl(e.target.value)} />
      <input placeholder="Custom Code" value={code} onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleSubmit}>Shorten</button>
      {shortened && <p>Short URL: <a href={shortened}>{shortened}</a></p>}
    </div>
  );
};

export default HomePage;
