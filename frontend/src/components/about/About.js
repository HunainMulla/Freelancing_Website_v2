import React from 'react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaUserTie, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';
import './About.css';

const About = () => {
    return (
        <div className="about-container">
            <section className="about-hero">
                <h1>About FreelanceHub</h1>
                <p className="subtitle">Connecting talented freelancers with amazing clients</p>
            </section>

            <section className="about-mission">
                <h2>Our Mission</h2>
                <p>
                    FreelanceHub is dedicated to creating a seamless connection between skilled freelancers 
                    and clients seeking professional services. We believe in fostering a community where talent 
                    meets opportunity, enabling both freelancers and clients to achieve their goals.
                </p>
            </section>

            <section className="how-it-works">
                <h2>How It Works</h2>
                
                <div className="user-guides">
                    <div className="guide-section">
                        <h3>For Freelancers</h3>
                        <div className="guide-steps">
                            <div className="step">
                                <FaUserTie className="step-icon" />
                                <h4>Create Your Profile</h4>
                                <p>Sign up and showcase your skills, experience, and portfolio to stand out.</p>
                            </div>
                            <div className="step">
                                <FaClipboardList className="step-icon" />
                                <h4>Browse Projects</h4>
                                <p>Find projects that match your expertise and submit compelling proposals.</p>
                            </div>
                            <div className="step">
                                <FaMoneyBillWave className="step-icon" />
                                <h4>Get Paid</h4>
                                <p>Complete projects and receive secure payments through our platform.</p>
                            </div>
                        </div>
                        <Link to="/register" className="cta-button">Start Freelancing</Link>
                    </div>

                    <div className="guide-section">
                        <h3>For Clients</h3>
                        <div className="guide-steps">
                            <div className="step">
                                <FaClipboardList className="step-icon" />
                                <h4>Post a Project</h4>
                                <p>Describe your project needs and set your budget.</p>
                            </div>
                            <div className="step">
                                <FaHandshake className="step-icon" />
                                <h4>Choose Freelancers</h4>
                                <p>Review proposals and select the best freelancer for your project.</p>
                            </div>
                            <div className="step">
                                <FaMoneyBillWave className="step-icon" />
                                <h4>Pay Securely</h4>
                                <p>Only pay for work you approve through our secure payment system.</p>
                            </div>
                        </div>
                        <Link to="/register" className="cta-button">Hire Freelancers</Link>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Why Choose FreelanceHub?</h2>
                <div className="features-grid">
                    <div className="feature">
                        <h4>Verified Professionals</h4>
                        <p>All freelancers go through a verification process to ensure quality.</p>
                    </div>
                    <div className="feature">
                        <h4>Secure Payments</h4>
                        <p>Your payments are protected until you're satisfied with the work.</p>
                    </div>
                    <div className="feature">
                        <h4>24/7 Support</h4>
                        <p>Our support team is always here to help you succeed.</p>
                    </div>
                    <div className="feature">
                        <h4>Fair Pricing</h4>
                        <p>Competitive rates that work for both clients and freelancers.</p>
                    </div>
                </div>
            </section>

            <section className="get-started">
                <h2>Ready to Get Started?</h2>
                <p>Join our community of professionals and start your journey today!</p>
                <div className="cta-buttons">
                    <Link to="/register" className="cta-button primary">Create Account</Link>
                    <Link to="/freelancers" className="cta-button secondary">Browse Freelancers</Link>
                </div>
            </section>
        </div>
    );
};

export default About; 