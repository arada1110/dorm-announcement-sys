import API from "./axios";

export const getLineConfig = (dormitoryId: number) => {
    return API.get("/admin/line/config", { params: { dormitoryId } });
};

export const createLineConfig = (data: Record<string, any>) => {
    return API.post("/admin/line/config", data);
};

export const updateLineConfig = (data: Record<string, any>) => {
    return API.patch("/admin/line/config", data);
};

export const getPublicLineConfig = (dormitoryId: number) => {
    return API.get("/line/config", { params: { dormitoryId } });
};

export const getLinkingToken = () => {
    return API.post("/line/linking-token");
};

export const getLineAccount = () => {
    return API.get("/line/account");
};
