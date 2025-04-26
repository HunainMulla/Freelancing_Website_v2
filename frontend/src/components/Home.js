import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaSearch, FaShieldAlt, FaStar, FaRocket } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const { user } = useAuth();

    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to Freelance Hub</h1>
                <p className="hero-text">
                    Your gateway to professional success. Connect with top freelancers and clients worldwide for your next big project.
                </p>
                {!user && (
                    <div className="cta-buttons">
                        <Link to="/register" className="btn btn-primary">
                            <FaRocket className="btn-icon" /> Get Started
                        </Link>
                        <Link to="/login" className="btn btn-secondary">
                            Login
                        </Link>
                    </div>
                )}
            </div>

            <div className="features-section">
                <h2>Why Choose FreelancePro?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <FaSearch className="feature-icon" />
                        <h3>Find Top Talent</h3>
                        <p>
                            Access a global network of skilled professionals. Find the perfect match for your project needs with our advanced matching system.
                        </p>
                    </div>
                    <div className="feature-card">
                        <FaShieldAlt className="feature-icon" />
                        <h3>Secure Payments</h3>
                        <p>
                            Your transactions are protected with industry-leading security. Enjoy peace of mind with our secure payment processing system.
                        </p>
                    </div>
                    <div className="feature-card">
                        <FaStar className="feature-icon" />
                        <h3>Quality Work</h3>
                        <p>
                            Get exceptional results from verified professionals. Our freelancers are vetted to ensure top-quality deliverables.
                        </p>
                    </div>
                </div>
            </div>

            <div className="get-started-section">
                <h2>Ready to Start Your Journey?</h2>
                <p>
                    {user
                        ? 'Take the next step in your professional journey. Browse available opportunities or post your project.'
                        : 'Join our thriving community of professionals and start your success story today.'}
                </p>
                {user ? (
                    <div className="action-buttons">
                        <Link to="/jobs" className="btn btn-primary">
                            <FaSearch className="btn-icon" /> Browse Jobs
                        </Link>
                        {user.role === 'client' && (
                            <Link to="/jobs/create" className="btn btn-secondary">
                                <FaRocket className="btn-icon" /> Post a Job
                            </Link>
                        )}
                    </div>
                ) : (
                    <Link to="/register" className="btn btn-primary">
                        <FaRocket className="btn-icon" /> Sign Up Now
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Home; 