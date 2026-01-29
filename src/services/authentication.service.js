import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/";

const register = async (username, password) => {
    try {
        return await axios.post(API_URL + "register", {
            username,
            password,
        });
    } catch (error) {
        return error.response;
    }
};

const login = async (username, password) => {
    try {
        return await axios.post(API_URL + "login", {
            username,
            password,
        });
    } catch (error) {
        return error.response;
    }
};

const AuthService = {
    register,
    login,
};

export default AuthService;
