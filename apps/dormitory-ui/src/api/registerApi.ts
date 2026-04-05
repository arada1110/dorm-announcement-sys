import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8888",
});

export const register = (data: any) => {
    return API.post("/register", data);
};
