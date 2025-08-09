import React, { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import CalibrationPage from './pages/CalibrationPage.jsx';
import CameraAccessDeniedPage from './pages/CameraAccessDeniedPage.jsx';
import DevelopersPage from './pages/DevelopersPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import HomePage from './pages/HomePage.jsx';
import IncompatibleBrowserPage from './pages/IncompatibleBrowserPage.jsx';
import LaunchPage from './pages/LaunchPage.jsx';
import PrivacyNotesPage from './pages/PrivacyNotesPage.jsx';
import SessionSummaryPage from './pages/SessionSummaryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';
import UserMonitoringPage from './pages/UserMonitoringPage.jsx';
import Header from './components/Header/Header';
import TimeLogger from './components/AdminDashboard/TimeLogger.jsx';
import AllStatsPage from './pages/AllStatsPage.jsx';
import AllActiveUsersPage from './pages/AllActiveUsersPage.jsx';
import AllHistoryPage from './pages/AllHistoryPage.jsx';
import './App.css';
import "./styles/variables.css"

import { MobileGuard } from './utils/MobileGuard';
import ProtectedRoute from './context/ProtectedRoute';
import Footer from './components/Footer/Footer.jsx';
import NewSession from './pages/NewSession';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import GuestLimitPage from './pages/GuestLimitPage.jsx';
import { NotificationProvider } from './context/NotificationContext';

const AppContent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisited');
        if (!hasVisited && location.pathname !== '/launch') {
            navigate('/launch');
            localStorage.setItem('hasVisited', 'true');
        }
    }, [location.pathname, navigate]);

    const hiddenPaths = ['/settings', '/help', '/privacy-notes', '/developers', '/launch', '/login', '/signup', '/guest-limit', '/calibration'];
    const showHeader = !hiddenPaths.includes(location.pathname);
    const hiddenFooterPaths = ['/login', '/signup', '/guest-limit', '/calibration'];
    const showFooter = !hiddenFooterPaths.includes(location.pathname);

    return (
        <div className="App">
            {showHeader && <Header />}
            <main className="main-content">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/guest-limit" element={<GuestLimitPage />} />
                    <Route path="/launch" element={<LaunchPage />} /> {/* Ensure LaunchPage is routed */}
                    <Route path="/" element={<MobileGuard><HomePage /></MobileGuard>} />
                    {/* Protected Routes */}
                    <Route path="/sessionSummary" element={<SessionSummaryPage />} />
                    <Route path="/session-summary" element={<SessionSummaryPage />} />
                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/user-management" element={<UserManagementPage />} />
                        <Route path="/all-stats" element={<AllStatsPage />} />
                        <Route path="/all-active-users" element={<AllActiveUsersPage />} />
                        <Route path="/all-history" element={<AllHistoryPage />} />
                        <Route path="/newSession" element={<NewSession />} />
                        <Route path="/calibration" element={<CalibrationPage />} />
                        <Route path="/camera-access-denied" element={<CameraAccessDeniedPage />} />
                        <Route path="/developers" element={<DevelopersPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/incompatible-browser" element={<IncompatibleBrowserPage />} />
                        <Route path="/privacy-notes" element={<PrivacyNotesPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/user-monitoring" element={<UserMonitoringPage />} />
                        <Route path="/admin/TimeLogger" element={< TimeLogger />} />
                    </Route>
                </Routes>
            </main>
            {showFooter && <Footer />}
        </div>
    );
}

const App = () => {
    return (
        <Router>
            <Analytics />
            <NotificationProvider>
                <AppContent />
            </NotificationProvider>
        </Router>
    );
}

export default App;