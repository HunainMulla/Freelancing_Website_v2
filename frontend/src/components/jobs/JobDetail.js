import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './JobDetail.css';

const JobDetail = () => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [candidates, setCandidates] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        fetchJob();
    }, [id]);

    useEffect(() => {
        // Check if the logged-in user is the job owner
        const isOwner = user && job && job.client && 
            (job.client._id === user.id || job.client === user.id);
        
        console.log('Checking job owner conditions:', {
            hasUser: !!user,
            userId: user?.id,
            hasJob: !!job,
            jobClientId: job?.client?._id,
            isOwner,
            jobStatus: job?.status
        });
        
        if (isOwner) {
            fetchCandidates();
        }
    }, [job, user]);

    const fetchJob = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching job details:', {
                jobId: id,
                token: token ? 'present' : 'missing'
            });

            const res = await axios.get(`http://localhost:5000/api/jobs/${id}`, {
                headers: { 'x-auth-token': token }
            });
            
            console.log('Job API response:', {
                hasData: !!res.data,
                jobData: res.data,
                clientInfo: res.data?.client,
                candidates: res.data?.candidates
            });

            if (!res.data) {
                setError('Job not found');
                setLoading(false);
                return;
            }

            setJob(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching job:', {
                error: err,
                response: err.response,
                status: err.response?.status,
                message: err.response?.data?.message
            });
            setError(err.response?.data?.message || 'Error fetching job details');
            setLoading(false);
        }
    };

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Fetching candidates for job:', {
                jobId: id,
                token: token ? 'present' : 'missing',
                endpoint: `http://localhost:5000/api/jobs/${id}/candidates`
            });

            const res = await axios.get(`http://localhost:5000/api/jobs/${id}/candidates`, {
                headers: { 'x-auth-token': token }
            });

            console.log('Raw candidates response:', res);
            console.log('Candidates data:', res.data);
            
            if (Array.isArray(res.data)) {
                setCandidates(res.data);
            } else {
                console.error('Candidates data is not an array:', res.data);
                setCandidates([]);
            }
        } catch (err) {
            console.error('Error fetching candidates:', {
                error: err,
                response: err.response,
                status: err.response?.status,
                message: err.response?.data?.message
            });
            setError(err.response?.data?.message || 'Error fetching candidates');
        }
    };

    const handleApply = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/jobs/${id}/apply`,
                {},
                {
                    headers: { 'x-auth-token': token }
                }
            );
            fetchJob();
        } catch (err) {
            console.error('Error applying for job:', err);
            setError(err.response?.data?.message || 'Error applying for job');
        }
    };

    const handleStatusUpdate = async (status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(
                `http://localhost:5000/api/jobs/${id}/status`,
                { status },
                {
                    headers: { 'x-auth-token': token }
                }
            );
            fetchJob();
        } catch (err) {
            console.error('Error updating job status:', err);
            setError(err.response?.data?.message || 'Error updating job status');
        }
    };

    const handleSelectCandidate = async (candidateId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `http://localhost:5000/api/jobs/${id}/select-candidate`,
                { candidateId },
                {
                    headers: { 'x-auth-token': token }
                }
            );
            fetchJob();
            fetchCandidates();
        } catch (err) {
            console.error('Error selecting candidate:', err);
            setError(err.response?.data?.message || 'Error selecting candidate');
        }
    };

    if (loading) return <div className="job-detail-container">Loading...</div>;
    if (error) return <div className="job-detail-container"><div className="alert alert-danger">{error}</div></div>;
    if (!job) return <div className="job-detail-container">Job not found</div>;

    // Update isJobOwner check to handle both object and string IDs
    const isJobOwner = user && job.client && 
        (job.client._id === user.id || job.client === user.id);

    return (
        <div className="job-detail-container">
            <h2>{job.title}</h2>
            <div className="job-info">
                <p className="description">{job.description}</p>
                <div className="details">
                    <p><strong>{job.posterRole === 'freelancer' ? 'Rate' : 'Budget'}:</strong> ${job.budget}</p>
                    <p><strong>Status:</strong> {job.status}</p>
                    <p><strong>Posted by:</strong> {job.client?.username || 'Unknown User'}</p>
                    {job.deadline && (
                        <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
                    )}
                </div>
                <div className="skills">
                    <h3>{job.posterRole === 'freelancer' ? 'Services Offered' : 'Required Skills'}:</h3>
                    <div className="skill-tags">
                        {job.skills && job.skills.length > 0 ? (
                            job.skills.map((skill, index) => (
                                <span key={index} className="skill-tag">
                                    {skill}
                                </span>
                            ))
                        ) : (
                            <span className="skill-tag">No specific skills listed</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="actions">
                {!user ? (
                    <div className="alert alert-info">
                        Please log in to apply for this job
                    </div>
                ) : job.status !== 'open' ? (
                    <div className="alert alert-info">
                        This job is no longer accepting applications (Status: {job.status})
                    </div>
                ) : job.client?._id === user.id ? (
                    <div className="alert alert-info">
                        You cannot apply to your own job posting
                    </div>
                ) : (user.role === 'freelancer' || user.role === 'client') ? (
                    <>
                        {job.candidates?.some(candidate => candidate._id === user.id) ? (
                            <div className="alert alert-info">
                                You have already applied to this job
                            </div>
                        ) : (
                            <button
                                onClick={handleApply}
                                className="btn btn-primary"
                            >
                                {user.role === 'freelancer' ? 'Apply for Job' : 'Express Interest'}
                            </button>
                        )}
                    </>
                ) : (
                    <div className="alert alert-info">
                        Only freelancers and clients can apply for jobs
                    </div>
                )}
                
                {isJobOwner && (
                    <div className="client-actions">
                        {job.status === 'in-progress' && (
                            <button
                                onClick={() => handleStatusUpdate('completed')}
                                className="btn btn-success"
                            >
                                Mark as Completed
                            </button>
                        )}
                        {job.status === 'open' && (
                            <button
                                onClick={() => handleStatusUpdate('cancelled')}
                                className="btn btn-danger"
                            >
                                Cancel Job
                            </button>
                        )}
                    </div>
                )}

                {user && (
                    <Link to="/post-job" className="btn btn-primary">
                        {user.role === 'freelancer' ? 'Post Service' : 'Post New Job'}
                    </Link>
                )}
            </div>

            {/* Candidates Section - Only visible to job owner */}
            {isJobOwner && (
                <div className="candidates-section">
                    <h3>Candidates ({candidates.length})</h3>
                    {console.log('Rendering candidates:', candidates)}
                    {candidates.length > 0 ? (
                        <div className="candidates-list">
                            {candidates.map(candidate => (
                                <div key={candidate._id} className="candidate-card">
                                    <div className="candidate-info">
                                        <h4>{candidate.username}</h4>
                                        <p><strong>Role:</strong> {candidate.role === 'freelancer' ? 'Freelancer' : 'Client'}</p>
                                        {candidate.role === 'freelancer' ? (
                                            <>
                                                <p><strong>Profession:</strong> {candidate.profession || 'Not specified'}</p>
                                                <p><strong>Hourly Rate:</strong> ${candidate.hourlyRate || 'Not specified'}</p>
                                                <div className="candidate-skills">
                                                    {candidate.skills && candidate.skills.map((skill, index) => (
                                                        <span key={index} className="skill-tag">{skill}</span>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <p><strong>Company:</strong> {candidate.company || 'Not specified'}</p>
                                                {candidate.website && (
                                                    <p><strong>Website:</strong> <a href={candidate.website} target="_blank" rel="noopener noreferrer">{candidate.website}</a></p>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <div className="candidate-actions">
                                        <Link 
                                            to={`/${candidate.role}/${candidate._id}`} 
                                            className="btn btn-secondary"
                                        >
                                            View Profile
                                        </Link>
                                        {job.status === 'open' && (
                                            <button
                                                onClick={() => handleSelectCandidate(candidate._id)}
                                                className="btn btn-success"
                                            >
                                                Select {candidate.role === 'freelancer' ? 'Freelancer' : 'Client'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-candidates">
                            No candidates have applied yet.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobDetail; 