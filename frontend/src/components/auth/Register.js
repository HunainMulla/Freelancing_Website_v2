import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validateImage, convertToBase64 } from '../../utils/fileUpload';
import './Register.css';

const Register = () => {
    const navigate = useNavigate();
    const { register: authRegister } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client', // default to client
        profession: '',
        hourlyRate: '',
        background: '',
        description: '',
        skills: '',
        portfolio: [], // Initialize empty portfolio array
        profilePicture: null // For storing the base64 image
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const {
        username,
        email,
        password,
        confirmPassword,
        role,
        profession,
        hourlyRate,
        background,
        description,
        skills,
        profilePicture
    } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error when user makes changes
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const validation = validateImage(file);

        if (!validation.isValid) {
            setError(validation.error);
            return;
        }

        try {
            const base64Image = await convertToBase64(file);
            setFormData({ ...formData, profilePicture: base64Image });
            setImagePreview(base64Image);
            setError('');
        } catch (err) {
            console.error('Error converting image:', err);
            setError('Failed to process image. Please try again.');
        }
    };

    const validateForm = () => {
        if (!username || !email || !password || !confirmPassword) {
            setError('Please fill in all required fields');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address');
            return false;
        }

        if (role === 'freelancer') {
            if (!profession || !hourlyRate || !background || !description) {
                setError('Please fill in all freelancer-specific fields');
                return false;
            }
            if (isNaN(hourlyRate) || hourlyRate <= 0) {
                setError('Please enter a valid hourly rate');
                return false;
            }
        }

        return true;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setLoading(true);
            const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
            
            const userData = {
                username,
                email,
                password,
                role,
                profilePicture,
                ...(role === 'freelancer' && {
                    profession,
                    hourlyRate: parseFloat(hourlyRate),
                    background,
                    description,
                    skills: skillsArray,
                    portfolio: [] // Initialize empty portfolio
                })
            };

            console.log('Sending registration data:', userData);

            const success = await authRegister(userData);
            
            if (success) {
                // User will be automatically logged in via AuthContext
                navigate(role === 'freelancer' ? '/freelancer-dashboard' : '/client-dashboard');
            }
        } catch (err) {
            console.error('Registration error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                headers: err.response?.headers
            });
            
            if (err.response?.data?.errors) {
                setError(err.response.data.errors.join('\n'));
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group profile-picture-upload">
                    <label>Profile Picture</label>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageUpload}
                        className="file-input"
                    />
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Profile preview" />
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Username*</label>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={onChange}
                        placeholder="Choose a username"
                        required
                        className={error && !username ? 'invalid' : ''}
                    />
                </div>

                <div className="form-group">
                    <label>Email*</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        placeholder="Your email address"
                        required
                        className={error && !email ? 'invalid' : ''}
                    />
                </div>

                <div className="form-group">
                    <label>Password*</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        placeholder="Choose a password (min. 6 characters)"
                        required
                        className={error && !password ? 'invalid' : ''}
                    />
                </div>

                <div className="form-group">
                    <label>Confirm Password*</label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        placeholder="Confirm your password"
                        required
                        className={error && !confirmPassword ? 'invalid' : ''}
                    />
                </div>

                <div className="form-group">
                    <label>Role*</label>
                    <select
                        name="role"
                        value={role}
                        onChange={onChange}
                        required
                    >
                        <option value="client">Client</option>
                        <option value="freelancer">Freelancer</option>
                    </select>
                </div>

                {role === 'freelancer' && (
                    <>
                        <div className="form-group">
                            <label>Profession*</label>
                            <input
                                type="text"
                                name="profession"
                                value={profession}
                                onChange={onChange}
                                placeholder="e.g., Web Developer, Graphic Designer"
                                required
                                className={error && !profession ? 'invalid' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Hourly Rate ($)*</label>
                            <input
                                type="number"
                                name="hourlyRate"
                                value={hourlyRate}
                                onChange={onChange}
                                placeholder="Your hourly rate"
                                min="1"
                                required
                                className={error && !hourlyRate ? 'invalid' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Professional Background*</label>
                            <textarea
                                name="background"
                                value={background}
                                onChange={onChange}
                                placeholder="Your education, certifications, and work experience"
                                rows="3"
                                required
                                className={error && !background ? 'invalid' : ''}
                            />
                        </div>
                        <div className="form-group">
                            <label>Professional Description*</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={onChange}
                                placeholder="Describe your services and expertise"
                                rows="3"
                                required
                                className={error && !description ? 'invalid' : ''}
                            />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label>Skills (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={skills}
                        onChange={onChange}
                        placeholder="e.g., JavaScript, React, Node.js"
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};

export default Register; 