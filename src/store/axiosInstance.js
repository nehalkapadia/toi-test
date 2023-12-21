import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || "https://7593-2409-40c1-8-14f9-6c30-e8e6-94ef-8886.ngrok-free.app";
const token =
  (typeof window !== "undefined" && localStorage.getItem("userToken")) || "";

const axiosInstance = axios.create({
  baseURL: baseURL, // Replace with your API base URL
});

// Add a request interceptor to include the bearer token in all requests
axiosInstance.interceptors.request.use((config) => {
  /* Retrieve the token from your Redux store or wherever it's stored */
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

module.exports = axiosInstance;
