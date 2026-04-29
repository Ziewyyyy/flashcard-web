import axiosClient from "./axiosClient";

export const login = (data) => {
    return axiosClient.post("/api/auth/login", data);
}

export const register = (data) => {
  return axiosClient.post("/api/auth/register", data);
};

export const googleLogin = (idToken) => {
  return axiosClient.post("/api/auth/google", { idToken });
};