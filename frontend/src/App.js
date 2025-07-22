import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import './App.css';

const App = () => {
    return (
        // <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
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
                </Routes>
            </div>
        // </Router>
    );
}

export default App;