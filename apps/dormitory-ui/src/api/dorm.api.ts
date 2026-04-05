import API from "./axios";

export const getBuildings = () => {
    return API.get("/buildings");
};

export const getRoomsByBuilding = (buildingName: string, floor?: number) => {
    const params = new URLSearchParams({ name: buildingName });

    if (typeof floor === "number") {
        params.set("floor", String(floor));
    }

    return API.get(`/rooms?${params.toString()}`);
};

export const getRooms = (floor?: number) => {
    const params = typeof floor === "number" ? `?floor=${floor}` : "";
    return API.get(`/rooms${params}`);
};
