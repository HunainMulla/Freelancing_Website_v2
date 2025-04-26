const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    profilePicture: {
        type: String,
        default: null // Store the base64 string of the image
    },
    role: {
        type: String,
        enum: {
            values: ['client', 'freelancer'],
            message: 'Role must be either client or freelancer'
        },
        required: [true, 'Role is required']
    },
    // Freelancer specific fields
    profession: {
        type: String,
        required: [
            function() { return this.role === 'freelancer'; },
            'Profession is required for freelancers'
        ]
    },
    hourlyRate: {
        type: Number,
        required: [
            function() { return this.role === 'freelancer'; },
            'Hourly rate is required for freelancers'
        ],
        min: [0, 'Hourly rate cannot be negative']
    },
    background: {
        type: String,
        required: [
            function() { return this.role === 'freelancer'; },
            'Background information is required for freelancers'
        ]
    },
    description: {
        type: String,
        required: [
            function() { return this.role === 'freelancer'; },
            'Description is required for freelancers'
        ]
    },
    portfolio: [portfolioSchema],
    skills: [{
        type: String,
        trim: true
    }],
    bio: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    completedJobs: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Remove the password hashing middleware since we're handling it in the route
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema); 