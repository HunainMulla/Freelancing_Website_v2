import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './FreelancerDashboard.css';

const FreelancerDashboard = () => {
    const { user } = useAuth();
    const [serviceRequests, setServiceRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServiceRequests = async () => {
            try {
                const response = await api.get('/services/requests');
                console.log('Fetched requests:', response.data); // Debug log
                
                // No need to filter here as the backend already filters by user
                setServiceRequests(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching service requests:', err.response?.data || err.message);
                setError(err.response?.data?.message || 'Failed to load service requests');
                setLoading(false);
            }
        };

        if (user && user.role === 'freelancer') {
            fetchServiceRequests();
        } else {
            setError('Access denied. Only freelancers can view this page.');
            setLoading(false);
        }
    }, [user]);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'status-badge pending';
            case 'accepted':
                return 'status-badge accepted';
            case 'rejected':
                return 'status-badge rejected';
            case 'paid':
                return 'status-badge paid';
            case 'completed':
                return 'status-badge completed';
            default:
                return 'status-badge';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleStatusUpdate = async (requestId, newStatus) => {
        try {
            const response = await api.patch(`/services/request/${requestId}/status`, { status: newStatus });
            
            // Update the local state with the updated request
            setServiceRequests(prevRequests => 
                prevRequests.map(req => 
                    req._id === requestId ? response.data : req
                )
            );
        } catch (err) {
            console.error('Error updating request status:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Failed to update request status');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="freelancer-dashboard">
            <div className="dashboard-header">
                <h2>Welcome, {user.username}!</h2>
                <p className="profession">{user.profession}</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h3>Total Requests</h3>
                    <p>{serviceRequests.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Pending Requests</h3>
                    <p>{serviceRequests.filter(req => req.status === 'pending').length}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Jobs</h3>
                    <p>{serviceRequests.filter(req => req.status === 'completed').length}</p>
                </div>
            </div>

            <div className="service-requests-section">
                <h3>Service Requests</h3>
                {serviceRequests.length === 0 ? (
                    <p className="no-requests">No service requests yet.</p>
                ) : (
                    <div className="service-requests-list">
                        {serviceRequests.map((request) => (
                            <div key={request._id} className="service-request-card">
                                <div className="request-header">
                                    <h4>{request.service.title}</h4>
                                    <span className={getStatusBadgeClass(request.status)}>
                                        {request.status}
                                    </span>
                                </div>
                                <p className="request-description">{request.service.description}</p>
                                <div className="request-details">
                                    <span>Amount: ${request.service.amount}</span>
                                    <span>Client: {request.client.username}</span>
                                    <span>Requested: {formatDate(request.createdAt)}</span>
                                </div>
                                {request.status === 'pending' && (
                                    <div className="request-actions">
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => handleStatusUpdate(request._id, 'accepted')}
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleStatusUpdate(request._id, 'rejected')}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FreelancerDashboard; 