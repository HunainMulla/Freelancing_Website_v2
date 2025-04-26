import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const { email, password } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        
        try {
            const userData = await login(email, password);
            if (userData) {
                // Check if user is a freelancer
                if (userData.role === 'freelancer') {
                    navigate('/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login');
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">
                    Login
                </button>
                <div className="register-link">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </form>
        </div>
    );
};

export default Login; 