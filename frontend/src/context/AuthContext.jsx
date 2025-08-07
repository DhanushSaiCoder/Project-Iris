
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Assuming a user is logged in if a token exists. 
            // A more robust solution would involve fetching user details from the backend.
            setUser({}); 
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    };

    const signup = async (fullName, email, password) => {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/signup`, { fullName, email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        // After successful signup and login, check for guest session data
        const guestSessionData = localStorage.getItem('guestSessionData');
        if (guestSessionData) {
            try {
                const parsedGuestSessions = JSON.parse(guestSessionData);
                if (parsedGuestSessions.length > 0) {
                    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/session/guest-import`, {
                        userId: res.data.user.id,
                        guestSessions: parsedGuestSessions,
                    });
                    localStorage.removeItem('guestSessionData');
                    localStorage.removeItem('guestSessionsCount');
                    localStorage.removeItem('guestLimitReached');
                    console.log("Guest sessions imported successfully.");
                }
            } catch (error) {
                console.error("Error importing guest sessions:", error);
            }
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
