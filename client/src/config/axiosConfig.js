import axios from "axios";

const api = axios.create({
  baseURL: "https://shuz-e-com-backend.onrender.com/api",
  withCredentials: true,
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const fallbackData = error.response?.data;

    if (
      error.response?.status === 429 ||
      fallbackData?.message?.includes("locked")
    ) {
      // Extract retry timestamp from backend parameters
      const blockExpiry =
        fallbackData.retryAfter || Date.now() + 15 * 60 * 1000;

      localStorage.setItem("blocked_until", blockExpiry);
      alert("Too many request!");
      document.body.style.opacity = "0.6";
      document.body.style.pointerEvents = "none";

      // Dispatch custom message forcing UI to lock screens dynamically
      window.dispatchEvent(new Event("local_blockage"));
    }
    return Promise.reject(error);
  },
);

export default api;
