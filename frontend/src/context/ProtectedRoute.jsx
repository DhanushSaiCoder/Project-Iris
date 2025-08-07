
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = () => {
    const { token, loading, user } = useContext(AuthContext);


    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    const guestLimitReached = localStorage.getItem("guestLimitReached");

    // If guest limit reached and user is not logged in, redirect to guest limit page
    if (guestLimitReached === "true" && !user) {
        return <Navigate to="/guest-limit" />;
    }

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
