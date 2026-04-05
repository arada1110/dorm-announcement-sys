import API from "./axios";

export const getInviteCode = () => {
    return API.get("/invites");
};

export const createInviteCode = (payload: { room_id: number }) => {
    return API.post("/invites", payload);
};

export const deleteInviteCode = (id: number) => {
    return API.delete(`/invites/${id}`);
};
