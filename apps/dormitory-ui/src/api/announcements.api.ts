import API from "./axios";
import axios from "axios";

export const getAnnouncements = () => {
    return API.get("/announcements");
};

export const createAnnouncement = (data: any) => {
    return API.post("/announcements", data);
};

export const getAnnouncementById = (id: string) => {
    return API.get(`/announcements/${id}`);
};

export const getAnnouncementByIdForEdit = (id: string) => {
    return API.get(`/announcements/detail/${id}`);
};

export const updateAnnouncement = (id: string, data: any) => {
    return API.patch(`/announcements/${id}`, data);
};

export const deleteAnnouncement = (id: string) => {
    return API.delete(`/announcements/${id}`);
};

const PUBLICAPI = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "",
});

export const getPublicAnnouncements = () => {
    return PUBLICAPI.get("/announcements/public");
};

export const getResidentAnnouncements = () => {
    return API.get(`/announcements/resident`);
};

export const sendLineNotification = (publicId: string) => {
    return API.post(`/announcements/${publicId}/send-line`);
};
