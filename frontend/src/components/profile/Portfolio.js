import React, { useState } from 'react';
import axios from 'axios';

const Portfolio = ({ portfolio, onPortfolioUpdate }) => {
    const [newWork, setNewWork] = useState({
        title: '',
        description: '',
        image: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWork(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setNewWork(prev => ({
                ...prev,
                image: file
            }));
            setError('');
        } else {
            setError('Please select a valid image file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', newWork.title);
            formData.append('description', newWork.description);
            formData.append('image', newWork.image);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:5000/api/users/portfolio',
                formData,
                {
                    headers: {
                        'x-auth-token': token,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            onPortfolioUpdate(response.data.portfolio);
            setNewWork({ title: '', description: '', image: null });
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading work');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (imageId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(
                `http://localhost:5000/api/users/portfolio/${imageId}`,
                {
                    headers: {
                        'x-auth-token': token
                    }
                }
            );
            onPortfolioUpdate(response.data.portfolio);
        } catch (err) {
            setError('Error deleting work');
        }
    };

    return (
        <div className="portfolio-section">
            <h3>Portfolio</h3>
            
            {/* Add new work form */}
            <form onSubmit={handleSubmit} className="add-work-form">
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={newWork.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Project title"
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={newWork.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Describe your work"
                        rows="3"
                    />
                </div>
                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Uploading...' : 'Add Work'}
                </button>
            </form>

            {/* Portfolio grid */}
            <div className="portfolio-grid">
                {portfolio && portfolio.map((work, index) => (
                    <div key={index} className="portfolio-item">
                        <img src={work.imageUrl} alt={work.title} />
                        <div className="portfolio-item-details">
                            <h4>{work.title}</h4>
                            <p>{work.description}</p>
                            <button
                                onClick={() => handleDelete(work._id)}
                                className="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Portfolio; 