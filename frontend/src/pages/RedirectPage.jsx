import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Log from "../config/logger";
import '../styles/Redirect.css';

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); // 'loading', 'redirecting', 'error', 'notfound'
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [originalUrl, setOriginalUrl] = useState('');

  useEffect(() => {
    const redirect = async () => {
      try {
        setStatus('loading');
        const response = await axios.get(`http://localhost:9000/api/${shortcode}`);
        
        // Your backend redirects, so if we get here without a redirect,
        // we'll handle it manually by checking the response
        if (response.request.responseURL && response.request.responseURL !== `http://localhost:5000/api/${shortcode}`) {
          // Browser was redirected
          const redirectUrl = response.request.responseURL;
          setOriginalUrl(redirectUrl);
          setStatus('redirecting');
          
          // Start countdown
          let timeLeft = 3;
          const countdownInterval = setInterval(() => {
            timeLeft -= 1;
            setCountdown(timeLeft);
            
            if (timeLeft <= 0) {
              clearInterval(countdownInterval);
              window.location.href = redirectUrl;
            }
          }, 1000);
          
          await Log("frontend", "info", "page", `Redirecting to: ${redirectUrl}`);
        } else {
          throw new Error('No redirect occurred');
        }
      } catch (err) {
        await Log("frontend", "error", "page", `Redirect failed: ${err.message}`);
        
        if (err.response?.status === 404) {
          setStatus('notfound');
          setErrorMessage('Short URL not found');
        } else if (err.response?.status === 410) {
          setStatus('error');
          setErrorMessage('This short URL has expired');
        } else {
          setStatus('error');
          setErrorMessage(err.response?.data || err.message || 'An unexpected error occurred');
        }
      }
    };
    
    if (shortcode) {
      redirect();
    } else {
      setStatus('error');
      setErrorMessage('No short code provided');
    }
  }, [shortcode]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRetry = () => {
    setStatus('loading');
    setErrorMessage('');
    window.location.reload();
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="status-content">
            <div className="loading-icon">
              <div className="spinner"></div>
            </div>
            <h2 className="status-title">Finding your link...</h2>
            <p className="status-message">Please wait while we locate your destination</p>
          </div>
        );

      case 'redirecting':
        return (
          <div className="status-content">
            <div className="success-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="status-title">Link found!</h2>
            <p className="status-message">
              Redirecting you to: <span className="destination-url">{originalUrl}</span>
            </p>
            <div className="countdown">
              <div className="countdown-circle">
                <span className="countdown-number">{countdown}</span>
              </div>
              <p className="countdown-text">Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...</p>
            </div>
          </div>
        );

      case 'notfound':
        return (
          <div className="status-content">
            <div className="error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.859-6.127-2.281"></path>
              </svg>
            </div>
            <h2 className="status-title">Link not found</h2>
            <p className="status-message">
              The short URL <strong>{shortcode}</strong> doesn't exist or has expired
            </p>
            <div className="action-buttons">
              <button onClick={handleGoHome} className="btn btn-primary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Go Home
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="status-content">
            <div className="error-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.178 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <h2 className="status-title">Something went wrong</h2>
            <p className="status-message">
              {errorMessage || 'Unable to process your request'}
            </p>
            <div className="action-buttons">
              <button onClick={handleRetry} className="btn btn-secondary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Try Again
              </button>
              <button onClick={handleGoHome} className="btn btn-primary">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="btn-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Go Home
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="redirect-page">
      <div className="redirect-container">
        <div className="redirect-card">
          {renderContent()}
        </div>
        
        <div className="footer-info">
          <p>Short URL: <span className="shortcode">/{shortcode}</span></p>
        </div>
      </div>
    </div>
  );
};

export default RedirectPage;