import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "http://192.168.1.158:5000/api";
const cleanBaseURL = rawBaseURL.replace(/\/+$/, "");
const baseURL = cleanBaseURL.endsWith("/api") ? cleanBaseURL : `${cleanBaseURL}/api`;

const API = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json"
    }
});

API.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }

    return config;
});

export default API;
