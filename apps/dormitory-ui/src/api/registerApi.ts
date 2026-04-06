import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
});

export const register = (data: any) => {
    return API.post("/register", data);
};
