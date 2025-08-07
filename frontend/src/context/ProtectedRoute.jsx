
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = () => {
    const { token, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
