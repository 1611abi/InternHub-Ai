import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AppLayout from './layouts/AppLayout';
import ChatLayout from './layouts/ChatLayout';
import AdminLayout from './layouts/AdminLayout';

// Pages
import Home from './pages/Home';
import InternshipSearch from './pages/InternshipSearch';
import ResumeBuilder from './pages/ResumeBuilder';
import SkillGapAnalyzer from './pages/SkillGapAnalyzer';
import AIChatbot from './pages/AIChatbot';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Tutorial from './pages/Tutorial';
import ATSScorePage from './pages/ATSScorePage';
import JobRecommenderPage from './pages/JobRecommenderPage';

// CareerVault Pages
import CareerVaultHome from './pages/careervault/CareerVaultHome';
import ResourceDetails from './pages/careervault/ResourceDetails';
import AddResource from './pages/careervault/AddResource';
import SavedResources from './pages/careervault/SavedResources';
import FolderPage from './pages/careervault/FolderPage';
import FolderDetails from './pages/careervault/FolderDetails';
import AdminModeration from './pages/careervault/AdminModeration';

// New Dashboard Pages
import SeekerDashboard from './pages/SeekerDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import RecruiterApplicants from './pages/recruiter/RecruiterApplicants';
import AdminDashboard from './pages/admin/AdminDashboard';

// Private Route wrapper
const PrivateRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    if (!token) return <Navigate to="/login" />;
    
    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Main layout with Navbar + Footer */}
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<InternshipSearch />} />
                    <Route path="/tutorial" element={<Tutorial />} />
                    <Route path="/login" element={<Auth />} />
                    <Route path="/resume" element={
                        <PrivateRoute requiredRole="student"><ResumeBuilder /></PrivateRoute>
                    } />
                    <Route path="/dashboard" element={<PrivateRoute><SeekerDashboard /></PrivateRoute>} />
                    <Route path="/seeker-dashboard" element={<PrivateRoute requiredRole="student"><SeekerDashboard /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    
                    {/* Recruiter Protected Routes */}
                    <Route path="/recruiter/dashboard" element={<PrivateRoute requiredRole="recruiter"><RecruiterDashboard /></PrivateRoute>} />
                    <Route path="/recruiter-dashboard" element={<PrivateRoute requiredRole="recruiter"><RecruiterDashboard /></PrivateRoute>} />
                    <Route path="/recruiter/applicants/:jobId" element={<PrivateRoute requiredRole="recruiter"><RecruiterApplicants /></PrivateRoute>} />

                    {/* Student Protected Routes */}
                    <Route path="/job-recommender" element={<PrivateRoute requiredRole="student"><JobRecommenderPage /></PrivateRoute>} />
                    <Route path="/ats-score" element={<PrivateRoute requiredRole="student"><ATSScorePage /></PrivateRoute>} />
                    <Route path="/skill-gap" element={<PrivateRoute requiredRole="student"><SkillGapAnalyzer /></PrivateRoute>} />

                    {/* CareerVault Routes */}
                    <Route path="/careervault" element={<CareerVaultHome />} />
                    <Route path="/careervault/resource/:id" element={<ResourceDetails />} />
                    <Route path="/careervault/folders" element={<FolderPage />} />
                    <Route path="/careervault/folder/:id" element={<FolderDetails />} />
                    <Route path="/careervault/add" element={
                        <PrivateRoute><AddResource /></PrivateRoute>
                    } />
                    <Route path="/careervault/saved" element={
                        <PrivateRoute><SavedResources /></PrivateRoute>
                    } />
                    <Route path="/careervault/admin" element={
                        <PrivateRoute><AdminModeration /></PrivateRoute>
                    } />
                </Route>

                {/* Chat layout — full screen with sidebar, no footer */}
                <Route element={
                    <PrivateRoute><ChatLayout /></PrivateRoute>
                }>
                    <Route path="/chat" element={<AIChatbot />} />
                    <Route path="/chat/:id" element={<AIChatbot />} />
                </Route>

                {/* Admin Layout */}
                <Route element={
                    <PrivateRoute requiredRole="admin"><AdminLayout /></PrivateRoute>
                }>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    {/* Future admin routes will go here, e.g., /admin/users */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
