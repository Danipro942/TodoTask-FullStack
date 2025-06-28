import apiClient from "../api/apiClient";


export const isAuth = async () => {
    const getStorage = localStorage.getItem('session')
    if (!getStorage) {
        return false;
    }
    const URL = `/api/auth/verify/${getStorage}`;

    try {
        const response = await apiClient.get<{ message: string }>(URL);
        console.log("Response from isAuth:", response.data);
        return true;
    } catch (error) {
        localStorage.removeItem('session');
        return false;
    }

}