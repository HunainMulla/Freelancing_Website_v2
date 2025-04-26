import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateJob = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        skills: '',
        deadline: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const { title, description, budget, skills, deadline } = formData;

    const onChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async e => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            const skillsArray = skills.split(',').map(skill => skill.trim());

            const jobData = {
                title,
                description,
                budget: Number(budget),
                skills: skillsArray,
                deadline: deadline || undefined
            };

            await axios.post('http://localhost:5000/api/jobs', jobData, config);
            navigate('/jobs');
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating job');
        }
    };

    return (
        <div className="create-job-container">
            <h2>Post a New Job</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                        placeholder="Enter job title"
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={description}
                        onChange={onChange}
                        required
                        placeholder="Enter detailed job description"
                        rows="5"
                    />
                </div>
                <div className="form-group">
                    <label>Budget ($)</label>
                    <input
                        type="number"
                        name="budget"
                        value={budget}
                        onChange={onChange}
                        required
                        min="1"
                        placeholder="Enter budget amount"
                    />
                </div>
                <div className="form-group">
                    <label>Skills Required (comma-separated)</label>
                    <input
                        type="text"
                        name="skills"
                        value={skills}
                        onChange={onChange}
                        required
                        placeholder="e.g., React, Node.js, MongoDB"
                    />
                </div>
                <div className="form-group">
                    <label>Deadline (optional)</label>
                    <input
                        type="date"
                        name="deadline"
                        value={deadline}
                        onChange={onChange}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Post Job
                </button>
            </form>
        </div>
    );
};

export default CreateJob; 