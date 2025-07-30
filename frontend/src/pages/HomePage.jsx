import { useState } from "react";
import axios from "axios";
import Log from "../config/logger";
import '../styles/HomePage.css';

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [shortened, setShortened] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expiryTime, setExpiryTime] = useState("");

  const handleSubmit = async () => {
    if (!url.trim()) return;
    
    // Clear previous error
    setError("");
    
    // Generate shortcode if not provided
    const finalShortcode = code.trim() || Math.random().toString(36).substr(2, 8);
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:9000/api/shorten", {
        url: url,
        shortcode: finalShortcode,
        validity: 30 // 30 minutes default validity
      });

      setShortened(response.data.shortLink);
      setExpiryTime(response.data.expiry);
      await Log("frontend", "info", "component", `Short URL created: ${response.data.shortLink}`);
    } catch (err) {
      let errorMessage = 'An error occurred';
      
      if (err.response?.status === 400) {
        errorMessage = err.response.data.message || 'Invalid input data';
      } else if (err.response?.status === 409) {
        errorMessage = 'This custom code is already in use. Please try a different one.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      await Log("frontend", "error", "component", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortened) {
      await navigator.clipboard.writeText(shortened);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="url-shortener">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
          <h1 className="title">URL Shortener</h1>
          <p className="subtitle">Transform long URLs into short, shareable links</p>
        </div>

        {/* Main Card */}
        <div className="card">
          <div className="form-group">
            <label htmlFor="url" className="label">
              Original URL
            </label>
            <div className="input-wrapper">
              <input
                id="url"
                type="url"
                placeholder="https://example.com/very-long-url..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="input input-with-icon"
              />
              <div className="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="code" className="label">
              Custom Code <span className="optional">(optional)</span>
            </label>
            <input
              id="code"
              type="text"
              placeholder="my-custom-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="input"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!url.trim() || loading}
            className="submit-btn"
          >
            {loading ? (
              <div className="loading-content">
                <div className="loading-spinner"></div>
                Shortening...
              </div>
            ) : (
              "Shorten URL"
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-card">
            <div className="error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.178 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <p className="error-message">{error}</p>
            <button onClick={() => setError("")} className="error-dismiss">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        )}

        {/* Result Card */}
        {shortened && (
          <div className="result-card">
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="result-title">URL Shortened Successfully!</h3>
            
            <div className="result-container">
              <div className="result-content">
                <a 
                  href={shortened} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="result-link"
                >
                  {shortened}
                </a>
                <button
                  onClick={handleCopy}
                  className={`copy-btn ${copied ? 'copy-success' : ''}`}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {copied && (
              <p className="copied-message">
                Copied to clipboard!
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="footer">
          <p>Enter a URL above to create a shortened link that's easy to share</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;