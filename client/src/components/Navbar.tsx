import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <span className="navbar-brand">Visitor Management System</span>
                <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar; 