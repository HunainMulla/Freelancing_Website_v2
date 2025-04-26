import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-brand">
                    <Link to="/">FreelanceHub</Link>
                </div>
                <ul className="navbar-nav">
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                    <li>
                        <Link to="/freelancers">Find Freelancers</Link>
                    </li>
                    <li>
                        <Link to="/jobs">Jobs</Link>
                    </li>
                    {user ? (
                        <>
                            {user.role === 'freelancer' && (
                                <li>
                                    <Link to="/dashboard" className="btn btn-primary">Orders</Link>
                                </li>
                            )}
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <button onClick={logout} className="btn btn-danger">
                                    Logout
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar; 