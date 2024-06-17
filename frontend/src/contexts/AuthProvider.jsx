import React, { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem('user');
        return savedAuth ? JSON.parse(savedAuth) : null;
    });
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!auth) {
                try {
                    localStorage.removeItem('user');
                } catch (error) {
                    console.error('Failed to rehydrate auth:', error);
                }
            } else {
                localStorage.setItem('user', JSON.stringify(auth));
            }
            setIsLoaded(true);
        };

        checkAuth();
    }, []);

    const contextValue = useMemo(() => ({
        auth,
        setAuth,
        isLoaded, 
    }), [auth, isLoaded]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
