import axios from "axios";

const api = axios.create({
  baseURL: "https://shuz-e-com-backend.onrender.com",
  withCredentials: true,
  headers: { "Cache-Control": "no-cache" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429 || error.response?.status === 403) {
      const unlockAt = error.response.data.retryAfter;
      if (unlockAt) {
        localStorage.setItem("blocked_until", unlockAt);
        // Force state update if component is already mounted
        window.dispatchEvent(new Event("storage"));
      }
    }
    return Promise.reject(error);
  },
);

export default api;
