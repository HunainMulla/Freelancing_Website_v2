import React from 'react';
import JobList from './JobList';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import './Jobs.css';

const Jobs = () => {
    const { user } = useAuth();

    return (
        <div className="jobs-container">
            <div className="jobs-header">
                <h2>Jobs & Services</h2>
                {user && (
                    <Link to="/post-job" className="btn btn-primary">
                        {user.role === 'freelancer' ? 'Post Service' : 'Post New Job'}
                    </Link>
                )}
            </div>
            <JobList />
        </div>
    );
};

export default Jobs; 