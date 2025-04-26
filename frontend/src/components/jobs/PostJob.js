import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './PostJob.css';

const PostJob = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        skills: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Ensure user is authenticated
    if (!user) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const skillsArray = formData.skills
                .split(',')
                .map(skill => skill.trim())
                .filter(skill => skill !== '');

            const jobData = {
                ...formData,
                skills: skillsArray,
                budget: parseFloat(formData.budget),
                posterRole: user.role // Add the role of the poster
            };

            await axios.post(
                'http://localhost:5000/api/jobs',
                jobData,
                {
                    headers: { 'x-auth-token': token }
                }
            );

            navigate('/jobs');
        } catch (err) {
            console.error('Error posting job:', err);
            setError(err.response?.data?.message || 'Error posting job');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-job-container">
            <h2>Post a New Job</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            
            <form onSubmit={handleSubmit} className="post-job-form">
                <div className="form-group">
                    <label htmlFor="title">Job Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter job title"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Job Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        placeholder={user.role === 'freelancer' 
                            ? "Describe your services and what you're offering" 
                            : "Describe the job requirements and expectations"}
                        rows="6"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="budget">
                        {user.role === 'freelancer' ? 'Service Rate ($)' : 'Budget ($)'}
                    </label>
                    <input
                        type="number"
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        min="1"
                        step="0.01"
                        placeholder={user.role === 'freelancer' 
                            ? "Enter your service rate" 
                            : "Enter budget amount"}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">
                        {user.role === 'freelancer' ? 'Available Until' : 'Deadline'}
                    </label>
                    <input
                        type="date"
                        id="deadline"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="skills">
                        {user.role === 'freelancer' ? 'Services Offered' : 'Required Skills'}
                    </label>
                    <input
                        type="text"
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder={user.role === 'freelancer'
                            ? "Enter services (comma-separated)"
                            : "Enter required skills (comma-separated)"}
                    />
                    <small className="form-text">
                        {user.role === 'freelancer'
                            ? "Enter services separated by commas (e.g., Logo Design, Web Development, Content Writing)"
                            : "Enter skills separated by commas (e.g., JavaScript, React, Node.js)"}
                    </small>
                </div>

                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : (user.role === 'freelancer' ? 'Post Service' : 'Post Job')}
                    </button>
                    <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PostJob; 