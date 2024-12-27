// services/apiClient.js
import axios from "axios";

// Set the base URL for all requests
axios.defaults.baseURL = "http://localhost:3000/api/v1";

// Dynamically set the Authorization header
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axios;