import axios from "axios";

const API = axios.create({
    baseURL: "http://192.168.1.158:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

API.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }

    return config;
});

export default API;