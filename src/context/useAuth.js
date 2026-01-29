import { useContext } from 'react';
import { UserContext } from './AuthContext';

// Hook to maintain compatibility with existing components using useAuth
export const useAuth = () => {
    const context = useContext(UserContext);

    // Map new context structure to old structure expected by components
    // Old: { user, logout, loading, ... }
    // New: { userInfo, logout, loading, ... }
    return {
        ...context,
        user: context?.userInfo, // Alias userInfo to user
    };
};
