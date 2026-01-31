import api from "./api";
import TokenService from "./token.service";

const register = async (username, password) => {
    try {
        return await api.post("/auth/register", { username, password });
    } catch (error) {
        return error.response;
    }
};

const login = async (username, password) => {
    try {
        const response = await api.post("/auth/login", { username, password });
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
