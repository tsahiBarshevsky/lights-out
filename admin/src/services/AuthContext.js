import React, { useContext, useState, useEffect, createContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from './firebase';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
            if (user && location.pathname === '/')
                navigate('dashboard', { replace: true });
        });
    }, [user, navigate, location]);

    const value = { user };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}