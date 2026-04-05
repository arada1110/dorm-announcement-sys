import API from "./axios";

export const getLineNotificationLogs = () => {
    return API.get("/line-notification-logs");
};

export const getLogsByAnnouncement = (announcementId: number) => {
    return API.get(`/line-notification-logs/${announcementId}`);
};
