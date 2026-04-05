import API from "./axios";

export const getUser = () => {
  return API.get("/users");
};

export const getUserById = (id: string) => {
  return API.get(`/users/${id}`);
};
