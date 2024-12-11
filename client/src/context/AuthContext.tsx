import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
    login: (credentials: { username: string; password: string }) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const login = async (credentials: { username: string; password: string }) => {
        try {
            // Replace with your actual API call
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            
            if (!response.ok) throw new Error('Login failed');
            
            const data = await response.json();
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    return (
        <AuthContext.Provider value={{ login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 