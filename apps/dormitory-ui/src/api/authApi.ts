import axios from "axios";
import API from "./axios";

const AUTHAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
});

export const login = (data: { email: string; password: string }) => {
    return AUTHAPI.post("/auth/login", data);
};

export const getMe = () => {
    return API.get("auth/me");
};
