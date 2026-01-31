import api from "./api";
import TokenService from "./token.service";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;

const register = async (username, password) => {
    try {
        return await api.post(`${AUTH_URL}/register`, { username, password });
    } catch (error) {
        return error.response;
    }
};

const login = async (username, password) => {
    try {
        const response = await api.post(`${AUTH_URL}/login`, { username, password });
        const { status, data } = response;
        if (status === 200) {
            if (data?.accessToken || data?.token) {
                TokenService.setUser(data);
            }
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

const logout = () => {
    TokenService.removeUser();
};

const AuthService = {
    register,
    login,
    logout,
};

export default AuthService;
