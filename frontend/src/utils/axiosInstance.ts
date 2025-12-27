import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;

const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request interceptor
Api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
Api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        window.location.href = "/login";
      }

      return Promise.reject({
        status,
        ...data,
      });
    }

    return Promise.reject({
      message: error.message || "Network Error",
    });
  }
);

export default Api;
