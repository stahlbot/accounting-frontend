import axios from "axios";

export const axiosInstance = axios.create({
  //   baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});
