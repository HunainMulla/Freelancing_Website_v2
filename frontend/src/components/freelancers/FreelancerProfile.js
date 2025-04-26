import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ServiceRequestModal from './ServiceRequestModal';
import api from '../../utils/api';
import './FreelancerProfile.css';

const FreelancerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [freelancer, setFreelancer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showRequestModal, setShowRequestModal] = useState(false);

    const fetchFreelancerProfile = useCallback(async () => {
        try {
            const response = await api.get(`/users/freelancer/${id}`);
            setFreelancer(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching freelancer profile');
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchFreelancerProfile();
    }, [fetchFreelancerProfile]);

    const handleRequestService = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowRequestModal(true);
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!freelancer) return <div className="not-found">Freelancer not found</div>;

    return (
        <div className="freelancer-profile-container">
            <div className="profile-header">
                <div className="profile-header-content">
                    <div className="profile-picture-container">
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
                    <div className="profile-info">
                        <h2>{freelancer.username}</h2>
                        <span className="profession-badge">{freelancer.profession}</span>
                    </div>
                    {user && user.role === 'client' && (
                        <button 
                            className="btn btn-primary request-service-btn"
                            onClick={handleRequestService}
                        >
                            Request Service
                        </button>
                    )}
                </div>
            </div>

            <div className="profile-section">
                <h3>Professional Details</h3>
                <div className="detail-item">
                    <strong>Hourly Rate:</strong>
                    <p>${freelancer.hourlyRate}/hr</p>
                </div>
                <div className="detail-item">
                    <strong>Rating:</strong>
                    <p>{freelancer.rating ? `${freelancer.rating.toFixed(1)}/5` : 'No ratings yet'}</p>
                </div>
                <div className="detail-item">
                    <strong>Completed Jobs:</strong>
                    <p>{freelancer.completedJobs || 0}</p>
                </div>
            </div>

            <div className="profile-section">
                <h3>About</h3>
                <p className="description">{freelancer.description}</p>
            </div>

            <div className="profile-section">
                <h3>Professional Background</h3>
                <p className="background">{freelancer.background}</p>
            </div>

            <div className="profile-section">
                <h3>Skills</h3>
                <div className="skills-list">
                    {freelancer.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                    ))}
                </div>
            </div>

            {freelancer.portfolio && freelancer.portfolio.length > 0 && (
                <div className="profile-section">
                    <h3>Portfolio</h3>
                    <div className="portfolio-grid">
                        {freelancer.portfolio.map((work, index) => (
                            <div key={index} className="portfolio-item">
                                <img src={work.imageUrl} alt={work.title} />
                                <div className="portfolio-item-details">
                                    <h4>{work.title}</h4>
                                    <p>{work.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showRequestModal && (
                <ServiceRequestModal
                    freelancer={freelancer}
                    onClose={() => setShowRequestModal(false)}
                    onSubmit={() => {
                        setShowRequestModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default FreelancerProfile; 