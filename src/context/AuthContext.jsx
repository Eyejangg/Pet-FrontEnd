import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const logIn = (userData) => {
        setUserInfo(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setUserInfo(null);
        localStorage.removeItem('userInfo');
    };

    return (
        <UserContext.Provider value={{ userInfo, setUserInfo, logIn, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};

