import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;

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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
Api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.log("Internal Server Error");
      } else if (error.response.status === 404) {
        console.log("Not Found");
      }
    }
    return Promise.reject({
      status: error.response.status,
      message: error.response.data.message,
    });
  }
);

export default Api;
