import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Log } from "logging-middleware/log";

const RedirectPage = () => {
  const { shortcode } = useParams();

  useEffect(() => {
    const redirect = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/${shortcode}`);
        window.location.href = response.request.responseURL;
      } catch (err) {
        await Log("frontend", "error", "page", `Redirect failed: ${err.message}`);
      }
    };
    redirect();
  }, [shortcode]);

  return <p>Redirecting...</p>;
};

export default RedirectPage;
