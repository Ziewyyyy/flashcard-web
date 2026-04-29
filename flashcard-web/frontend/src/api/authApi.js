import axiosClient from "./axiosClient";

export const login = (data) => {
    return axiosClient.post("/api/auth/login", data);
}

export const register = (data) => {
  return axios.post(`${API}/register`, data);
};

export const googleLogin = (idToken) => {
  return axios.post(`${API}/google`, { idToken });
}