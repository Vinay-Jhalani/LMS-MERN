import { refreshAccessToken } from "@/services";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

const isTokenExpired = (token) => {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 < Date.now();
};

axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = JSON.parse(sessionStorage.getItem("accessToken"));

    if (accessToken) {
      const decode = isTokenExpired(accessToken);
      console.log(decode);
      if (decode) {
        console.log("Access token expired, refreshing...");
        await refreshAccessToken();
        accessToken = JSON.parse(sessionStorage.getItem("accessToken"));
      }
      config.headers.authorization = `Bearer ${accessToken}`;
      return config;
    } else {
      return config;
    }
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
