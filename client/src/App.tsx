import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import VisitorForm from './components/VisitorForm';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import SecurityDashboard from './components/SecurityDashboard';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public visitor registration form */}
                <Route path="/register" element={<VisitorForm />} />
                
                {/* Admin routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <AdminDashboard />
                        </>
                    </ProtectedRoute>
                } />
                <Route path="/security" element={
                    <ProtectedRoute>
                        <>
                            <Navbar />
                            <SecurityDashboard />
                        </>
                    </ProtectedRoute>
                } />
                
                {/* Redirect root to appropriate page */}
                <Route path="/" element={
                    localStorage.getItem('token') ? 
                    <Navigate to="/admin" replace /> : 
                    <Navigate to="/login" replace />
                } />
            </Routes>
        </BrowserRouter>
    );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default App; 