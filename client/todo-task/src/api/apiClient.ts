import axios from "axios";
import { getSession } from "../utils/localStorage"

const apiClient = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}`,
    headers: {
        "Content-Type": "application/json",
    }
})

apiClient.interceptors.request.use( 
    (config) => {
        const token = getSession();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default apiClient;