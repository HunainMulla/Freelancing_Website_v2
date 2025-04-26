import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import Portfolio from './Portfolio';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        bio: '',
        skills: [],
        profession: '',
        hourlyRate: 0,
        background: '',
        description: '',
        rating: 0,
        completedJobs: 0,
        portfolio: []
    });
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
        fetchUserJobs();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/users/profile`, {
                headers: { 'x-auth-token': token }
            });
            setProfile(res.data);
        } catch (err) {
            setError('Error fetching profile');
        }
    };

    const fetchUserJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `http://localhost:5000/api/jobs/user/${user.id}`,
                {
                    headers: { 'x-auth-token': token }
                }
            );
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching jobs');
            setLoading(false);
        }
    };

    const handlePortfolioUpdate = (updatedPortfolio) => {
        setProfile(prev => ({
            ...prev,
            portfolio: updatedPortfolio
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h2>Profile</h2>
                <div className="user-info">
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    {profile.rating > 0 && (
                        <p><strong>Rating:</strong> {profile.rating.toFixed(1)} / 5</p>
                    )}
                    <p><strong>Completed Jobs:</strong> {profile.completedJobs}</p>
                </div>
            </div>

            {user.role === 'freelancer' && (
                <>
                    <div className="freelancer-details">
                        <h3>Professional Details</h3>
                        <div className="detail-item">
                            <strong>Profession:</strong>
                            <p>{profile.profession}</p>
                        </div>
                        <div className="detail-item">
                            <strong>Hourly Rate:</strong>
                            <p>${profile.hourlyRate}/hr</p>
                        </div>
                        <div className="detail-item">
                            <strong>Background:</strong>
                            <p>{profile.background}</p>
                        </div>
                        <div className="detail-item">
                            <strong>Description:</strong>
                            <p>{profile.description}</p>
                        </div>
                    </div>

                    <Portfolio 
                        portfolio={profile.portfolio} 
                        onPortfolioUpdate={handlePortfolioUpdate}
                    />
                </>
            )}

            <div className="profile-details">
                <div className="bio-section">
                    <h3>Bio</h3>
                    <p>{profile.bio || 'No bio added yet'}</p>
                </div>

                <div className="skills-section">
                    <h3>Skills</h3>
                    <div className="skills-list">
                        {profile.skills && profile.skills.length > 0 ? (
                            profile.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <p>No skills added yet</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="jobs-section">
                <h3>{user.role === 'client' ? 'Posted Jobs' : 'Applied Jobs'}</h3>
                <div className="jobs-list">
                    {jobs.length > 0 ? (
                        jobs.map(job => (
                            <div key={job._id} className="job-card">
                                <h4>{job.title}</h4>
                                <p>{job.description.substring(0, 100)}...</p>
                                <div className="job-status">
                                    <span className={`status-badge ${job.status}`}>
                                        {job.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No jobs found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile; 