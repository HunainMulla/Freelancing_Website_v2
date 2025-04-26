import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './FreelancerList.css';

const FreelancerList = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSkills] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchFreelancers();
    }, []);

    const fetchFreelancers = async () => {
        try {
            const response = await api.get('/users/freelancers');
            console.log('Freelancers response:', response.data); // Debug log
            setFreelancers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching freelancers:', err); // Debug log
            setError(err.response?.data?.message || 'Error fetching freelancers');
            setLoading(false);
        }
    };

    const handleHire = (freelancerId) => {
        navigate('/jobs/create', { state: { freelancerId } });
    };

    const handleViewProfile = (freelancerId) => {
        navigate(`/freelancer/${freelancerId}`);
    };

    const filteredFreelancers = freelancers.filter(freelancer => {
        const matchesSearch = freelancer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (freelancer.profession && freelancer.profession.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (freelancer.description && freelancer.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesSkills = selectedSkills.length === 0 || 
            (freelancer.skills && selectedSkills.every(skill => freelancer.skills.includes(skill)));

        return matchesSearch && matchesSkills;
    });

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="freelancers-container">
            <h2>Available Freelancers</h2>
            
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search freelancers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="freelancers-grid">
                {filteredFreelancers.length === 0 ? (
                    <div className="no-freelancers">
                        <p>No freelancers found matching your search criteria.</p>
                    </div>
                ) : (
                    filteredFreelancers.map(freelancer => (
                        <div key={freelancer._id} className="freelancer-card">
                            <div className="freelancer-card-header">
                                <div className="freelancer-profile-pic">
                                    {freelancer.profilePicture ? (
                                        <img 
                                            src={freelancer.profilePicture} 
                                            alt={`${freelancer.username}'s profile`} 
                                            className="profile-picture"
                                        />
                                    ) : (
                                        <div className="profile-picture-placeholder">
                                            {freelancer.username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="freelancer-header-info">
                                    <h3>{freelancer.username}</h3>
                                    <span className="profession-badge">{freelancer.profession}</span>
                                </div>
                            </div>
                            
                            <div className="freelancer-details">
                                <p><strong>Hourly Rate:</strong> ${freelancer.hourlyRate}/hr</p>
                                <p><strong>Rating:</strong> {freelancer.rating ? `${freelancer.rating.toFixed(1)}/5` : 'No ratings yet'}</p>
                                <p><strong>Completed Jobs:</strong> {freelancer.completedJobs || 0}</p>
                            </div>

                            <div className="freelancer-description">
                                <p>{freelancer.description}</p>
                            </div>

                            <div className="skills-list">
                                {freelancer.skills && freelancer.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">{skill}</span>
                                ))}
                            </div>

                            {freelancer.portfolio && freelancer.portfolio.length > 0 && (
                                <div className="portfolio-preview">
                                    <h4>Recent Work</h4>
                                    <div className="portfolio-images">
                                        {freelancer.portfolio.slice(0, 3).map((work, index) => (
                                            <img 
                                                key={index}
                                                src={work.imageUrl}
                                                alt={work.title}
                                                className="portfolio-thumbnail"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="freelancer-actions">
                                <button
                                    onClick={() => handleViewProfile(freelancer._id)}
                                    className="btn btn-secondary view-profile-btn"
                                >
                                    View Profile
                                </button>
                                
                                {user && user.role === 'client' && (
                                    <button
                                        onClick={() => handleHire(freelancer._id)}
                                        className="btn btn-primary hire-btn"
                                    >
                                        Hire Freelancer
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FreelancerList; 