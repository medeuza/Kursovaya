import axios from "axios";

const API_URL = "http://localhost:8000/users/login/";
const USER_INFO_URL = "http://localhost:8000/users/me/";

export const login = async (username, password) => {
    try {
        const response = await axios.post(
            API_URL,
            { username, password },
            {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            }
        );

        const { access, refresh } = response.data;
        localStorage.setItem("access_token", access);
        localStorage.setItem("refresh_token", refresh);
        axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;

        const userResponse = await axios.get(USER_INFO_URL, {
            headers: { Authorization: `Bearer ${access}` },
        });

        localStorage.setItem("user_id", userResponse.data.id);
        return true;
    } catch (error) {
        console.error("Ошибка авторизации:", error);
        throw error.response?.data?.detail || "Ошибка входа";
    }
};
