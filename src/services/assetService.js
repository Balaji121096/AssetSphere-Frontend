import API from "../api/axios";

export const getAssets = async () => {

    const response = await API.get("/assets");

    return response.data;

};