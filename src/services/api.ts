import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const token = JSON.parse(
  Cookies.get("proj.parish.token") ?? JSON.stringify({ token: "" })
).token;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status == 401) {
      Cookies.remove("proj.parish.token");
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
    }

    return Promise.reject(error);
  }
);

export const loginApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

loginApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error?.response?.status == 401) {
      Cookies.remove("proj.parish.token");
      const currentPath = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(
        currentPath
      )}`;
    }

    return Promise.reject(error);
  }
);
