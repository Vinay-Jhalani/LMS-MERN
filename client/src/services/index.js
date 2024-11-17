import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

export async function registerServices(formData) {
  const { data } = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return data;
}

export async function loginServices(formData) {
  const { data } = await axiosInstance.post("/auth/login", {
    ...formData,
  });
  return data;
}

export async function checkAuthService() {
  const { data } = await axiosInstance.get("/auth/check-auth");
  return data;
}

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/refresh",
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    sessionStorage.setItem("accessToken", JSON.stringify(newAccessToken));
    return newAccessToken;
  } catch (error) {
    console.log("Error refreshing token:", error);
    // Optionally, handle logout or redirect to login
    return null;
  }
};
