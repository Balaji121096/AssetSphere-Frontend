import API from "../api/axios";

export const loginUser = async (credentials) => {

    const response = await API.post("/auth/login", credentials);

    return response.data;

};