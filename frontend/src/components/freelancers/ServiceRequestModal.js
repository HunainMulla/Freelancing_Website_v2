import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from '@stripe/react-stripe-js';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './ServiceRequestModal.css';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const ServiceRequestForm = ({ freelancer, onClose, onSubmit }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        amount: ''
    });

    useEffect(() => {
        // Check authentication on component mount
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to request services');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user makes changes
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Check authentication
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to request services');
            setLoading(false);
            return;
        }

        if (!user) {
            setError('User information is missing');
            setLoading(false);
            return;
        }

        if (!freelancer?._id) {
            setError('Freelancer information is missing');
            setLoading(false);
            return;
        }

        try {
            const requestData = {
                freelancerId: freelancer._id,
                service: {
                    title: formData.title,
                    description: formData.description,
                    amount: parseFloat(formData.amount)
                }
            };

            console.log('Creating service request with data:', requestData);
            console.log('Auth token:', token);
            
            // Create service request
            const requestResponse = await api.post('/services/request', requestData);

            console.log('Service request created:', requestResponse.data);

            if (!requestResponse.data?._id) {
                throw new Error('Service request creation failed - no ID returned');
            }

            // Get payment intent
            const paymentResponse = await api.post(
                `/services/request/${requestResponse.data._id}/payment`
            );

            console.log('Payment intent created:', paymentResponse.data);

            if (!paymentResponse.data?.clientSecret) {
                throw new Error('Payment intent creation failed - no client secret returned');
            }

            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                paymentResponse.data.clientSecret,
                {
                    payment_method: {
                        card: elements.getElement(CardElement),
                    }
                }
            );

            if (stripeError) {
                console.error('Stripe error:', stripeError);
                throw new Error(stripeError.message);
            }

            if (!paymentIntent?.id) {
                throw new Error('Payment confirmation failed - no payment intent ID returned');
            }

            console.log('Payment confirmed with Stripe:', paymentIntent);

            // Update payment status in our backend
            const confirmResponse = await api.post(
                `/services/payment/confirm/${requestResponse.data._id}`,
                { paymentIntentId: paymentIntent.id }
            );

            console.log('Payment status updated:', confirmResponse.data);

            onSubmit();
        } catch (err) {
            console.error('Payment error:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status,
                stack: err.stack,
                headers: err.response?.headers
            });
            
            let errorMessage = 'Failed to process request';
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message.includes('card')) {
                errorMessage = 'Invalid card details. Please check and try again.';
            } else if (err.message.includes('failed')) {
                errorMessage = err.message;
            } else if (err.response?.status === 404) {
                errorMessage = 'Service endpoint not found. Please try again later.';
            } else if (err.response?.status === 401) {
                errorMessage = 'Please log in to continue.';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="service-request-form">
            <h3>Request Service from {freelancer.username}</h3>
            
            <div className="form-group">
                <label>Service Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Website Development"
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe what you need..."
                    rows="4"
                />
            </div>

            <div className="form-group">
                <label>Amount ($)</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    step="0.01"
                    placeholder="Enter amount"
                />
            </div>

            <div className="form-group">
                <label>Card Details</label>
                <div className="card-element">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#424770',
                                    '::placeholder': {
                                        color: '#aab7c4',
                                    },
                                },
                                invalid: {
                                    color: '#9e2146',
                                },
                            },
                        }}
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !stripe}
                >
                    {loading ? 'Processing...' : 'Submit Request'}
                </button>
            </div>
        </form>
    );
};

const ServiceRequestModal = (props) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <Elements stripe={stripePromise}>
                    <ServiceRequestForm {...props} />
                </Elements>
            </div>
        </div>
    );
};

export default ServiceRequestModal; 