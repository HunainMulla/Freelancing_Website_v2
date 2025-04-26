import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './JobList.css';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // 'all', 'jobs', 'services'

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/jobs');
            setJobs(res.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching jobs');
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filter === 'all') return matchesSearch;
        if (filter === 'jobs') return matchesSearch && job.posterRole === 'client';
        if (filter === 'services') return matchesSearch && job.posterRole === 'freelancer';
        return matchesSearch;
    });

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="jobs-container">
            <div className="jobs-filters">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by title, description, or skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter-btn ${filter === 'jobs' ? 'active' : ''}`}
                        onClick={() => setFilter('jobs')}
                    >
                        Jobs
                    </button>
                    <button
                        className={`filter-btn ${filter === 'services' ? 'active' : ''}`}
                        onClick={() => setFilter('services')}
                    >
                        Services
                    </button>
                </div>
            </div>

            <div className="jobs-grid">
                {filteredJobs.map(job => (
                    <div key={job._id} className={`job-card ${job.posterRole}`}>
                        <div className="job-type-badge">
                            {job.posterRole === 'freelancer' ? 'Service' : 'Job'}
                        </div>
                        <h3>{job.title}</h3>
                        <p>{job.description.substring(0, 150)}...</p>
                        <div className="job-details">
                            <span className="budget">
                                {job.posterRole === 'freelancer' ? 'Rate' : 'Budget'}: ${job.budget}
                            </span>
                            <div className="skills">
                                {job.skills.map((skill, index) => (
                                    <span key={index} className="skill-tag">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="job-footer">
                            <span className="posted-by">
                                Posted by: {job.client?.username || 'Unknown User'}
                            </span>
                            <Link to={`/jobs/${job._id}`} className="btn btn-primary">
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            {filteredJobs.length === 0 && (
                <div className="no-jobs">
                    No {filter === 'services' ? 'services' : 'jobs'} found matching your search criteria.
                </div>
            )}
        </div>
    );
};

export default JobList; 