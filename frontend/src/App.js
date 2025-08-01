import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet, useLocation } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import CaliberationPage from './pages/CaliberationPage.jsx';
import CameraAccessDeniedPage from './pages/CameraAccessDeniedPage.jsx';
import DevelopersPage from './pages/DevelopersPage.jsx';
import HelpPage from './pages/HelpPage.jsx';
import HomePage from './pages/HomePage.jsx';
import IncompatibleBrowserPage from './pages/IncompatibleBrowserPage.jsx';
import LaunchPage from './pages/LaunchPage.jsx';
import PrivacyNotesPage from './pages/PrivacyNotesPage.jsx';
import SessionSummaryPage from './pages/SessionSummaryPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import UserMonitoringPage from './pages/UserMonitoringPage.jsx';
import Header from './components/Header/Header';
import TimeLogger from './components/AdminDashboard/TimeLogger.jsx';
import './App.css';
import "./styles/variables.css"

import { MobileGuard } from './utils/MobileGuard';
import Footer from './components/Footer/Footer.jsx';
import NewSession from './pages/NewSession';

const MobileLayout = () => (
    <MobileGuard>
        <Outlet />
    </MobileGuard>
);

const AppContent = () => {
    const location = useLocation();
    const hiddenPaths = ['/settings', '/help', '/privacy-notes', '/developers', '/launch'];
    const showHeader = !hiddenPaths.includes(location.pathname);


    return (
        <div className="App">
            {showHeader && <Header />}
            <Routes>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route element={<MobileLayout />} />
                    <Route path="/" element={<HomePage />} />
                    <Route path="/newSession" element={<NewSession />} />
                    <Route path="/sessionSummary" element={<SessionSummaryPage />} />
                    <Route path="/caliberation" element={<CaliberationPage />} />
                    <Route path="/camera-access-denied" element={<CameraAccessDeniedPage />} />
                    <Route path="/developers" element={<DevelopersPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/incompatible-browser" element={<IncompatibleBrowserPage />} />
                    <Route path="/launch" element={<LaunchPage />} />
                    <Route path="/privacy-notes" element={<PrivacyNotesPage />} />
                    <Route path="/session-summary" element={<SessionSummaryPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/user-monitoring" element={<UserMonitoringPage />} />
                    <Route path="/admin/TimeLogger" element={ < TimeLogger/>} />
            
            </Routes>
            <Footer />
        </div>
    );
}

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;