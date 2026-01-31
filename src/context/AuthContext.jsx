import { createContext, useState, useEffect } from 'react';
import TokenService from '../services/token.service';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = TokenService.getUser();
        if (user) {
            setUserInfo(user);
        }
        setLoading(false);
    }, []);

    const logIn = (userData) => {
        setUserInfo(userData);
        // TokenService.setUser(userData); // Already called in AuthService.login
    };

    const logout = () => {
        TokenService.removeUser();
        setUserInfo(null);
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logIn, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

