import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const userData = JSON.parse(localStorage.getItem('user'));
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', {
                email,
                password
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setError(null);
            return res.data.user;
        } catch (err) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed');
            return null;
        }
    };

    const register = async (userData) => {
        try {
            console.log('Sending registration data:', userData);
            
            // Ensure skills is an array
            if (userData.skills && typeof userData.skills === 'string') {
                userData.skills = userData.skills.split(',').map(skill => skill.trim()).filter(Boolean);
            }

            // Ensure hourlyRate is a number if present
            if (userData.hourlyRate) {
                userData.hourlyRate = Number(userData.hourlyRate);
            }

            const res = await api.post('/auth/register', userData);
            console.log('Registration response:', res.data);
            
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setUser(res.data.user);
            setError(null);
            return true;
        } catch (err) {
            console.error('Registration error:', {
                response: err.response?.data,
                status: err.response?.status,
                message: err.message
            });
            setError(err.response?.data?.message || err.response?.data?.errors?.[0] || 'Registration failed');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            loading,
            error,
            clearError: () => setError(null)
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext); 