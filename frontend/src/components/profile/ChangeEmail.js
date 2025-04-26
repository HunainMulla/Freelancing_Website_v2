import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './ChangeEmail.css';

const ChangeEmail = () => {
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (currentEmail !== user.email) {
            setError('Current email does not match your account');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/change-email', {
                currentEmail,
                newEmail,
                password
            });
            
            setMessage(response.data.message);
            
            // Log out the user after successful email change
            setTimeout(() => {
                logout();
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to change email');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-email-container">
            <div className="change-email-card">
                <h2>Change Email Address</h2>
                <p className="instruction">
                    To change your email address, please verify your current email and password.
                </p>

                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="currentEmail">Current Email</label>
                        <input
                            type="email"
                            id="currentEmail"
                            value={currentEmail}
                            onChange={(e) => setCurrentEmail(e.target.value)}
                            required
                            placeholder="Enter your current email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newEmail">New Email</label>
                        <input
                            type="email"
                            id="newEmail"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            required
                            placeholder="Enter your new email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="submit-btn"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update Email'}
                    </button>

                    <div className="back-to-profile">
                        <a href="/profile">Back to Profile</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangeEmail; 